using System;
using GameStore.Api.DTOs;
using GameStore.Api.Entities;

namespace GameStore.Api.Mapping;

public class GenreMapping
{
    public static GenreDTO ToDTO(this Genre genre)
    {
        return new DTOs.GenreDTO(genre.id, genre.Name);
    }

}
