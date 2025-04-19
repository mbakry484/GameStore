using System;
using System.Reflection.Metadata.Ecma335;
using GameStore.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace GameStore.Api.GamesEndpoints;

public static class GenresEndpoints
{
    public static RouteGroupBuilder MapGenresEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/genres")
                       .WithOpenApi()
                       .RequireCors(policy => policy
                           .AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod());
                           
        group.MapGet("/", async (GameStoreContext dbContext) =>
        await dbContext.Genres.ToListAsync()
        );
        
    return group; 
    }
}
