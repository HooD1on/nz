// WandSky.Services/Interfaces/IPaymentService.cs
using WandSky.Services.DTOs.Payment;

namespace WandSky.Services.Interfaces
{
    public interface IPaymentService
    {
        /// <summary>
        /// 创建支付意图
        /// </summary>
        /// <param name="request">支付请求</param>
        /// <param name="userId">用户ID</param>
        /// <returns>支付意图响应</returns>
        Task<PaymentIntentResponse> CreatePaymentIntentAsync(CreatePaymentIntentRequest request, Guid userId);

        /// <summary>
        /// 处理Stripe Webhook
        /// </summary>
        /// <param name="request">HTTP请求</param>
        /// <returns></returns>
        Task HandleWebhookAsync(HttpRequest request);

        /// <summary>
        /// 获取支付状态
        /// </summary>
        /// <param name="paymentIntentId">支付意图ID</param>
        /// <param name="userId">用户ID</param>
        /// <returns>支付状态响应</returns>
        Task<PaymentStatusResponse> GetPaymentStatusAsync(string paymentIntentId, Guid userId);
    }
}