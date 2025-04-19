using System;
using GameStore.Api.Entities;
using Microsoft.EntityFrameworkCore;
namespace GameStore.Api.Data;

public class GameStoreContext(DbContextOptions<GameStoreContext> options): DbContext(options)
{
    public DbSet<Game> Games=> Set<Game>();
    public DbSet<Genre> Genres => Set<Genre>();

    protected override void OnModelCreating (ModelBuilder modelBuilder)
{
    modelBuilder. Entity<Genre>(). HasData(
    new { ID = 1, Name = "Fighting" },
    new { ID = 2, Name = "Roleplaying" },
    new { ID = 3, Name = "Sports" },
    new { ID = 4, Name = "Racing" },
    new { ID = 5, Name = "Kids and Family"} 
    );

}
};
