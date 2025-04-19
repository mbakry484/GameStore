using System;

namespace GameStore.Api.Mapping;

public class GenreMapping
{
    public static GenreDTO ToDTO(Models.Genre genre)
    {
        return new DTOs.GenreDTO(genre.Id, genre.Name);
    }

}
