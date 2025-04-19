namespace GameStore.Api.DTOs;

public record class GameDetailsDto(
int ID,
string Name,
int GenreId,
decimal Price,
DateOnly ReleaseDate
);
