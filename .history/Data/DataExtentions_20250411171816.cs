using System;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data;

public class DataExtentions
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<GameStoreContext>();
            context.Database.Migrate();
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<DataExtentions>>();
            logger.LogError(ex, "An error occurred while migrating the database.");
        }
    }

}
