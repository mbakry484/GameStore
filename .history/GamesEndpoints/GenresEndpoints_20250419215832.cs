using System;

namespace GameStore.Api.GamesEndpoints;

public class GenresEndpoints
{
    public static RouteGroupBuilder MapGenresEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/genres");
        
    }

} 
