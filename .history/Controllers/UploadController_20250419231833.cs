using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file was uploaded.");
            }

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType))
            {
                return BadRequest("File type not allowed. Please upload JPG, PNG, or WebP images only.");
            }

            // Validate file size (max 2MB)
            if (file.Length > 2 * 1024 * 1024)
            {
                return BadRequest("File size exceeds the maximum allowed (2MB).");
            }

            try
            {
                // Create a unique filename
                var fileName = $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}_{Path.GetFileName(file.FileName.Replace(" ", "_"))}";
                var filePath = Path.Combine(_environment.WebRootPath, "images", "games", fileName);

                // Ensure directory exists
                var directory = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // Save the file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Return the relative path to the file
                return Ok(new { path = $"/images/games/{fileName}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while uploading the file: {ex.Message}");
            }
        }
    }
}