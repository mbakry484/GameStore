namespace GameStore.Api.DTOs;

public record class GameGetailsDto(
int ID,
string Name,
string Genre,
decimal Price,
DateOnly ReleaseDate
);
