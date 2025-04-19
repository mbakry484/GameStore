using System;
using System.Text.RegularExpressions;
using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.Entities;
using GameStore.Api.Mapping;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.GamesEndpoints;

public static class GamesEndpoints
{
    public static RouteGroupBuilder MapGamesEndpoints(this WebApplication app)
    {
        List<GameSummaryDto> games = new();
        var group = app.MapGroup("/games").WithParameterValidation();
        const string GetGameEndpoint = "GetGame";

        //Get games
        group.MapGet("/", async(GameStoreContext dbContext) => 
        await dbContext.Games.Include(game => game.Genre)
        .Select(game => game.ToGameSummaryDto())
        .AsNoTracking()
        .ToListAsync());
    
            


        //Get game by ID
        group.MapGet("/{id}", await (int id, GameStoreContext dbContext) =>
        {
            Game? game = await dbContext.Games.FindAsync(id);

            return game is null ?
            Results.NotFound() : Results.Ok(game.ToGameDetailsDto());
        })
            .WithName(GetGameEndpoint);

        //Create game
        group.MapPost("/", (CreateGameDto NewGame, GameStoreContext dbContext) =>
        {
            Game game = NewGame.ToEntity();

            dbContext.Games.Add(game);
            dbContext.SaveChanges();
            return Results.CreatedAtRoute(GetGameEndpoint, new { id = game.ID }, game.ToGameDetailsDto());
        }).WithParameterValidation();


        //Update game
        group.MapPut("/{id}", (int id, UpdateGameDto updatedGame, GameStoreContext dbContext) =>
        {
            var FoundGame = dbContext.Games.Find(id);
            if (FoundGame is null) return Results.NotFound();
            else
            {
                dbContext.Entry(FoundGame).
                CurrentValues.
                SetValues(updatedGame.ToEntity(id));
                dbContext.SaveChanges();
                return Results.NoContent();
            }

        });

        //Delete game
        group.MapDelete("/{id}", (int id, GameStoreContext dbContext) =>
        {

            var FoundGame = dbContext.Games.Find(id);
            if (FoundGame is null) return Results.NotFound();
            dbContext.Games.Remove(FoundGame);
            dbContext.SaveChanges();
            return Results.NoContent();
        });

        group.MapDelete("/DeleteAll",async(GameStoreContext dbContext)=>{
            dbContext.Games.RemoveRange(dbContext.Games);
            await dbContext.SaveChangesAsync();
            return Results.NoContent();
            
        });
        return group;
    }
}
