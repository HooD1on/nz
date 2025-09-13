using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WandSky.Services.DTOs.Booking;
using WandSky.Services.Interfaces;
using WandSky.Core.Entities;

namespace WandSky.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IPaymentService _paymentService;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(
            IBookingService bookingService,
            IPaymentService paymentService,
            ILogger<BookingsController> logger)
        {
            _bookingService = bookingService ?? throw new ArgumentNullException(nameof(bookingService));
            _paymentService = paymentService ?? throw new ArgumentNullException(nameof(paymentService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { error = "请求数据不能为空" });
                }

                _logger.LogInformation("🏨 开始创建预订: PaymentIntentId={PaymentIntentId}", request.PaymentIntentId);

                var userId = GetUserId();
                if (userId == null)
                {
                    return Unauthorized(new { error = "用户认证失败" });
                }

                // 验证支付是否属于当前用户且已成功
                var payment = await _paymentService.GetPaymentByStripeIdAsync(request.PaymentIntentId, userId.Value);

                if (payment == null)
                {
                    return NotFound(new { error = "支付记录不存在或无访问权限" });
                }

                if (payment.Status != PaymentStatus.Succeeded)
                {
                    return BadRequest(new { error = "支付未完成，无法创建预订" });
                }

                // 检查是否已存在预订
                var existingBooking = await _bookingService.GetByPaymentIdAsync(payment.Id);
                if (existingBooking != null)
                {
                    _logger.LogInformation("预订已存在，返回现有预订: BookingId={BookingId}", existingBooking.Id);
                    return Ok(existingBooking);
                }

                // 创建新预订
                var createBookingDto = new CreateBookingDto
                {
                    UserId = userId.Value,
                    PaymentId = payment.Id,
                    PackageId = request.PackageId,
                    CustomerName = request.BookingData.CustomerName,
                    Email = request.BookingData.Email,
                    Phone = request.BookingData.Phone,
                    Travelers = request.BookingData.Travelers,
                    TravelDate = request.BookingData.TravelDate,
                    TotalAmount = request.TotalAmount,
                    Status = BookingStatus.Confirmed,
                    SpecialRequests = request.BookingData.SpecialRequests
                };

                var result = await _bookingService.CreateAsync(createBookingDto);

                _logger.LogInformation("✅ 预订创建成功: BookingId={BookingId}, Reference={Reference}",
                    result.Id, result.BookingReference);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("⚠️ 预订参数错误: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("⚠️ 预订业务逻辑错误: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 创建预订失败");
                return StatusCode(500, new { error = "创建预订失败，请稍后重试" });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetBooking(Guid id)
        {
            try
            {
                var booking = await _bookingService.GetByIdAsync(id);

                if (booking == null)
                {
                    return NotFound(new { error = "预订不存在" });
                }

                var userId = GetUserId();
                if (userId == null || booking.UserId != userId.Value)
                {
                    return Forbid("无权访问此预订");
                }

                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "获取预订失败: BookingId={BookingId}", id);
                return StatusCode(500, new { error = "获取预订失败" });
            }
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<IActionResult> GetUserBookings()
        {
            try
            {
                var userId = GetUserId();
                if (userId == null)
                {
                    return Unauthorized(new { error = "用户认证失败" });
                }

                var bookings = await _bookingService.GetByUserIdAsync(userId.Value);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "获取用户预订失败");
                return StatusCode(500, new { error = "获取预订列表失败" });
            }
        }

        private Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst("id")?.Value;
            }

            return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}