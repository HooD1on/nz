using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using AutoMapper;

// 使用现有的命名空间结构
using WandSky.Core.Interfaces.Repositories;
using WandSky.Core.Interfaces.Services;
using WandSky.Infrastructure.Data;
using WandSky.Infrastructure.Repositories;
using WandSky.Services.Auth;
using WandSky.Services;
using WandSky.Core;

var builder = WebApplication.CreateBuilder(args);

// ===========================================
// 📋 服务配置 (Services Configuration)  
// ===========================================

// 1. 基础服务
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 2. 数据库配置
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. AutoMapper配置
var mapperConfig = new MapperConfiguration(cfg =>
{
    cfg.AddMaps(typeof(MappingProfiles).Assembly);
    cfg.AddMaps(typeof(Program).Assembly);
});
IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

// 4. 现有Repository注册 (使用你现有的接口)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IWishlistRepository, WishlistRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();

// 5. 现有Service注册
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<WandSky.Services.Interfaces.IPaymentService, WandSky.Services.Services.PaymentService>();
builder.Services.AddScoped<WandSky.Services.Interfaces.IBookingService, WandSky.Services.Services.BookingService>();

// 6. Stripe 配置验证和初始化
var stripeSecretKey = builder.Configuration["Stripe:SecretKey"];
var stripePublishableKey = builder.Configuration["Stripe:PublishableKey"];

if (string.IsNullOrEmpty(stripeSecretKey))
{
    throw new InvalidOperationException("Stripe SecretKey 未在 appsettings.json 中配置。请检查 Stripe:SecretKey 配置项。");
}

if (string.IsNullOrEmpty(stripePublishableKey))
{
    throw new InvalidOperationException("Stripe PublishableKey 未在 appsettings.json 中配置。请检查 Stripe:PublishableKey 配置项。");
}

// 验证 Stripe 密钥格式
if (!stripeSecretKey.StartsWith("sk_test_") && !stripeSecretKey.StartsWith("sk_live_"))
{
    throw new InvalidOperationException("Stripe SecretKey 格式无效。应该以 sk_test_ 或 sk_live_ 开头。");
}

if (!stripePublishableKey.StartsWith("pk_test_") && !stripePublishableKey.StartsWith("pk_live_"))
{
    throw new InvalidOperationException("Stripe PublishableKey 格式无效。应该以 pk_test_ 或 pk_live_ 开头。");
}

// 检查环境一致性
var isSecretKeyTest = stripeSecretKey.StartsWith("sk_test_");
var isPublishableKeyTest = stripePublishableKey.StartsWith("pk_test_");

if (isSecretKeyTest != isPublishableKeyTest)
{
    throw new InvalidOperationException("Stripe 密钥环境不一致。SecretKey 和 PublishableKey 必须都是测试环境或都是生产环境。");
}

// 记录配置状态（安全地记录，不暴露完整密钥）
var environment = isSecretKeyTest ? "测试环境" : "生产环境";
var logger = LoggerFactory.Create(config => config.AddConsole()).CreateLogger("Startup");
logger.LogInformation("Stripe 配置验证通过 ({Environment})", environment);
logger.LogInformation("Secret Key: {SecretKeyPrefix}...", stripeSecretKey.Substring(0, 12));
logger.LogInformation("Publishable Key: {PublishableKeyPrefix}...", stripePublishableKey.Substring(0, 12));

// Webhook 密钥配置 (可选，无 Webhook 方案下可以留空)
var webhookSecret = builder.Configuration["Stripe:WebhookSecret"];
if (!string.IsNullOrEmpty(webhookSecret))
{
    logger.LogInformation("Webhook Secret: {WebhookSecretPrefix}... (已配置，但当前未使用)", webhookSecret.Substring(0, 8));
}
else
{
    logger.LogInformation("Webhook Secret 未配置 (无 Webhook 方案，正常)");
}
// 7. 认证配置
var jwtKey = builder.Configuration["AppSettings:Token"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT密钥未配置，请检查appsettings.json中的AppSettings:Token");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Google OAuth配置 (可选)
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

if (!string.IsNullOrEmpty(googleClientId) && !string.IsNullOrEmpty(googleClientSecret))
{
    builder.Services.AddAuthentication()
        .AddGoogle(googleOptions =>
        {
            googleOptions.ClientId = googleClientId;
            googleOptions.ClientSecret = googleClientSecret;
            googleOptions.CallbackPath = "/api/auth/callback/google";
        });
}

builder.Services.AddAuthorization();

// 8. CORS配置
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// 9. Swagger配置
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WandSky API",
        Version = "v1",
        Description = "新西兰旅游网站API"
    });

    // JWT认证配置
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// 10. 日志配置
builder.Services.AddLogging();



// ===========================================
// 🚀 应用构建和配置 (App Configuration)
// ===========================================

var app = builder.Build();

// 1. 开发环境配置
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "WandSky API v1");
        c.RoutePrefix = "swagger";
    });
}

// 2. 生产环境错误处理
if (app.Environment.IsProduction())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// 3. 中间件管道配置 (正确的顺序)
app.UseHttpsRedirection();

// CORS必须在认证之前
app.UseCors("AllowNextJS");

// 认证和授权
app.UseAuthentication();
app.UseAuthorization();

// 路由和控制器
app.MapControllers();
app.MapHealthChecks("/health");

// 4. 数据库初始化
using (var scope = app.Services.CreateScope())
{
    try
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ApplicationDbContext>();
        var appLogger = services.GetRequiredService<ILogger<Program>>();

        // 应用数据库迁移
        await context.Database.MigrateAsync();
        appLogger.LogInformation("✅ 数据库迁移完成");

        // 种子数据初始化 (仅开发环境)
        if (app.Environment.IsDevelopment())
        {
            await WandSky.Infrastructure.Data.BlogDataSeeder.SeedBlogDataAsync(context);
            appLogger.LogInformation("✅ 博客示例数据初始化完成");
        }
    }
    catch (Exception ex)
    {
        var appLogger = app.Services.GetRequiredService<ILogger<Program>>();
        appLogger.LogError(ex, "💥 数据库初始化失败");

        // 开发环境抛出异常以便调试
        if (app.Environment.IsDevelopment())
        {
            throw;
        }
    }
}

// 5. 启动信息
var startupLogger = app.Services.GetRequiredService<ILogger<Program>>();
startupLogger.LogInformation("🚀 WandSky API 启动完成");
startupLogger.LogInformation("📍 Environment: {Environment}", app.Environment.EnvironmentName);

if (app.Environment.IsDevelopment())
{
    startupLogger.LogInformation("🌐 Swagger UI: https://localhost:5001/swagger");
}

// 启动应用
app.Run();