using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.GamesEndpoints;
var builder = WebApplication.CreateBuilder(args);
var connString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddSqlite<GameStoreContext>(connString);
var app = builder.Build();

app.MapGamesEndpoints();

app.Run();
