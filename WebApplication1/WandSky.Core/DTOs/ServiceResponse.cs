namespace WandSky.Core.DTOs
{
    public class ServiceResponse<T>
    {
        public bool Success { get; set; } = true;
        public string Error { get; set; }
        public T Data { get; set; }
    }
}