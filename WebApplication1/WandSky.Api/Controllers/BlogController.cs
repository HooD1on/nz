using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WandSky.Core.DTOs;
using WandSky.Services;

namespace WandSky.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<BlogPostDto>>>> GetAllPosts([FromQuery] BlogSearchDto searchDto)
        {
            var result = await _blogService.GetAllPostsAsync(searchDto);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ServiceResponse<BlogPostDto>>> GetPostById(Guid id)
        {
            var result = await _blogService.GetPostByIdAsync(id);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<ServiceResponse<BlogPostDto>>> GetPostBySlug(string slug)
        {
            var result = await _blogService.GetPostBySlugAsync(slug);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPost("{id:guid}/view")]
        public async Task<ActionResult<ServiceResponse<BlogPostDto>>> IncrementViewCount(Guid id)
        {
            var result = await _blogService.IncrementViewCountAsync(id);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<BlogPostDto>>> CreatePost([FromBody] BlogPostCreateDto createDto)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(new ServiceResponse<BlogPostDto> 
                { 
                    Success = false, 
                    Error = "User not authenticated" 
                });
            }

            var result = await _blogService.CreatePostAsync(createDto, userId);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return CreatedAtAction(nameof(GetPostById), new { id = result.Data!.Id }, result);
        }

        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<BlogPostDto>>> UpdatePost(Guid id, [FromBody] BlogPostUpdateDto updateDto)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(new ServiceResponse<BlogPostDto> 
                { 
                    Success = false, 
                    Error = "User not authenticated" 
                });
            }

            var result = await _blogService.UpdatePostAsync(id, updateDto, userId);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<bool>>> DeletePost(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(new ServiceResponse<bool> 
                { 
                    Success = false, 
                    Error = "User not authenticated" 
                });
            }

            var result = await _blogService.DeletePostAsync(id, userId);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("{id:guid}/publish")]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<bool>>> PublishPost(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(new ServiceResponse<bool> 
                { 
                    Success = false, 
                    Error = "User not authenticated" 
                });
            }

            var result = await _blogService.PublishPostAsync(id, userId);
            return Ok(result);
        }

        [HttpPost("{id:guid}/unpublish")]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<bool>>> UnpublishPost(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(new ServiceResponse<bool> 
                { 
                    Success = false, 
                    Error = "User not authenticated" 
                });
            }

            var result = await _blogService.UnpublishPostAsync(id, userId);
            return Ok(result);
        }

        [HttpGet("recent")]
        public async Task<ActionResult<ServiceResponse<List<BlogPostDto>>>> GetRecentPosts([FromQuery] int limit = 5)
        {
            var result = await _blogService.GetRecentPostsAsync(limit);
            return Ok(result);
        }

        [HttpGet("{id:guid}/related")]
        public async Task<ActionResult<ServiceResponse<List<BlogPostDto>>>> GetRelatedPosts(Guid id, [FromQuery] int limit = 3)
        {
            var result = await _blogService.GetRelatedPostsAsync(id, limit);
            return Ok(result);
        }

        [HttpGet("stats")]
        public async Task<ActionResult<ServiceResponse<BlogStatsDto>>> GetBlogStats()
        {
            var result = await _blogService.GetBlogStatsAsync();
            return Ok(result);
        }

        [HttpGet("tags")]
        public async Task<ActionResult<ServiceResponse<List<string>>>> GetPopularTags([FromQuery] int limit = 20)
        {
            var result = await _blogService.GetPopularTagsAsync(limit);
            return Ok(result);
        }

        // 评论相关端点
        [HttpGet("{postId:guid}/comments")]
        public async Task<ActionResult<ServiceResponse<List<BlogCommentDto>>>> GetCommentsByPostId(Guid postId)
        {
            var result = await _blogService.GetCommentsByPostIdAsync(postId);
            return Ok(result);
        }

        [HttpPost("comments")]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<BlogCommentDto>>> CreateComment([FromBody] BlogCommentCreateDto createDto)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(new ServiceResponse<BlogCommentDto> 
                { 
                    Success = false, 
                    Error = "User not authenticated" 
                });
            }

            var result = await _blogService.CreateCommentAsync(createDto, userId);
            return Ok(result);
        }

        [HttpDelete("comments/{commentId:guid}")]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteComment(Guid commentId)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(new ServiceResponse<bool> 
                { 
                    Success = false, 
                    Error = "User not authenticated" 
                });
            }

            var result = await _blogService.DeleteCommentAsync(commentId, userId);
            return Ok(result);
        }

        [HttpPost("comments/{commentId:guid}/approve")]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<bool>>> ApproveComment(Guid commentId)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(new ServiceResponse<bool> 
                { 
                    Success = false, 
                    Error = "User not authenticated" 
                });
            }

            var result = await _blogService.ApproveCommentAsync(commentId, userId);
            return Ok(result);
        }

        // 分类相关端点
        [HttpGet("categories")]
        public async Task<ActionResult<ServiceResponse<List<BlogCategoryDto>>>> GetAllCategories()
        {
            var result = await _blogService.GetAllCategoriesAsync();
            return Ok(result);
        }

        [HttpPost("categories")]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<BlogCategoryDto>>> CreateCategory([FromBody] BlogCategoryCreateDto createDto)
        {
            var result = await _blogService.CreateCategoryAsync(createDto);
            return Ok(result);
        }

        [HttpDelete("categories/{id:guid}")]
        [Authorize]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteCategory(Guid id)
        {
            var result = await _blogService.DeleteCategoryAsync(id);
            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return userId;
            }
            return Guid.Empty;
        }
    }
} 