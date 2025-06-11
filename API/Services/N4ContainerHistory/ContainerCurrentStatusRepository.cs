
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

        public async Task<ContainerCurrentStatusDto?> GetContainerCurrentStatusResult(string containerNumber)
        {
            var query = Container_SQL_Queries.GetContainerCurrentStatusQuery();

            return await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BGTPortalN4DatabaseConnection,
                query,
                async reader =>
                {
                    int containerIdIndex = reader.GetOrdinal("UnitNbr");
                    int transitStateIndex = reader.GetOrdinal("TState");
                    int categoryIndex = reader.GetOrdinal("Category");
                    int visitStateIndex = reader.GetOrdinal("VisitState");
                    int freightKindIndex = reader.GetOrdinal("FreightKind");
                    int lineOperatorIndex = reader.GetOrdinal("LineOperator");
                    int operatorNameIndex = reader.GetOrdinal("OperatorName");
                    int berthIndex = reader.GetOrdinal("Berth");

                    while (await reader.ReadAsync())
                    {
                        string SafeGetString(int index) => reader.IsDBNull(index) ? "" : reader.GetString(index);

                        var containerId = SafeGetString(containerIdIndex);
                        var transitState = SafeGetString(transitStateIndex);
                        var category = SafeGetString(categoryIndex);
                        var visitState = SafeGetString(visitStateIndex);
                        var freightKind = SafeGetString(freightKindIndex);
                        var lineOperator = SafeGetString(lineOperatorIndex);
                        var operatorName = SafeGetString(operatorNameIndex);
                        var berth = SafeGetString(berthIndex);

                        var categoryString = category switch
                        {
                            "STRGE" => "Storage",
                            "IMPRT" => "Import",
                            "EXPRT" => "Export",
                            "THRGH" => "Through",
                            _ => ""
                        };

                        var friendlyFreightKind = freightKind == "FCL" ? "FULL" : "EMPTY";

                        return new ContainerCurrentStatusDto(
                            containerId,
                            transitState,
                            categoryString,
                            visitState,
                            friendlyFreightKind,
                            lineOperator,
                            operatorName,
                            berth
                        );
                    }

                    return null;
                },
                new SqlParameter("@containerNumber", containerNumber));
        }


    }
}