using System;

namespace GameStore.Api.GamesEndpoints;

public class GenresEndpoints
{
    public static RouteGroupBuilder MapGenresEndpoints(this WebApplication app)
    {
        var group.MapGet("/", async (IGenreRepository genreRepository) =>
        {
            var genres = await genreRepository.GetAllAsync();
            return Results.Ok(genres.Select(g => g.ToDTO()));
        })
        .WithName("GetAllGenres")
        .Produces<IEnumerable<GenreDTO>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);

        return group;
    }

} 
