using System;
using GameStore.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.GamesEndpoints;

public class GenresEndpoints
{
    public static RouteGroupBuilder MapGenresEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/genres");
        group.MapGet("/", async (GameStoreContext dbContext) =>
        await dbContext.Genres.ToListAsync
        );
    }

} 
