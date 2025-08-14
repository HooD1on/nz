using WandSky.Core.Entities;

namespace WandSky.Infrastructure.Data
{
    public static class BlogDataSeeder
    {
        public static async Task SeedBlogDataAsync(ApplicationDbContext context)
        {
            // 检查是否已有博客数据
            if (context.BlogCategories.Any() || context.BlogPosts.Any())
            {
                return; // 已有数据，不需要种子数据
            }

            // 创建博客分类
            var categories = new List<BlogCategory>
            {
                new BlogCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "旅游攻略",
                    Slug = "travel-guide",
                    Description = "新西兰旅游攻略和实用信息",
                    Color = "#3B82F6",
                    CreatedAt = DateTime.UtcNow
                },
                new BlogCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "景点介绍",
                    Slug = "attractions",
                    Description = "新西兰热门景点详细介绍",
                    Color = "#10B981",
                    CreatedAt = DateTime.UtcNow
                },
                new BlogCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "文化体验",
                    Slug = "culture",
                    Description = "新西兰文化和当地体验",
                    Color = "#F59E0B",
                    CreatedAt = DateTime.UtcNow
                },
                new BlogCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "户外活动",
                    Slug = "outdoor",
                    Description = "新西兰户外活动和冒险运动",
                    Color = "#EF4444",
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.BlogCategories.AddRange(categories);
            await context.SaveChangesAsync();

            // 获取第一个用户作为博客作者（如果存在）
            var firstUser = context.Users.FirstOrDefault();
            if (firstUser == null)
            {
                return; // 没有用户，无法创建博客文章
            }

            // 创建示例博客文章
            var posts = new List<BlogPost>
            {
                new BlogPost
                {
                    Id = Guid.NewGuid(),
                    Title = "新西兰南岛15天深度游攻略",
                    Slug = "new-zealand-south-island-15-day-guide",
                    Summary = "详细的新西兰南岛15天旅游攻略，包含最佳路线、住宿推荐、必游景点和实用tips。",
                    Content = @"
<h2>新西兰南岛15天深度游攻略</h2>

<p>新西兰南岛被誉为世界上最美的地方之一，拥有壮丽的雪山、湛蓝的湖泊、广袤的草原和独特的野生动物。这篇攻略将为您规划一个完美的15天南岛之旅。</p>

<h3>第1-3天：基督城 - 南岛之门</h3>
<p>从基督城开始您的南岛之旅。这座""花园城市""拥有美丽的公园和维多利亚式建筑。</p>

<h4>必游景点：</h4>
<ul>
<li>基督城植物园</li>
<li>坎特伯雷博物馆</li>
<li>纸板大教堂</li>
<li>雅芳河泛舟</li>
</ul>

<h3>第4-6天：皇后镇 - 冒险之都</h3>
<p>皇后镇是新西兰的冒险之都，这里有世界级的极限运动和美丽的湖光山色。</p>

<h4>推荐活动：</h4>
<ul>
<li>蹦极跳</li>
<li>跳伞</li>
<li>喷射快艇</li>
<li>天空缆车</li>
</ul>

<h3>第7-9天：米尔福德峡湾</h3>
<p>米尔福德峡湾被称为""世界第八大自然奇观""，是新西兰最著名的自然景观之一。</p>

<h3>第10-12天：但尼丁 - 苏格兰风情</h3>
<p>但尼丁拥有浓郁的苏格兰风情和丰富的野生动物资源。</p>

<h3>第13-15天：阿卡罗阿 - 法式小镇</h3>
<p>阿卡罗阿是一个迷人的法式小镇，也是观赏海豚的最佳地点。</p>

<h2>实用信息</h2>

<h3>最佳旅游时间</h3>
<p>南岛的最佳旅游时间是12月至3月（夏季），天气温暖，日照时间长。</p>

<h3>交通建议</h3>
<p>建议租车自驾，这样可以更自由地探索南岛的美景。记住新西兰是右舵驾驶。</p>

<h3>住宿推荐</h3>
<p>提前预订住宿，特别是在旅游旺季。推荐尝试当地的B&B和农场住宿体验。</p>
",
                    FeaturedImage = "https://images.pexels.com/photos/7919/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
                    Category = categories[0].Name,
                    Tags = "南岛,攻略,自驾,皇后镇,基督城",
                    MetaDescription = "新西兰南岛15天深度游完整攻略，包含路线规划、景点推荐、交通住宿等实用信息。",
                    MetaKeywords = "新西兰南岛,旅游攻略,自驾游,皇后镇,基督城,米尔福德峡湾",
                    IsPublished = true,
                    PublishedAt = DateTime.UtcNow.AddDays(-5),
                    AuthorId = firstUser.Id,
                    ViewCount = 245,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new BlogPost
                {
                    Id = Guid.NewGuid(),
                    Title = "探索罗托鲁瓦：地热奇观与毛利文化",
                    Slug = "rotorua-geothermal-maori-culture",
                    Summary = "深入了解罗托鲁瓦的地热奇观和丰富的毛利文化，体验新西兰独特的自然与人文魅力。",
                    Content = @"
<h2>探索罗托鲁瓦：地热奇观与毛利文化</h2>

<p>罗托鲁瓦位于新西兰北岛中部，是世界著名的地热城市，也是体验毛利文化的最佳地点。这里有令人叹为观止的地热景观和深厚的文化底蕴。</p>

<h3>地热奇观</h3>

<h4>怀奥塔普地热公园</h4>
<p>怀奥塔普被誉为""地热仙境""，拥有色彩斑斓的温泉池和间歇泉。</p>

<h4>香槟池</h4>
<p>这是新西兰最大的天然热水湖泊，池水呈现美丽的橙绿色。</p>

<h4>地狱之门</h4>
<p>新西兰最活跃的地热保护区，可以体验天然地热泥浆浴。</p>

<h3>毛利文化体验</h3>

<h4>蒂普亚毛利文化村</h4>
<p>观赏传统毛利表演，了解毛利人的生活方式和文化传统。</p>

<h4>毛利文化晚宴</h4>
<p>品尝传统的杭吉大餐，感受毛利人的热情好客。</p>

<h3>实用信息</h3>

<h4>最佳游览时间</h4>
<p>全年都适合游览，但夏季（12月-2月）是最佳时间。</p>

<h4>住宿推荐</h4>
<ul>
<li>湖景酒店</li>
<li>地热温泉度假村</li>
<li>毛利主题民宿</li>
</ul>

<h4>美食推荐</h4>
<ul>
<li>杭吉大餐</li>
<li>新西兰羊肉</li>
<li>当地海鲜</li>
</ul>
",
                    FeaturedImage = "https://images.pexels.com/photos/9800002/pexels-photo-9800002.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    Category = categories[2].Name,
                    Tags = "罗托鲁瓦,地热,毛利文化,北岛,温泉",
                    MetaDescription = "探索罗托鲁瓦的地热奇观和毛利文化，了解新西兰独特的自然景观和文化传统。",
                    MetaKeywords = "罗托鲁瓦,地热,毛利文化,怀奥塔普,香槟池,蒂普亚",
                    IsPublished = true,
                    PublishedAt = DateTime.UtcNow.AddDays(-3),
                    AuthorId = firstUser.Id,
                    ViewCount = 189,
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new BlogPost
                {
                    Id = Guid.NewGuid(),
                    Title = "新西兰户外活动完全指南：从徒步到极限运动",
                    Slug = "new-zealand-outdoor-activities-guide",
                    Summary = "新西兰是户外运动爱好者的天堂，从温和的徒步到刺激的极限运动，这里有适合每个人的活动。",
                    Content = @"
<h2>新西兰户外活动完全指南</h2>

<p>新西兰被誉为""户外活动的天堂""，无论您是寻求刺激的冒险家，还是喜欢温和活动的自然爱好者，这里都有适合您的户外活动。</p>

<h3>徒步健行</h3>

<h4>米尔福德步道</h4>
<p>被称为""世界上最美的步道""，全长53.5公里，需要4天完成。</p>

<h4>汤加里罗高山穿越</h4>
<p>北岛最受欢迎的一日徒步路线，可以看到火山湖和独特的地貌。</p>

<h3>水上运动</h3>

<h4>皮划艇</h4>
<p>在亚伯塔斯曼国家公园体验海上皮划艇，探索隐秘的海湾和海滩。</p>

<h4>白水漂流</h4>
<p>在罗托鲁瓦的凯图纳河体验世界级的白水漂流。</p>

<h3>极限运动</h3>

<h4>蹦极跳</h4>
<p>在皇后镇的卡瓦劳大桥体验世界第一个商业蹦极跳。</p>

<h4>跳伞</h4>
<p>从15000英尺的高空俯瞰新西兰的壮丽景色。</p>

<h4>峡谷秋千</h4>
<p>在内维斯秋千体验134米的自由落体。</p>

<h3>冬季运动</h3>

<h4>滑雪滑雪板</h4>
<p>南岛的雪场从6月到10月开放，皇后镇周边有多个世界级雪场。</p>

<h3>安全提示</h3>

<ul>
<li>始终检查天气预报</li>
<li>告知他人您的行程计划</li>
<li>携带适当的装备</li>
<li>选择有资质的运营商</li>
<li>购买保险</li>
</ul>

<h3>装备建议</h3>

<h4>基础装备</h4>
<ul>
<li>防水外套</li>
<li>徒步靴</li>
<li>防晒霜</li>
<li>帽子和太阳镜</li>
</ul>

<h4>高级装备</h4>
<ul>
<li>GPS设备</li>
<li>应急信标</li>
<li>急救包</li>
<li>多功能工具</li>
</ul>
",
                    FeaturedImage = "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    Category = categories[3].Name,
                    Tags = "户外活动,徒步,极限运动,蹦极,跳伞,滑雪",
                    MetaDescription = "新西兰户外活动完全指南，包含徒步、水上运动、极限运动等各类户外活动信息。",
                    MetaKeywords = "新西兰户外活动,徒步,蹦极,跳伞,滑雪,漂流,皮划艇",
                    IsPublished = true,
                    PublishedAt = DateTime.UtcNow.AddDays(-1),
                    AuthorId = firstUser.Id,
                    ViewCount = 156,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            context.BlogPosts.AddRange(posts);
            await context.SaveChangesAsync();

            Console.WriteLine("博客示例数据已成功添加！");
        }
    }
} 