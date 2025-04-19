using System;
using GameStore.Api.DTOs;
using GameStore.Api.Entities;

namespace GameStore.Api.Mapping;

public static class GenreMapping
{
    public static GenreDTO ToDTO(this Genre genre)
    {
        return new DTOs.GenreDTO(genre.ID, genre.Name);
    }

}
