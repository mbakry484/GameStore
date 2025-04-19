using System;
using GameStore.Api.DTOs;

namespace GameStore.Api.Mapping;

public class GenreMapping
{
    public static GenreDTO ToDTO(ThreadStaticAttributeGenre genre)
    {
        return new DTOs.GenreDTO(genre.Id, genre.Name);
    }

}
