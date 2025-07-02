

using System.Data;
using API.Dtos.Stripping.StrippingDriver;
using API.Dtos.Stripping.StrippingLabor;
using API.Helper;
using API.Services.Database;
using Microsoft.Data.SqlClient;

namespace API.Services.Stripping;

public class StrippingHelperRepository : IStrippingHelper
{
    private readonly IDatabase _database;
    public StrippingHelperRepository(IDatabase database)
    {
        _database = database ?? throw new ArgumentNullException(nameof(database));

    }
    public async Task<List<StrippingDriverDto>> GetAllStrippingDrivers()
    {
        var query = Stripping_SQL_Queries.GetAllDriversWithCreator();
        var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
        {
            List<StrippingDriverDto> driverResultList = [];
            int driverId = reader.GetOrdinal("Id");
            int driverNameIndex = reader.GetOrdinal("Name");
            int driverCretor = reader.GetOrdinal("Creator");
            while (await reader.ReadAsync())
            {
                var id = !reader.IsDBNull(driverId) ? reader.GetInt32(driverId) : 0;
                var driverName = !reader.IsDBNull(driverNameIndex) ? reader.GetString(driverNameIndex) : "";
                var creator = !reader.IsDBNull(driverCretor) ? reader.GetString(driverCretor) : "";

                driverResultList.Add(new(id, driverName, creator));
            }
            return driverResultList;
        });
        return result;
    }

    public async Task<List<StrippingLaborTypeDto>> GetAllStrippingLaborTypes()
    {
        var query = Stripping_SQL_Queries.GetAllActiveLaborTypes();
        return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
        {
            List<StrippingLaborTypeDto> result = [];
            int laborTypeIdIndex = reader.GetOrdinal("Id");
            int laborTypeNameIndex = reader.GetOrdinal("LaborType");

            while (await reader.ReadAsync())
            {
                var laborTypeId = reader.IsDBNull(laborTypeIdIndex) ? 0 : reader.GetInt32(laborTypeIdIndex);
                var laborType = reader.IsDBNull(laborTypeNameIndex) ? "" : reader.GetString(laborTypeNameIndex);
                result.Add(new(laborTypeId, laborType));

            }
            return result;
        });

    }
    
    public async Task<bool> DeleteStrippingDriver(int driverId)
    {
        var query = Stripping_SQL_Queries.DeleteStrippingDriver();
        var param = new SqlParameter("@driverId", SqlDbType.Int) { Value = driverId };

        return await _database.ExecuteSqlQuery(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, param) > 0;

    }

    public async Task<StrippingDriverDto> CreateStrippingDriver(CreateStrippingDriverDto dto)
    {
        var insertQuery = Stripping_SQL_Queries.CreateStrippingDriver();


        var parameters = new[]
        {
            new SqlParameter("@driverName", dto.DriverName),
            new SqlParameter("@creator", dto.Creator)
            };


        int newDriverId = await _database.ExecuteScalarAsync<int>(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, insertQuery, parameters);
        return new StrippingDriverDto(newDriverId, dto.DriverName, dto.Creator);
    }


    public async Task<StrippingLaborTypeDto> CreateStrippingLabor(CreateStrippingLaborTypeDto createStrippingLabor)
    {
        var insertQuery = Stripping_SQL_Queries.CreateStrippingLaborType();
        SqlParameter[] parameters = [new("@laborType", createStrippingLabor.LaborTypeName)];

        int newLaborTypeId = await _database.ExecuteScalarAsync<int>(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, insertQuery, parameters);
        return new StrippingLaborTypeDto(newLaborTypeId, createStrippingLabor.LaborTypeName);
    }

    public async Task<bool> DeleteStrippingLabor(int laborTypeId)
    {
        var query = Stripping_SQL_Queries.DeleteStrippingLabor();
        SqlParameter[] parameters = [new("@laborTypeId", laborTypeId)];

        var result = await _database.ExecuteSqlQuery(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, parameters);
        return result > 0;

    }


}