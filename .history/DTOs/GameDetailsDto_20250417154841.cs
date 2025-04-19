namespace GameStore.Api.DTOs;

public record class GameDetailsDto(
int ID,
string Name,
int GenreID,
decimal Price,
DateOnly ReleaseDate
);
