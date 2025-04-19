using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.GamesEndpoints;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSqlite<GameStoreContext>(connString);
var app = builder.Build();

var connString="Data Source=GameStore.db";
app.MapGamesEndpoints();

app.Run();
