using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs;

public record class UpdateGameDto(
    [Required] string Name,
    int GenreID,
    [Required] Decimal Price,
    DateOnly ReleaseDate,
    string? PhotoUrl
);
