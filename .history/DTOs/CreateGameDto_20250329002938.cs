using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs;

public record class CreateGameDto(
    [Required]string Name,
    [Required]string Genre,
    [Required]Decimal Price,
    DateOnly ReleaseDate
);
