using System;
using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.Entities;
using GameStore.Api.Mapping;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace GameStore.Api.GamesEndpoints;

public static class GamesEndpoints
{
    public static RouteGroupBuilder MapGamesEndpoints(this WebApplication app)
    {
        List<GameDto> games = new();
        var group = app.MapGroup("/games").WithParameterValidation();
        const string GetGameEndpoint = "GetGame";

        //Get games
        group.MapGet("/", () => games);


        //Get game by ID
        group.MapGet("/{id}", (int id, GameStoreContext dbContext) =>
        {
            var game = games.Find(game => game.ID == id);
            return game is null ? Results.NotFound() : Results.Ok(game);
        })
            .WithName(GetGameEndpoint);

        //Create game
        group.MapPost("/", (CreateGameDto NewGame, GameStoreContext dbContext) =>
        {
            Game game = NewGame.ToEntity();
            game.Genre = dbContext.Genres.Find(NewGame.GenreID);

            dbContext.Games.Add(game);
            dbContext.SaveChanges(); 
            return Results.CreatedAtRoute(GetGameEndpoint, new { id = game.ID }, game.ToDto());
        }).WithParameterValidation();


        //Update game
        group.MapPut("/{id}", (int id, UpdateGameDto updatedGame) =>
        {
            var index = games.FindIndex(game => game.ID == id);
            if (index < 0) return Results.NotFound();
            else
            {
                games[index] = new GameDto(
            id,
            updatedGame.Name,
            updatedGame.Genre,
            updatedGame.Price,
            updatedGame.ReleaseDate
        );

                return Results.NoContent();
            }
        });

        //Delete game
        group.MapDelete("/{id}", (int id) =>
        {

            games.RemoveAll(game => game.ID == id);
            return Results.NoContent();
        });
        return group;
    }
}
