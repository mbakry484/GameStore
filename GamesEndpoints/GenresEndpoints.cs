using System;
using System.Reflection.Metadata.Ecma335;
using GameStore.Api.Data;
using Microsoft.EntityFrameworkCore;
namespace GameStore.Api.GamesEndpoints;

public static class GenresEndpoints
{
    public static RouteGroupBuilder MapGenresEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/genres");
        group.MapGet("/", async (GameStoreContext dbContext) =>
        await dbContext.Genres.ToListAsync()
        );
    return group; 
    }

}
