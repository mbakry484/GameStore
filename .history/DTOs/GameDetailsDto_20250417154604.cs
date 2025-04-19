namespace GameStore.Api.DTOs;

public record class GameDto(
int ID,
string Name,
string Genre,
decimal Price,
DateOnly ReleaseDate
);
