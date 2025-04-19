namespace GameStore.Api.DTOs;

public record class GameDto(
int ID,
string Name,
int Genre,
decimal Price,
DateOnly ReleaseDate
);
