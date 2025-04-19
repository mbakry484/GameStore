using System;

namespace GameStore.Api.Mapping;

public class GenreMapping
{
    public static DTOs.GenreDTO MapToDTO(Models.Genre genre)
    {
        return new DTOs.GenreDTO(genre.Id, genre.Name);
    }

}
