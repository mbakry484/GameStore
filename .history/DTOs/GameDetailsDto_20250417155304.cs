namespace GameStore.Api.DTOs;

public record class GameDetailsDto(
int ID,
string Name,
int GenreID,
string
decimal Price,
DateOnly ReleaseDate
);
