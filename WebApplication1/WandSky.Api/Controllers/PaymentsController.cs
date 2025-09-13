// ===============================================
// 📁 WandSky.Api/Controllers/PaymentsController.cs (完整无Webhook版本)
// ===============================================
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WandSky.Services.DTOs.Payment;
using WandSky.Core.Entities; // 添加这行以使用枚举

namespace WandSky.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly WandSky.Services.Interfaces.IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(
            WandSky.Services.Interfaces.IPaymentService paymentService,
            ILogger<PaymentsController> logger)
        {
            _paymentService = paymentService ?? throw new ArgumentNullException(nameof(paymentService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("create-payment-intent")]
        [Authorize]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { error = "请求数据不能为空" });
                }

                _logger.LogInformation("开始创建支付意图: PackageId={PackageId}, Amount={Amount}",
                    request.PackageId, request.Amount);

                var userId = GetUserId();
                if (userId == null)
                {
                    _logger.LogWarning("无法获取用户ID");
                    return Unauthorized(new { error = "用户认证失败" });
                }

                var result = await _paymentService.CreatePaymentIntentAsync(request, userId.Value);

                _logger.LogInformation("支付意图创建成功: PaymentIntentId={PaymentIntentId}",
                    result.PaymentIntentId);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("请求参数无效: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "业务逻辑错误");
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "创建支付意图失败");
                return StatusCode(500, new { error = "创建支付失败，请稍后重试" });
            }
        }

        // 新增：手动更新支付状态
        [HttpPost("update-status")]
        [Authorize]
        public async Task<IActionResult> UpdatePaymentStatus([FromBody] UpdatePaymentStatusRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { error = "请求数据不能为空" });
                }

                _logger.LogInformation("开始更新支付状态: PaymentIntentId={PaymentIntentId}, Status={Status}",
                    request.PaymentIntentId, request.Status);

                var userId = GetUserId();
                if (userId == null)
                {
                    _logger.LogWarning("无法获取用户ID");
                    return Unauthorized(new { error = "用户认证失败" });
                }

                // 验证支付意图是否属于当前用户
                var payment = await _paymentService.GetPaymentByStripeIdAsync(request.PaymentIntentId, userId.Value);

                if (payment == null)
                {
                    _logger.LogWarning("支付记录不存在或无权限: PaymentIntentId={PaymentIntentId}, UserId={UserId}",
                        request.PaymentIntentId, userId.Value);
                    return NotFound(new { error = "支付记录不存在或无访问权限" });
                }

                // 双重验证：从 Stripe 获取实际状态
                try
                {
                    var stripePaymentIntent = await _paymentService.GetStripePaymentIntentAsync(request.PaymentIntentId);

                    if (stripePaymentIntent.Status != request.Status.ToLower())
                    {
                        _logger.LogWarning("支付状态与 Stripe 不匹配: Local={LocalStatus}, Stripe={StripeStatus}",
                            request.Status, stripePaymentIntent.Status);

                        return BadRequest(new
                        {
                            error = "支付状态与 Stripe 不匹配",
                            stripeStatus = stripePaymentIntent.Status,
                            requestStatus = request.Status.ToLower()
                        });
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "获取 Stripe 支付状态失败: {PaymentIntentId}", request.PaymentIntentId);
                    _logger.LogWarning("无法验证 Stripe 状态，继续更新本地状态");
                }

                // 更新本地支付状态
                await _paymentService.UpdatePaymentStatusAsync(request.PaymentIntentId, request.Status);

                _logger.LogInformation("支付状态更新成功: PaymentIntentId={PaymentIntentId}",
                    request.PaymentIntentId);

                return Ok(new
                {
                    success = true,
                    message = "支付状态更新成功",
                    paymentIntentId = request.PaymentIntentId,
                    status = request.Status
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("请求参数无效: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("业务逻辑错误: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "更新支付状态失败: PaymentIntentId={PaymentIntentId}",
                    request.PaymentIntentId);
                return StatusCode(500, new { error = "更新支付状态失败，请稍后重试" });
            }
        }

        // 新增：获取 Stripe 支付状态
        [HttpGet("stripe-status/{paymentIntentId}")]
        [Authorize]
        public async Task<IActionResult> GetStripePaymentStatus(string paymentIntentId)
        {
            try
            {
                if (string.IsNullOrEmpty(paymentIntentId))
                {
                    return BadRequest(new { error = "支付意图ID不能为空" });
                }

                _logger.LogInformation("获取 Stripe 支付状态: PaymentIntentId={PaymentIntentId}", paymentIntentId);

                var userId = GetUserId();
                if (userId == null)
                {
                    return Unauthorized(new { error = "用户认证失败" });
                }

                // 验证支付意图是否属于当前用户
                var payment = await _paymentService.GetPaymentByStripeIdAsync(paymentIntentId, userId.Value);

                if (payment == null)
                {
                    _logger.LogWarning("支付记录不存在或无权限: PaymentIntentId={PaymentIntentId}, UserId={UserId}",
                        paymentIntentId, userId.Value);
                    return NotFound(new { error = "支付记录不存在或无访问权限" });
                }

                // 从 Stripe 获取最新状态
                var stripePaymentIntent = await _paymentService.GetStripePaymentIntentAsync(paymentIntentId);

                var response = new
                {
                    id = stripePaymentIntent.Id,
                    status = stripePaymentIntent.Status,
                    amount = stripePaymentIntent.Amount,
                    currency = stripePaymentIntent.Currency,
                    created = stripePaymentIntent.Created,
                    localStatus = payment.Status.ToString(),
                    localAmount = payment.Amount,
                    localCurrency = payment.Currency
                };

                _logger.LogInformation("Stripe 支付状态获取成功: PaymentIntentId={PaymentIntentId}, Status={Status}",
                    paymentIntentId, stripePaymentIntent.Status);

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("参数错误: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning("访问权限错误: {Error}", ex.Message);
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "获取 Stripe 支付状态失败: PaymentIntentId={PaymentIntentId}", paymentIntentId);
                return StatusCode(500, new { error = "获取支付状态失败，请稍后重试" });
            }
        }

        // 修改：Webhook 端点（无 Webhook 方案中禁用）
        [HttpPost("webhook")]
        public async Task<IActionResult> HandleWebhook()
        {
            try
            {
                _logger.LogInformation("收到 Webhook 请求 (已禁用)");

                // 在无 Webhook 方案中，返回不可用状态
                return StatusCode(501, new
                {
                    error = "Webhook 功能已禁用",
                    message = "当前使用前端状态更新替代 Webhook 处理",
                    alternative = "请使用 /api/payments/update-status 接口更新支付状态"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Webhook 请求处理失败");
                return BadRequest(new { error = "Webhook 功能不可用" });
            }
        }

        // 保留：获取支付状态（现有方法）
        [HttpGet("status/{paymentIntentId}")]
        [Authorize]
        public async Task<IActionResult> GetPaymentStatus(string paymentIntentId)
        {
            try
            {
                if (string.IsNullOrEmpty(paymentIntentId))
                {
                    return BadRequest(new { error = "支付意图ID不能为空" });
                }

                var userId = GetUserId();
                if (userId == null)
                {
                    return Unauthorized(new { error = "用户认证失败" });
                }

                var status = await _paymentService.GetPaymentStatusAsync(paymentIntentId, userId.Value);
                return Ok(status);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("参数错误: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning("访问权限错误: {Error}", ex.Message);
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "获取支付状态失败: PaymentIntentId={PaymentIntentId}", paymentIntentId);
                return StatusCode(500, new { error = "获取支付状态失败" });
            }
        }

        private Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                // 尝试从其他claim获取
                userIdClaim = User.FindFirst("sub")?.Value ??
                             User.FindFirst("id")?.Value ??
                             User.FindFirst("user_id")?.Value;
            }

            if (Guid.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }

            _logger.LogWarning("无法解析用户ID: UserIdClaim={UserIdClaim}", userIdClaim ?? "null");
            return null;
        }
    }
}