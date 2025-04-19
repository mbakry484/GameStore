using System;
using GameStore.Api.Data;

namespace GameStore.Api.GamesEndpoints;

public class GenresEndpoints
{
    public static RouteGroupBuilder MapGenresEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/genres");
        group.MapGet("/", async (GameStoreContext genreRepository) =>
        {
            var genres = await genreRepository.GetAllAsync();
            return Results.Ok(genres);
        })
    }

} 
