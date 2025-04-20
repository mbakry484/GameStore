using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UploadController> _logger;

        public UploadController(IWebHostEnvironment environment, ILogger<UploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            _logger.LogInformation("Upload request received");

            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("No file was uploaded");
                return BadRequest("No file was uploaded.");
            }

            _logger.LogInformation($"File received: {file.FileName}, Size: {file.Length}, ContentType: {file.ContentType}");

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType))
            {
                _logger.LogWarning($"Invalid file type: {file.ContentType}");
                return BadRequest("File type not allowed. Please upload JPG, PNG, or WebP images only.");
            }

            // Validate file size (max 2MB)
            if (file.Length > 2 * 1024 * 1024)
            {
                _logger.LogWarning($"File too large: {file.Length} bytes");
                return BadRequest("File size exceeds the maximum allowed (2MB).");
            }

            try
            {
                // Create a unique filename
                var fileName = $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}_{Path.GetFileName(file.FileName.Replace(" ", "_"))}";
                var directoryPath = Path.Combine(_environment.WebRootPath, "images", "games");
                var filePath = Path.Combine(directoryPath, fileName);

                _logger.LogInformation($"WebRootPath: {_environment.WebRootPath}");
                _logger.LogInformation($"Saving file to: {filePath}");

                // Ensure directory exists
                Directory.CreateDirectory(directoryPath);
                _logger.LogInformation($"Directory exists: {Directory.Exists(directoryPath)}");

                // Save the file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                var relativePath = $"/images/games/{fileName}";
                _logger.LogInformation($"File saved successfully. Relative path: {relativePath}");

                // Return the relative path to the file
                return Ok(new { path = relativePath });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, $"An error occurred while uploading the file: {ex.Message}");
            }
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            _logger.LogInformation("Test endpoint called");
            return Ok(new { message = "Upload controller is working", timestamp = DateTime.Now });
        }
    }
}