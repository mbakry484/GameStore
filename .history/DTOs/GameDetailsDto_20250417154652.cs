namespace GameStore.Api.DTOs;

public record class GameDetailsDto(
int ID,
string Name,
int Genre,
decimal Price,
DateOnly ReleaseDate
);
