// WandSky.Api/Controllers/PaymentsController.cs - 修复版本
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WandSky.Services.DTOs.Payment;

namespace WandSky.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly WandSky.Services.Interfaces.IPaymentService _paymentService; // 明确指定命名空间
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

                _logger.LogInformation("🚀 开始创建支付意图: PackageId={PackageId}, Amount={Amount}",
                    request.PackageId, request.Amount);

                var userId = GetUserId();
                if (userId == null)
                {
                    _logger.LogWarning("❌ 无法获取用户ID");
                    return Unauthorized(new { error = "用户认证失败" });
                }

                var result = await _paymentService.CreatePaymentIntentAsync(request, userId.Value);

                _logger.LogInformation("✅ 支付意图创建成功: PaymentIntentId={PaymentIntentId}",
                    result.PaymentIntentId);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("⚠️ 请求参数无效: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "💥 业务逻辑错误");
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 创建支付意图失败");
                return StatusCode(500, new { error = "创建支付失败，请稍后重试" });
            }
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> HandleWebhook()
        {
            try
            {
                _logger.LogInformation("📞 收到Stripe Webhook");

                await _paymentService.HandleWebhookAsync(Request);

                _logger.LogInformation("✅ Webhook处理成功");
                return Ok(new { received = true });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("⚠️ Webhook参数错误: {Error}", ex.Message);
                return BadRequest(new { error = "请求参数无效" });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning("🔐 Webhook签名验证失败: {Error}", ex.Message);
                return Unauthorized(new { error = "签名验证失败" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Webhook处理失败");
                return BadRequest(new { error = "处理失败" });
            }
        }

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
                _logger.LogWarning("⚠️ 参数错误: {Error}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning("🔐 访问权限错误: {Error}", ex.Message);
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
                userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst("id")?.Value;
            }

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return null;
            }

            return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}