using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.GamesEndpoints;
using Microsoft.AspNetCore.Cors.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add CORS support with a named policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var connString = builder.Configuration.GetConnectionString("GameStore");
builder.Services.AddSqlite<GameStoreContext>(connString);

// Add other required services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument();

var app = builder.Build();

// Configure the HTTP request pipeline
// Enable CORS - must be called before other middleware
app.UseCors("AllowAll");

// Enable serving static files from wwwroot folder
app.UseStaticFiles();

// Enable default files (index.html)
app.UseDefaultFiles();

// Add API endpoints
app.MapGamesEndpoints();
app.MapGenresEndpoints();

// Migrate database
await app.MigrateDbAsync();

app.Run();
