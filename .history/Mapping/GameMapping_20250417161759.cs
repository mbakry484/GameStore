using System;
using GameStore.Api.DTOs;
using GameStore.Api.Entities;

namespace GameStore.Api.Mapping;

public static class GameMapping
{
    public static Game ToEntity(this CreateGameDto gameDto)
    {
        return new Game
        {
            Name = gameDto.Name,
            GenreID = gameDto.GenreID,
            Price = gameDto.Price,
            Release_Date = gameDto.ReleaseDate
        };
    }


    public static Game ToEntity(this UpdateGameDto gameDto, int id)
    {
        return new Game
        {
            ID = id,
            Name = gameDto.Name,
            GenreID = gameDto.GenreID,
            Price = gameDto.Price,
            Release_Date = gameDto.ReleaseDate
        };
    }


    public static GameSummaryDto ToGameSummaryDto(this Game game)
    {
        return new
        (
            
            game.ID,
            game.Name,
            game.Genre!.Name,
            game.Price,
            game.Release_Date
        );
    }

    public static GameDetailsDto ToGameDetailsDto(this Game game)
    {
        return new
        (
            game.ID,
            game.Name,
            game.GenreID,
            game.Price,
            game.Release_Date
        );
    }
}
