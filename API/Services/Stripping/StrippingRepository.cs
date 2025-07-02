

using API.Dtos.Stripping.Containers;
using API.Dtos.Stripping.Dashboard;
using API.Enums;
using API.Helper;
using API.Services.Database;
using Microsoft.Data.SqlClient;

namespace API.Services.Stripping
{
    public class StrippingRepository : IStripping
    {
        private readonly IDatabase _database;
        public StrippingRepository(IDatabase database)
        {
            _database = database ?? throw new ArgumentNullException(nameof(database));
        }





        public async Task<List<StrippedContainerDto>> GetStrippedContainersFromInAppDatabase(StrippedContainersDataRequest dataRequest)
        {
            var query = Stripping_SQL_Queries.GetAllContainersFromStrippedInAppDatabase();
            var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
            {
                List<StrippedContainerDto> containerListResult = [];
                var idIndex = reader.GetOrdinal("Id");
                var containerNumberIndex = reader.GetOrdinal("ContainerNumber");
                var lineOperatorIndex = reader.GetOrdinal("LineOperator");
                var isoIndex = reader.GetOrdinal("ISO");
                var sizeIndex = reader.GetOrdinal("Size");
                var dateStrippedIndex = reader.GetOrdinal("DateStripped");
                var laborTypeIndex = reader.GetOrdinal("LaborType");
                var driverNameIndex = reader.GetOrdinal("DriverName");
                var berthIndex = reader.GetOrdinal("Berth");
                var finalIndex = reader.GetOrdinal("Final");

                while (await reader.ReadAsync())
                {
                    var id = !reader.IsDBNull(idIndex) ? reader.GetInt32(idIndex) : 0;
                    var containerNumber = !reader.IsDBNull(containerNumberIndex) ? reader.GetString(containerNumberIndex) : "";
                    var lineOperator = !reader.IsDBNull(lineOperatorIndex) ? reader.GetString(lineOperatorIndex) : "";
                    var iso = !reader.IsDBNull(isoIndex) ? reader.GetString(isoIndex) : "";
                    var size = !reader.IsDBNull(sizeIndex) ? reader.GetString(sizeIndex) : "";
                    var dateStripped = !reader.IsDBNull(dateStrippedIndex) ? reader.GetDateTime(dateStrippedIndex) : DateTime.MinValue;

                    var laborType = !reader.IsDBNull(laborTypeIndex) ? reader.GetByte(laborTypeIndex) : (byte)0;
                    var driverName = !reader.IsDBNull(driverNameIndex) ? reader.GetString(driverNameIndex) : "";
                    var berth = !reader.IsDBNull(berthIndex) ? reader.GetString(berthIndex) : "";
                    var final = !reader.IsDBNull(finalIndex) && reader.GetBoolean(finalIndex);


                    containerListResult.Add(new()
                    {
                        Id = id,
                        ContainerNumber = containerNumber,
                        LineOperator = lineOperator,
                        ISO = iso,
                        Size = size,
                        DateStripped = Convert.ToDateTime(dateStripped),
                        LaborType = (LaborType)(laborType),
                        DriverName = driverName,
                        Berth = berth,
                        Final = final,
                    });
                }
                return containerListResult;
            }, new SqlParameter("@dateStripped", dataRequest.DateStripped), new SqlParameter("@berth", dataRequest.Berth));
            return result;
        }

        public async Task ProcessRetiredContainersInDatabase(StrippedContainersDataRequest dataRequest)
        {
            List<RetiredContainersViewDto> retiredContainersFromNavis = await GetRetiredContainersFromNavis(dataRequest.DateStripped, dataRequest.Berth);
            foreach (RetiredContainersViewDto retiredContainer in retiredContainersFromNavis)
            {

                bool containerAlreadySavedInApp = await DoesContainerExistInStrippedInAppDbWithTheDateStripped(retiredContainer.ContainerNumber, retiredContainer.DateStripped);
                if (containerAlreadySavedInApp)
                {
                    continue;
                }
                else
                {
                    await SaveRetiredContainerInAppDb(retiredContainer);
                }
            }
        }
        public async Task SaveRetiredContainerInAppDb(RetiredContainersViewDto retiredContainerData)
        {
            var query = Stripping_SQL_Queries.SaveRetiredConainersFromNavis();
            await _database.ExecuteSqlQuery(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query,
            new SqlParameter("@containerNumber", retiredContainerData.ContainerNumber),
            new SqlParameter("@lineOperator", retiredContainerData.LineOperator),
            new SqlParameter("@iso", retiredContainerData.ISO),
            new SqlParameter("@size", retiredContainerData.Size),
            new SqlParameter("@dateStripped", retiredContainerData.DateStripped),
            new SqlParameter("@laborType", LaborType.NONE),
            new SqlParameter("@driverName", string.Empty),
            new SqlParameter("@berth", retiredContainerData.Berth),
            new SqlParameter("@strippedInNavis", true),
            new SqlParameter("@strippedInApp", false),
            new SqlParameter("@final", false));

        }


        private async Task<List<RetiredContainersViewDto>> GetRetiredContainersFromNavis(DateTime dateStripped, string berth)
        {
            var query = Stripping_SQL_Queries.GetAllContainersStrippedInNavis();
            var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
            {
                List<RetiredContainersViewDto> result = [];

                while (await reader.ReadAsync())
                {
                    var containerNumber = reader["ContainerNumber"].ToString() ?? "";
                    var lineOperator = reader["LineOperator"].ToString() ?? "";
                    var iso = reader["ISO"].ToString() ?? "";
                    var size = reader["Size"].ToString() ?? "";
                    var containerDateStripped = reader["DateStripped"].ToString() ?? "";
                    var berth = reader["Berth"].ToString() ?? "";
                    result.Add(new()
                    {
                        ContainerNumber = containerNumber,
                        LineOperator = lineOperator,
                        ISO = iso,
                        Size = size,
                        DateStripped = Convert.ToDateTime(containerDateStripped),
                        Berth = berth
                    });
                }
                return result;

            }, new SqlParameter("@dateStripped", dateStripped), new SqlParameter("@berth", berth));
            return result;
        }

        private async Task<bool> DoesContainerExistInStrippedInAppDbWithTheDateStripped(string containerNumber, DateTime dateStripped)
        {

            var query = Stripping_SQL_Queries.DoesContainerExistInStrippedInAppWithTheSameDateStrippedDate();
            var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
            {
                return await reader.ReadAsync();
            }, new SqlParameter("@containerNumber", containerNumber), new SqlParameter("@dateStripped", dateStripped));
            return result;
        }



        public async Task<bool> PatchStripContainerInDB(UpdateRetiredContainers updateDto)
        {
            var query = Stripping_SQL_Queries.UpdateContainersQuery();
            byte laborTypeParsedToByte = DetermineLaborTypeAsByte(updateDto.LaborType);

            int updatedCount = 0;

            foreach (var containerNumber in updateDto.Containers)
            {
                SqlParameter[] parameters =
                [
                    new("@driverName", updateDto.DriverName),
                    new("@laborType", laborTypeParsedToByte),
                    new("@containerNumber", containerNumber),
                    new("@dateStripped", updateDto.DateStripped.Date)
            ];

                var result = await _database.ExecuteSqlQuery(
                    DatabaseConnectionConstants.BGTPortalN4DatabaseConnection,
                    query,
                    parameters);

                if (result > 0)
                {
                    updatedCount++;
                }
            }

            return updatedCount > 0;
        }


        private static byte DetermineLaborTypeAsByte(string laborType)
        {
            return laborType.Trim() switch
            {
                "None" => 8,
                "BGT" => 1,
                "IPA" => 2,
                "Labor" => 3,
                "Flat" => 4,
                _ => 0,
            };

        }

        public async Task<List<StrippingDashboardDto>> GetDashboardDataAsync(DateTime date)
        {
            var query = Stripping_SQL_Queries.GetDashboardDataByRange();

            return await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query,

                    async reader =>
                    {
                        List<StrippingDashboardDto> result = [];

                        while (await reader.ReadAsync())
                        {
                            result.Add(new StrippingDashboardDto
                            {
                                Berth = reader.GetString(0),
                                LaborType = reader.GetByte(1).ToString(),
                                Shift20 = reader.GetInt32(2),
                                Shift40 = reader.GetInt32(3),
                                Shift45 = reader.GetInt32(4),
                            });
                        }

                        return result;
                    }, new SqlParameter("@date", date));

        }
        public async Task<List<StrippingDashboardDto>> GetDashboardDataRangeAsync(DateTime fromDate, DateTime toDate)
        {
            var query = Stripping_SQL_Queries.GetDashboardDataByRange();

            return await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BGTPortalN4DatabaseConnection,
                query,
                async reader =>
                {
                    List<StrippingDashboardDto> result = [];

                    while (await reader.ReadAsync())
                    {
                        result.Add(new StrippingDashboardDto
                        {
                            Berth = reader.GetString(0),
                            LaborType = reader.GetByte(1).ToString(),
                            Shift20 = reader.GetInt32(2),
                            Shift40 = reader.GetInt32(3),
                            Shift45 = reader.GetInt32(4),
                        });
                    }

                    return result;
                },
                new SqlParameter("@from", fromDate),
                new SqlParameter("@to", toDate)
            );
        }

        public async Task<List<StrippedContainerDto>> GetCsvData(
    DateTime fromDate,
    DateTime toDate,
    CancellationToken ct = default)
        {
            var query = Stripping_SQL_Queries.GetDashboardCsvData();

            return await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BGTPortalN4DatabaseConnection,
                query,
                async reader =>
                {
                    List<StrippedContainerDto> result = [];

                    while (await reader.ReadAsync(ct))
                    {
                        var dto = new StrippedContainerDto
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            ContainerNumber = reader["ContainerNumber"]?.ToString() ?? "",
                            LineOperator = reader["LineOperator"]?.ToString() ?? "",
                            ISO = reader["ISO"]?.ToString() ?? "",
                            Size = reader["Size"]?.ToString() ?? "",
                            DateStripped = reader.GetDateTime(reader.GetOrdinal("DateStripped")),
                            LaborType = (LaborType)reader.GetByte(reader.GetOrdinal("LaborType")),
                            DriverName = reader["DriverName"]?.ToString() ?? "",
                            Berth = reader["Berth"]?.ToString() ?? "",
                            Final = reader.GetBoolean(reader.GetOrdinal("Final"))
                        };

                        result.Add(dto);
                    }

                    return result;
                },
                new SqlParameter("@from", fromDate),
                new SqlParameter("@to", toDate)
            );
        }



    }
}