using System;
using GameStore.Api.DTOs;
using GameStore.Api.Entities;

namespace GameStore.Api.Mapping;

public static class GameMapping
{
    public static Game ToEntity(this CreateGameDto gameDto)
    {
        return new Game()
        {
            Name = gameDto.Name,
            GenreID = gameDto.GenreID,
            Price = gameDto.Price,
            Release_Date = gameDto.ReleaseDate
        };
    }

    public static GameDto ToDto(this Game game)
    {
        return new(
        
            ID = game.ID,
            Name = game.Name,
            Genre = game.Genre?.Name,
            Price = game.Price,
            ReleaseDate = game.Release_Date
        };
    }
}
