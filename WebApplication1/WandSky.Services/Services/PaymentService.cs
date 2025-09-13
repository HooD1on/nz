using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Services.DTOs.Payment;
using WandSky.Services.Interfaces;
using System.Text.Json;

namespace WandSky.Services.Services
{
    public class PaymentService : WandSky.Services.Interfaces.IPaymentService
    {
        private readonly IConfiguration _configuration;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IBookingRepository _bookingRepository;
        private readonly ILogger<PaymentService> _logger;




        public async Task<Payment?> GetPaymentByStripeIdAsync(string stripePaymentIntentId, Guid userId)
        {
            try
            {
                if (string.IsNullOrEmpty(stripePaymentIntentId))
                {
                    throw new ArgumentException("PaymentIntentId 不能为空", nameof(stripePaymentIntentId));
                }

                var payment = await _paymentRepository.GetByStripeIdAsync(stripePaymentIntentId);

                if (payment == null)
                {
                    _logger.LogWarning("支付记录不存在: {PaymentIntentId}", stripePaymentIntentId);
                    return null;
                }

                if (payment.UserId != userId)
                {
                    _logger.LogWarning("用户无权访问此支付记录: PaymentIntentId={PaymentIntentId}, UserId={UserId}",
                        stripePaymentIntentId, userId);
                    return null;
                }

                return payment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "获取支付记录失败: PaymentIntentId={PaymentIntentId}", stripePaymentIntentId);
                throw;
            }
        }

        public async Task<PaymentIntent> GetStripePaymentIntentAsync(string paymentIntentId)
        {
            try
            {
                if (string.IsNullOrEmpty(paymentIntentId))
                {
                    throw new ArgumentException("PaymentIntentId 不能为空", nameof(paymentIntentId));
                }

                var service = new PaymentIntentService();
                var paymentIntent = await service.GetAsync(paymentIntentId);

                _logger.LogInformation("从 Stripe 获取支付意图成功: {PaymentIntentId}, Status: {Status}",
                    paymentIntentId, paymentIntent.Status);

                return paymentIntent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "从 Stripe 获取支付意图失败: PaymentIntentId={PaymentIntentId}", paymentIntentId);
                throw;
            }
        }

        public async Task UpdatePaymentStatusAsync(string paymentIntentId, string status)
        {
            try
            {
                if (string.IsNullOrEmpty(paymentIntentId))
                {
                    throw new ArgumentException("PaymentIntentId 不能为空", nameof(paymentIntentId));
                }

                if (string.IsNullOrEmpty(status))
                {
                    throw new ArgumentException("Status 不能为空", nameof(status));
                }

                var payment = await _paymentRepository.GetByStripeIdAsync(paymentIntentId);

                if (payment == null)
                {
                    throw new ArgumentException($"支付记录不存在: {paymentIntentId}");
                }

                // 解析支付状态
                if (!Enum.TryParse<PaymentStatus>(status, true, out var paymentStatus))
                {
                    throw new ArgumentException($"无效的支付状态: {status}");
                }

                var oldStatus = payment.Status;
                payment.Status = paymentStatus;

                // 如果状态变为成功，设置支付时间
                if (paymentStatus == PaymentStatus.Succeeded && payment.PaidAt == null)
                {
                    payment.PaidAt = DateTime.UtcNow;
                }

                await _paymentRepository.UpdateAsync(payment);

                _logger.LogInformation("支付状态更新成功: PaymentIntentId={PaymentIntentId}, {OldStatus} -> {NewStatus}",
                    paymentIntentId, oldStatus, paymentStatus);

                // 如果支付成功，可以触发其他业务逻辑
                if (paymentStatus == PaymentStatus.Succeeded && oldStatus != PaymentStatus.Succeeded)
                {
                    await OnPaymentSucceeded(payment);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "更新支付状态失败: PaymentIntentId={PaymentIntentId}, Status={Status}",
                    paymentIntentId, status);
                throw;
            }
        }

        public async Task<bool> ValidatePaymentOwnershipAsync(string paymentIntentId, Guid userId)
        {
            try
            {
                var payment = await GetPaymentByStripeIdAsync(paymentIntentId, userId);
                return payment != null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "验证支付所有权失败: PaymentIntentId={PaymentIntentId}, UserId={UserId}",
                    paymentIntentId, userId);
                return false;
            }
        }

        // 🆕 私有方法：处理支付成功事件
        private async Task OnPaymentSucceeded(Payment payment)
        {
            try
            {
                _logger.LogInformation("触发支付成功事件处理: PaymentId={PaymentId}", payment.Id);

                // 这里可以添加支付成功后的业务逻辑
                // 例如：发送确认邮件、更新库存等

                // 暂时只记录日志
                _logger.LogInformation("支付成功事件处理完成: PaymentId={PaymentId}, Amount={Amount}",
                    payment.Id, payment.Amount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "处理支付成功事件失败: PaymentId={PaymentId}", payment.Id);
                // 不重新抛出异常，避免影响主流程
            }
        }

        public PaymentService(
            IConfiguration configuration,
            IPaymentRepository paymentRepository,
            IBookingRepository bookingRepository,
            ILogger<PaymentService> logger)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _paymentRepository = paymentRepository ?? throw new ArgumentNullException(nameof(paymentRepository));
            _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            // 配置Stripe API密钥
            var stripeSecretKey = _configuration["Stripe:SecretKey"];
            if (!string.IsNullOrEmpty(stripeSecretKey))
            {
                StripeConfiguration.ApiKey = stripeSecretKey;
            }
        }

        public async Task<PaymentIntentResponse> CreatePaymentIntentAsync(CreatePaymentIntentRequest request, Guid userId)
        {
            try
            {
                _logger.LogInformation("开始创建Stripe PaymentIntent: UserId={UserId}, PackageId={PackageId}",
                    userId, request.PackageId);

                ValidateRequest(request);

                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(request.Amount * 100), // 转换为分
                    Currency = request.Currency.ToLower(),
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true,
                    },
                    Metadata = new Dictionary<string, string>
                    {
                        {"user_id", userId.ToString()},
                        {"package_id", request.PackageId},
                        {"customer_name", request.BookingData.CustomerName},
                        {"email", request.BookingData.Email},
                        {"travelers", request.BookingData.Travelers.ToString()},
                        {"travel_date", request.BookingData.TravelDate.ToString("yyyy-MM-dd")}
                    },
                    Description = $"新西兰旅游套餐预订 - {request.BookingData.CustomerName}"
                };

                var service = new PaymentIntentService();
                var paymentIntent = await service.CreateAsync(options);

                _logger.LogInformation("Stripe PaymentIntent创建成功: {PaymentIntentId}", paymentIntent.Id);

                // 保存支付记录到数据库
                var payment = new Payment
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    StripePaymentIntentId = paymentIntent.Id,
                    Amount = request.Amount,
                    Currency = request.Currency,
                    Status = PaymentStatus.Pending,
                    PackageId = request.PackageId,
                    CreatedAt = DateTime.UtcNow,
                    Metadata = JsonSerializer.Serialize(request.BookingData)
                };

                await _paymentRepository.CreateAsync(payment);

                _logger.LogInformation("支付记录已保存到数据库: PaymentId={PaymentId}", payment.Id);

                return new PaymentIntentResponse
                {
                    ClientSecret = paymentIntent.ClientSecret ?? string.Empty,
                    PaymentIntentId = paymentIntent.Id,
                    Status = paymentIntent.Status,
                    Amount = request.Amount,
                    Currency = request.Currency
                };
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Stripe API错误: {Error}", ex.Message);
                throw new InvalidOperationException($"支付服务错误: {ex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "创建支付意图失败");
                throw;
            }
        }

        public async Task HandleWebhookAsync(HttpRequest request)
        {
            try
            {
                _logger.LogInformation("处理Stripe Webhook");

                if (request.Body == null)
                {
                    throw new ArgumentException("Request body is null");
                }

                string json;
                request.Body.Position = 0;
                using (var reader = new StreamReader(request.Body))
                {
                    json = await reader.ReadToEndAsync();
                }

                if (string.IsNullOrEmpty(json))
                {
                    throw new ArgumentException("Request body is empty");
                }

                var stripeSignature = request.Headers["Stripe-Signature"].FirstOrDefault();
                if (string.IsNullOrEmpty(stripeSignature))
                {
                    throw new ArgumentException("Missing Stripe-Signature header");
                }

                var webhookSecret = _configuration["Stripe:WebhookSecret"];
                if (string.IsNullOrEmpty(webhookSecret))
                {
                    _logger.LogWarning("Webhook密钥未配置");
                    throw new InvalidOperationException("Webhook密钥未配置");
                }

                Event stripeEvent;
                try
                {
                    stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, webhookSecret);
                }
                catch (StripeException ex)
                {
                    _logger.LogWarning("Webhook签名验证失败: {Error}", ex.Message);
                    throw new UnauthorizedAccessException("签名验证失败");
                }

                _logger.LogInformation("Webhook事件类型: {EventType}", stripeEvent.Type);

                switch (stripeEvent.Type)
                {
                    case "payment_intent.succeeded":
                        if (stripeEvent.Data.Object is PaymentIntent successPaymentIntent)
                        {
                            await HandlePaymentSucceeded(successPaymentIntent);
                        }
                        break;
                    case "payment_intent.payment_failed":
                        if (stripeEvent.Data.Object is PaymentIntent failedPaymentIntent)
                        {
                            await HandlePaymentFailed(failedPaymentIntent);
                        }
                        break;
                    case "payment_intent.canceled":
                        if (stripeEvent.Data.Object is PaymentIntent canceledPaymentIntent)
                        {
                            await HandlePaymentCanceled(canceledPaymentIntent);
                        }
                        break;
                    default:
                        _logger.LogInformation("未处理的事件类型: {EventType}", stripeEvent.Type);
                        break;
                }
            }
            catch (Exception ex) when (!(ex is UnauthorizedAccessException))
            {
                _logger.LogError(ex, "处理Webhook失败");
                throw;
            }
        }

        public async Task<PaymentStatusResponse> GetPaymentStatusAsync(string paymentIntentId, Guid userId)
        {
            try
            {
                if (string.IsNullOrEmpty(paymentIntentId))
                {
                    throw new ArgumentException("PaymentIntentId不能为空", nameof(paymentIntentId));
                }

                var payment = await _paymentRepository.GetByStripeIdAsync(paymentIntentId);

                if (payment == null)
                {
                    throw new ArgumentException("支付记录不存在");
                }

                if (payment.UserId != userId)
                {
                    throw new UnauthorizedAccessException("无权访问此支付记录");
                }

                var response = new PaymentStatusResponse
                {
                    PaymentIntentId = payment.StripePaymentIntentId,
                    Status = payment.Status.ToString(),
                    Amount = payment.Amount,
                    Currency = payment.Currency,
                    PaidAt = payment.PaidAt,
                    FailureReason = payment.FailureReason
                };

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "获取支付状态失败: PaymentIntentId={PaymentIntentId}", paymentIntentId);
                throw;
            }
        }

        private async Task HandlePaymentSucceeded(PaymentIntent paymentIntent)
        {
            if (paymentIntent?.Id == null) return;

            _logger.LogInformation("支付成功: {PaymentIntentId}", paymentIntent.Id);

            var payment = await _paymentRepository.GetByStripeIdAsync(paymentIntent.Id);
            if (payment != null)
            {
                payment.Status = PaymentStatus.Succeeded;
                payment.PaidAt = DateTime.UtcNow;
                await _paymentRepository.UpdateAsync(payment);

                await CreateOrUpdateBooking(payment, paymentIntent);

                _logger.LogInformation("支付状态已更新为成功");
            }
        }

        private async Task HandlePaymentFailed(PaymentIntent paymentIntent)
        {
            if (paymentIntent?.Id == null) return;

            _logger.LogInformation("支付失败: {PaymentIntentId}", paymentIntent.Id);

            var payment = await _paymentRepository.GetByStripeIdAsync(paymentIntent.Id);
            if (payment != null)
            {
                payment.Status = PaymentStatus.Failed;
                payment.FailureReason = paymentIntent.LastPaymentError?.Message;
                await _paymentRepository.UpdateAsync(payment);

                _logger.LogInformation("支付状态已更新为失败");
            }
        }

        private async Task HandlePaymentCanceled(PaymentIntent paymentIntent)
        {
            if (paymentIntent?.Id == null) return;

            _logger.LogInformation("支付已取消: {PaymentIntentId}", paymentIntent.Id);

            var payment = await _paymentRepository.GetByStripeIdAsync(paymentIntent.Id);
            if (payment != null)
            {
                payment.Status = PaymentStatus.Canceled;
                await _paymentRepository.UpdateAsync(payment);

                _logger.LogInformation("支付状态已更新为已取消");
            }
        }

        private async Task CreateOrUpdateBooking(Payment payment, PaymentIntent paymentIntent)
        {
            try
            {
                if (string.IsNullOrEmpty(payment.Metadata)) return;

                var bookingData = JsonSerializer.Deserialize<BookingDataDto>(payment.Metadata);
                if (bookingData == null) return;

                var existingBooking = await _bookingRepository.GetByPaymentIdAsync(payment.Id);

                if (existingBooking == null)
                {
                    var booking = new Booking
                    {
                        Id = Guid.NewGuid(),
                        UserId = payment.UserId,
                        PackageId = payment.PackageId,
                        PaymentId = payment.Id,
                        Status = BookingStatus.Confirmed,
                        TotalAmount = payment.Amount,
                        Currency = payment.Currency,
                        CustomerName = bookingData.CustomerName,
                        Email = bookingData.Email,
                        Phone = bookingData.Phone,
                        TravelDate = bookingData.TravelDate,
                        Travelers = bookingData.Travelers,
                        SpecialRequests = bookingData.SpecialRequests,
                        ConfirmedAt = DateTime.UtcNow,
                        BookingReference = GenerateBookingReference(),
                        CreatedAt = DateTime.UtcNow
                    };

                    await _bookingRepository.CreateAsync(booking);
                    _logger.LogInformation("新订单已创建: BookingId={BookingId}", booking.Id);
                }
                else
                {
                    existingBooking.Status = BookingStatus.Confirmed;
                    existingBooking.ConfirmedAt = DateTime.UtcNow;
                    await _bookingRepository.UpdateAsync(existingBooking);
                    _logger.LogInformation("订单状态已更新: BookingId={BookingId}", existingBooking.Id);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "创建/更新订单失败");
            }
        }

        private void ValidateRequest(CreatePaymentIntentRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (string.IsNullOrWhiteSpace(request.PackageId))
                throw new ArgumentException("套餐ID不能为空", nameof(request.PackageId));

            if (request.Amount <= 0)
                throw new ArgumentException("金额必须大于0", nameof(request.Amount));

            if (string.IsNullOrWhiteSpace(request.Currency))
                throw new ArgumentException("货币类型不能为空", nameof(request.Currency));

            if (request.BookingData == null)
                throw new ArgumentException("预订信息不能为空", nameof(request.BookingData));

            if (string.IsNullOrWhiteSpace(request.BookingData.CustomerName))
                throw new ArgumentException("客户姓名不能为空");

            if (string.IsNullOrWhiteSpace(request.BookingData.Email))
                throw new ArgumentException("邮箱地址不能为空");

            if (request.BookingData.Travelers <= 0)
                throw new ArgumentException("旅客人数必须大于0");
        }

        private static string GenerateBookingReference()
        {
            return "NZ" + DateTime.UtcNow.ToString("yyyyMMdd") + Guid.NewGuid().ToString("N")[..6].ToUpper();
        }
    }
}