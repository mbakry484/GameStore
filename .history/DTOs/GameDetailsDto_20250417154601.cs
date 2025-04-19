namespace GameStore.Api.DTOs;

public record class GamDto(
int ID,
string Name,
string Genre,
decimal Price,
DateOnly ReleaseDate
);
