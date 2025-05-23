using API.Dtos.Container;
using API.Helper;
using Microsoft.Data.SqlClient;

namespace API.Services.N4ContainerHistory
{
    public class ContainerCurrentStatusRepository : IContainerCurrentStatus
    {

        private readonly IDatabase _database;
        public ContainerCurrentStatusRepository(IDatabase databse)
        {
            _database = databse ?? throw new ArgumentNullException(nameof(databse));
        }
        public async Task<ContainerCurrentStatusDto> GetContainerCurrentStatus(string containerNumber)
        {
            var query = Container_SQL_Queries.GetContainerCurrentStatusQuery();

            var result = await _database.ExecuteReaderAsync(Database.BGTPortalN4Db, query, async reader =>
            {
                while (await reader.ReadAsync())
                {
                    var containerId = reader["UnitNbr"].ToString() ?? "";
                    var transitState = reader["TState"].ToString() ?? "";
                    var category = reader["category"].ToString() ?? "";
                    var visitState = reader["visit_state"].ToString() ?? "";
                    var freightKind = reader["freight_kind"].ToString() ?? "";
                    var lineOperator = reader["Line Operator"].ToString() ?? "";
                    var operatorName = reader["Operator Name"].ToString() ?? "";
                    var berth = reader["Berth"].ToString() ?? "";
                    var categoryString = category switch
                    {
                        "STRGE" => "Storage",
                        "IMPRT" => "Import",
                        "EXPRT" => "Export",
                        "THRGH" => "Through",
                        _ => ""
                    };
                    return new ContainerCurrentStatusDto(containerId, transitState, categoryString, visitState, freightKind == "FCL" ? "FULL" : "EMPTY", 
                    operatorName, lineOperator, berth);
                }
                return null!;
            }, new SqlParameter("@containerNumber", containerNumber));
            return result;
        }

    }
}