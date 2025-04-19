using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs;

public record class CreateGameDto(
    [Required]string Name,
    int Genre,
    [Required]Decimal Price,
    DateOnly ReleaseDate
);
