using AutoMapper;
using Microsoft.Extensions.Logging;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Services.DTOs.Booking;
using WandSky.Services.Interfaces;

namespace WandSky.Services.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<BookingService> _logger;

        public BookingService(
            IBookingRepository bookingRepository,
            IPaymentRepository paymentRepository,
            IMapper mapper,
            ILogger<BookingService> logger)
        {
            _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
            _paymentRepository = paymentRepository ?? throw new ArgumentNullException(nameof(paymentRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<BookingResponseDto> CreateAsync(CreateBookingDto createBookingDto)
        {
            try
            {
                _logger.LogInformation("开始创建预订: UserId={UserId}, PaymentId={PaymentId}",
                    createBookingDto.UserId, createBookingDto.PaymentId);

                // 验证支付是否存在且状态正确
                var payment = await _paymentRepository.GetByIdAsync(createBookingDto.PaymentId);
                if (payment == null)
                {
                    throw new ArgumentException("关联的支付记录不存在");
                }

                if (payment.Status != PaymentStatus.Succeeded)
                {
                    throw new InvalidOperationException("只能为成功的支付创建预订");
                }

                // 检查是否已存在预订
                var existingBooking = await _bookingRepository.GetByPaymentIdAsync(createBookingDto.PaymentId);
                if (existingBooking != null)
                {
                    _logger.LogInformation("预订已存在，返回现有预订: BookingId={BookingId}", existingBooking.Id);
                    return _mapper.Map<BookingResponseDto>(existingBooking);
                }

                // 创建新预订
                var booking = new Booking
                {
                    Id = Guid.NewGuid(),
                    BookingReference = GenerateBookingReference(),
                    UserId = createBookingDto.UserId,
                    PaymentId = createBookingDto.PaymentId,
                    PackageId = createBookingDto.PackageId,
                    CustomerName = createBookingDto.CustomerName,
                    Email = createBookingDto.Email,
                    Phone = createBookingDto.Phone,
                    Travelers = createBookingDto.Travelers,
                    TravelDate = createBookingDto.TravelDate,
                    TotalAmount = createBookingDto.TotalAmount,
                    Status = createBookingDto.Status,
                    SpecialRequests = createBookingDto.SpecialRequests,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createdBooking = await _bookingRepository.CreateAsync(booking);

                _logger.LogInformation("预订创建成功: BookingId={BookingId}, Reference={Reference}",
                    createdBooking.Id, createdBooking.BookingReference);

                return _mapper.Map<BookingResponseDto>(createdBooking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "创建预订失败: UserId={UserId}, PaymentId={PaymentId}",
                    createBookingDto.UserId, createBookingDto.PaymentId);
                throw;
            }
        }

        public async Task<BookingResponseDto?> GetByIdAsync(Guid id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            return booking != null ? _mapper.Map<BookingResponseDto>(booking) : null;
        }

        public async Task<BookingResponseDto?> GetByPaymentIdAsync(Guid paymentId)
        {
            var booking = await _bookingRepository.GetByPaymentIdAsync(paymentId);
            return booking != null ? _mapper.Map<BookingResponseDto>(booking) : null;
        }

        public async Task<BookingResponseDto?> GetByReferenceAsync(string bookingReference)
        {
            var booking = await _bookingRepository.GetByReferenceAsync(bookingReference);
            return booking != null ? _mapper.Map<BookingResponseDto>(booking) : null;
        }

        public async Task<List<BookingResponseDto>> GetByUserIdAsync(Guid userId)
        {
            var bookings = await _bookingRepository.GetByUserIdAsync(userId);
            return _mapper.Map<List<BookingResponseDto>>(bookings);
        }

        public async Task<BookingResponseDto> UpdateAsync(Guid id, CreateBookingDto updateBookingDto)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
            {
                throw new ArgumentException("预订不存在");
            }

            // 更新字段
            booking.CustomerName = updateBookingDto.CustomerName;
            booking.Email = updateBookingDto.Email;
            booking.Phone = updateBookingDto.Phone;
            booking.Travelers = updateBookingDto.Travelers;
            booking.TravelDate = updateBookingDto.TravelDate;
            booking.SpecialRequests = updateBookingDto.SpecialRequests;
            booking.UpdatedAt = DateTime.UtcNow;

            await _bookingRepository.UpdateAsync(booking);

            return _mapper.Map<BookingResponseDto>(booking);
        }

        public async Task DeleteAsync(Guid id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking != null)
            {
                await _bookingRepository.DeleteAsync(booking);
            }
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _bookingRepository.ExistsAsync(id);
        }

        private string GenerateBookingReference()
        {
            // 生成格式: WS20241201001
            var date = DateTime.UtcNow.ToString("yyyyMMdd");
            var random = new Random().Next(100, 999);
            return $"WS{date}{random}";
        }
    }
}