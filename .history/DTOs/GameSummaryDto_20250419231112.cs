namespace GameStore.Api.DTOs;

public record class GameSummaryDto(
int ID,
string Name,
string Genre,
decimal Price,
DateOnly ReleaseDate,
string? PhotoUrl
);
