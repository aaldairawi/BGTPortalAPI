using API.Dtos.CargoContainer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class ContainerCurrentStatusRepository : IContainerCurrentStatus
    {

        private readonly IConfiguration _configuration;
        public ContainerCurrentStatusRepository(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }
        public async Task<ContainerCurrentStatusDto> GetContainerCurrentStatus(string containerNumber)
        {
            string query = "SELECT TOP (1) * FROM Navis_InternalContainerTracking WHERE UnitNbr=@containerNumber ORDER BY gID DESC";

            using (SqlConnection connection = new(_configuration.GetConnectionString("BGTPortalN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@containerNumber", containerNumber);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                var containerId = reader["UnitNbr"].ToString() ?? "";
                                var tState = reader["TState"].ToString() ?? "";
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
                                ContainerCurrentStatusDto containerCurrentStatusDto = new(containerId, tState, categoryString, visitState, freightKind == "FCL" ? "FULL" : "EMPTY", operatorName, lineOperator, berth);
                                return containerCurrentStatusDto;
                            }
                        }
                        else
                        {
                            return null!;
                        }
                    }
                }
            }
            return null!;
        }

    }
}