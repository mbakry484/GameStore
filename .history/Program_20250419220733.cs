using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.GamesEndpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("GameStore");
builder.Services.AddSqlite<GameStoreContext>(connString);

var app = builder.Build();

app.MapGamesEndpoints();
app.
await app.MigrateDbAsync();

app.Run();
