using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.GamesEndpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("GameStore");
builder.Services.AddSqlite<GameStoreContext>(connString);

// Add controllers support
builder.Services.AddControllers();

var app = builder.Build();

// Enable serving static files from wwwroot folder
app.UseStaticFiles();

// Enable default files (index.html)
app.UseDefaultFiles();

// Enable routing
app.UseRouting();

// Map controllers
app.MapControllers();

// Print all routes for debugging
app.MapGet("/debug/routes", (IEnumerable<EndpointDataSource> endpointSources) =>
{
    var endpoints = endpointSources
        .SelectMany(source => source.Endpoints)
        .OfType<RouteEndpoint>()
        .Select(endpoint => new
        {
            Method = endpoint.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods.FirstOrDefault(),
            Route = endpoint.RoutePattern.RawText,
            Handler = endpoint.Metadata.GetMetadata<MethodInfo>()?.Name
        })
        .OrderBy(e => e.Route)
        .ToList();

    return endpoints;
});

app.MapGamesEndpoints();
app.MapGenresEndpoints();
await app.MigrateDbAsync();

app.Run();
