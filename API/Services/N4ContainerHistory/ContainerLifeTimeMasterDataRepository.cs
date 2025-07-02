
using API.Dtos.Container;
using API.Helper;
using API.Services.Database;
using Microsoft.Data.SqlClient;

namespace API.Services.N4ContainerHistory;

public class ContainerLifeTimeMasterDataRepository(IDatabase database) : IContainerLifeTimeMasterData
{
    private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));

    public async Task<ContainerLifeTimeMasterDataDto?> GetContainerLifeTimeMasterData(string containerId, bool getContainerImport)
    {


        string importQuery = Container_SQL_Queries.ImportContainerMasterDataQuery();

        string exportQuery = Container_SQL_Queries.ExportContainerMasterDataQuery();

        string activeQuery = getContainerImport ? importQuery : exportQuery;


        var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, activeQuery,
            async reader =>
            {
                if (reader.HasRows)
                {
                    int unitGkeyOrdinal = reader.GetOrdinal("UnitGkey");
                    int visitStateUfvOrdinal = reader.GetOrdinal("VisitStateUfv");
                    int visitStateUnitOrdinal = reader.GetOrdinal("VisitStateUnit");
                    int transitStateOrdinal = reader.GetOrdinal("TransitState");
                    int categoryOrdinal = reader.GetOrdinal("Category");
                    int freightKindOrdinal = reader.GetOrdinal("FreightKind");
                    int lastPosLocTypeOrdinal = reader.GetOrdinal("LastPositionLocType");
                    int lastPosLocIdOrdinal = reader.GetOrdinal("LastPositionLocId");
                    int lineNameOrdinal = reader.GetOrdinal("LineName");
                    int arrivePosLocIdOrdinal = reader.GetOrdinal("ArrivePositionLocId");
                    int berthOrdinal = reader.GetOrdinal("Berth");

                    while (await reader.ReadAsync())
                    {
                        return new ContainerLifeTimeMasterDataDto(
                            containerId,
                            reader.IsDBNull(unitGkeyOrdinal) ? 0 : reader.GetInt64(unitGkeyOrdinal),
                            reader.IsDBNull(visitStateUfvOrdinal) ? "" : reader.GetString(visitStateUfvOrdinal),
                            reader.IsDBNull(visitStateUnitOrdinal) ? "" : reader.GetString(visitStateUnitOrdinal),
                            reader.IsDBNull(transitStateOrdinal) ? "" : reader.GetString(transitStateOrdinal),
                            reader.IsDBNull(categoryOrdinal) ? "" : reader.GetString(categoryOrdinal),
                            reader.IsDBNull(freightKindOrdinal) ? "" : reader.GetString(freightKindOrdinal),
                            reader.IsDBNull(lastPosLocTypeOrdinal) ? "" : reader.GetString(lastPosLocTypeOrdinal),
                            reader.IsDBNull(lastPosLocIdOrdinal) ? "" : reader.GetString(lastPosLocIdOrdinal),
                            reader.IsDBNull(lineNameOrdinal) ? "" : reader.GetString(lineNameOrdinal),
                            reader.IsDBNull(arrivePosLocIdOrdinal) ? "" : reader.GetString(arrivePosLocIdOrdinal),
                            reader.IsDBNull(berthOrdinal) ? "" : reader.GetString(berthOrdinal)
                        );
                    }
                }
                return null;
            }, new SqlParameter("@unitNumber", containerId));
        return result;

    }


}