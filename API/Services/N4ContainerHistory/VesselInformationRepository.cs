
using API.Dtos.Container;
using API.Helper;
using Microsoft.Data.SqlClient;

namespace API.Services.N4ContainerHistory;

public class VesselInformationRepository : IVesselInformation
{
    private readonly IDatabase _database;
    public VesselInformationRepository(IDatabase database)
    {
        _database = database ?? throw new ArgumentNullException(nameof(database));

    }

    public async Task<VesselTimingDto> GetVesselActualTimeOfArrivalOrCompletion(ContainerLifeTimeMasterDataDto containerLifeTimeMasterDataDto, bool getVesselATA)
    {
        long containerUnitGkey = containerLifeTimeMasterDataDto.UnitGkey;

        // If true call GetVesselATA else call GetVesselATC.
        if (getVesselATA)
        {
            string vesselArrivalPositionLocId = containerLifeTimeMasterDataDto.ArrivePositionLocId ?? "";

            var vesselATA = await GetVesselATA(vesselArrivalPositionLocId) ?? "";
            var vesselName = await GetVesselName(vesselArrivalPositionLocId) ?? "";

            return new() { ContainerUnitGkey = containerUnitGkey, VesselATA = vesselATA, VesselName = vesselName };
        }
        else
        {
            string vesselLastPositionLocId = containerLifeTimeMasterDataDto.LastPositionLocId ?? "";

            var vesselATC = await GetVesselATC(vesselLastPositionLocId) ?? "";
            var vesselName = await GetVesselName(vesselLastPositionLocId) ?? "";
            return new() { ContainerUnitGkey = containerUnitGkey, VesselATC = vesselATC, VesselName = vesselName };


        }
    }

    private async Task<string?> GetVesselATA(string vesselId)
    {
        var query = Container_SQL_Queries.GetVesselATA();

        var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.SparcsN4, query, async reader =>
        {
            while (await reader.ReadAsync())
            {
                return Convert.ToDateTime(reader["ActualTimeOfArrival"]).ToString("M-dd-yyyy hh:mm");
            }
            return null;

        }, new SqlParameter("@vesselId", vesselId));
        return result;

    }

    private async Task<string?> GetVesselATC(string vesselId)
    {

        var query = Container_SQL_Queries.GetVesselATC();

        var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.SparcsN4, query, async reader =>
        {
            while (await reader.ReadAsync())
            {
                return Convert.ToDateTime(reader["EndWork"]).ToString("M-dd-yyyy hh:mm");
            }

            return null;
        }, new SqlParameter("@vesselId", vesselId));

        return result;

    }


    private async Task<string?> GetVesselName(string visitId)
    {
        var query = Container_SQL_Queries.GetVesselName();

        var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
        {
            while (await reader.ReadAsync())
            {
                return reader["Name"].ToString();
            }
            return null;


        }, new SqlParameter("@visitId", visitId));
        return result;
    }

}