using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs;

public record class UpdateGameDto(
    [Required]string Name,
    [Required] Genre,
    [Required]Decimal Price,
    DateOnly ReleaseDate
);
