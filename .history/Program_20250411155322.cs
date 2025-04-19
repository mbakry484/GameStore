using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.GamesEndpoints;
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var connString="Data Source=GameStore.db";
builder.Services.AddSqlite<GameStoreContext>(connString);
app.MapGamesEndpoints();

app.Run();
