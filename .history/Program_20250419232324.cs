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

// Map controllers
app.MapControllers();

app.MapGamesEndpoints();
app.MapGenresEndpoints();
await app.MigrateDbAsync();

app.Run();
