namespace GameStore.Api.DTOs;

public record class GameDto(
int ID,
string Name,
int GenreID,
decimal Price,
DateOnly ReleaseDate
);
