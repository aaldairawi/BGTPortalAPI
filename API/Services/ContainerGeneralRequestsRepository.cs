using API.Dtos.CargoContainer;
using API.Helper;
using Microsoft.Data.SqlClient;


namespace API.Services
{
    public class ContainerGeneralRequestsRepository : IContainerGeneralRequests
    {
        private readonly IConfiguration _configuration;
        public ContainerGeneralRequestsRepository(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<ContainerLifeTimeMasterDataDto> GetContainerLifeTimeMasterDataImport(string unitNumber, string unitCategory)
        {
            string importQuery = Container_SQL_Queries.ContainerMasterDataQuery();


            using (SqlConnection connection = new(_configuration.GetConnectionString("BGTPortalN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(importQuery, connection))
                {
                    command.Parameters.AddWithValue("@unitNumber", unitNumber);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {

                                var unitGkey = reader["UnitGkey"];
                                var visitState = reader["visit_state_ufv"];
                                var visitStateUnit = reader["visit_state_unit"];
                                var transitState = reader["transit_state"];
                                var category = reader["category"];
                                var freightKind = reader["freight_kind"];
                                var lastPositionLocType = reader["last_pos_loctype"];
                                var lastPositionLocId = reader["last_pos_locid"];
                                var lineName = reader["LineName"];
                                var arrivePositionLocId = reader["arrive_pos_locid"];
                                var berth = reader["Berth"];

                                ContainerLifeTimeMasterDataDto masterDataDto = new(
                                    unitNumber, Convert.ToInt64(unitGkey),
                                visitState.ToString() ?? "",
                                visitStateUnit.ToString() ?? "",
                                transitState.ToString() ?? "",
                                category.ToString() ?? "",
                                freightKind.ToString() ?? "",
                                lastPositionLocType.ToString() ?? "",
                                lastPositionLocId.ToString() ?? "",
                                lineName.ToString() ?? "", arrivePositionLocId.ToString() ?? "",
                                berth.ToString() ?? ""
                                );
                                return masterDataDto;
                            }
                        }

                    }
                }
            }
            return null!;
        }

        public async Task<ContainerLifeTimeMasterDataDto> GetContainerLifeTimeMasterDataExport(string unitNumber, string unitCategory)
        {
            string exportQuery = Container_SQL_Queries.ExportContainerMasterDataQuery();

            using (SqlConnection connection = new(_configuration.GetConnectionString("BGTPortalN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(exportQuery, connection))
                {
                    command.Parameters.AddWithValue("@unitNumber", unitNumber);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {

                                var unitGkey = reader["UnitGkey"];
                                var visitState = reader["visit_state_ufv"];
                                var visitStateUnit = reader["visit_state_unit"];
                                var transitState = reader["transit_state"];
                                var category = reader["category"];
                                var freightKind = reader["freight_kind"];
                                var lastPositionLocType = reader["last_pos_loctype"];
                                var lastPositionLocId = reader["last_pos_locid"];
                                var lineName = reader["LineName"];
                                var arrivePositionLocId = reader["arrive_pos_locid"];
                                var berth = reader["Berth"];

                                ContainerLifeTimeMasterDataDto masterDataDto = new(
                                unitNumber, Convert.ToInt64(unitGkey),
                                visitState.ToString() ?? "",
                                visitStateUnit.ToString() ?? "",
                                transitState.ToString() ?? "",
                                category.ToString() ?? "",
                                freightKind.ToString() ?? "",
                                lastPositionLocType.ToString() ?? "",
                                lastPositionLocId.ToString() ?? "",
                                lineName.ToString() ?? "", arrivePositionLocId.ToString() ?? "",
                                berth.ToString() ?? ""
                                );
                                return masterDataDto;
                            }
                        }

                    }
                }
            }
            return null!;
        }

        public async Task<string> GetVesselATA(string vesselId)
        {
            string query = "SELECT ata AS ActualTimeOfArrival FROM dbo.argo_carrier_visit WHERE (id=@vesselId)";
            using (SqlConnection connection = new(_configuration.GetConnectionString("SparcsN4DatabaseConnection")))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@vesselId", vesselId);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {
                                if (!string.IsNullOrEmpty(reader["ActualTimeOfArrival"].ToString()))
                                {
                                    return Convert.ToDateTime(reader["ActualTimeOfArrival"]).ToString("M-dd-yyyy hh:mm");
                                }
                                else
                                {
                                    return null!;
                                }
                            }
                        }

                    }
                }
            }

            return null!;
        }

        public async Task<string> GetVesselATC(string vesselId)
        {

            string query = "SELECT dbo.vsl_vessel_visit_details.end_work AS EndWork FROM dbo.argo_carrier_visit INNER JOIN dbo.vsl_vessel_visit_details ON dbo.argo_carrier_visit.cvcvd_gkey = dbo.vsl_vessel_visit_details.vvd_gkey WHERE (dbo.argo_carrier_visit.id = @vesselId)";

            using (SqlConnection connection = new(_configuration.GetConnectionString("SparcsN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@vesselId", vesselId);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (await reader.ReadAsync())
                        {
                            if (!string.IsNullOrEmpty(reader["EndWork"].ToString()))
                            {
                                return Convert.ToDateTime(reader["EndWork"]).ToString("M-dd-yyyy hh:mm");
                            }
                            else
                            {
                                return null!;
                            }
                        }
                    }
                }
            }
            return null!;
        }
        public async Task<string> GetUnitReceivedBackDateByEventNameDateAndContainerId(string eventName, DateTime dateTimeOfEvent, string containerId)
        {
            string query = "SELECT placed_time AS PlacedTime FROM CtrLifeTime_New WHERE day(DeleveryDate)=" + "@dayOfDate" + " AND month(DeleveryDate)=" + "@monthOfDate" + " AND year(DeleveryDate)=" + "@yearOfDate" + " AND id =@containerId AND EventName =@eventName";
            using (SqlConnection connection = new(_configuration.GetConnectionString("BGTPortalN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@dayOfDate", dateTimeOfEvent.Day);
                    command.Parameters.AddWithValue("@monthOfDate", dateTimeOfEvent.Month);
                    command.Parameters.AddWithValue("@yearOfDate", dateTimeOfEvent.Year);
                    command.Parameters.AddWithValue("@containerId", containerId);
                    command.Parameters.AddWithValue("@eventName", eventName);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (await reader.ReadAsync())
                        {
                            if (!string.IsNullOrEmpty(reader["PlacedTime"].ToString()))
                            {
                                return Convert.ToDateTime(reader["PlacedTime"].ToString()).ToString("M-dd-yyyy hh:mm");
                            }
                            else
                            {
                                return null!;
                            }
                        }
                    }
                }
            }
            return null!;
        }
        public async Task<string> GetVesselName(string visitId)
        {
            string connectionString = "Data Source=172.22.10.200;Initial Catalog=BGT_Portal_N4;user=awafa;password=a7561;Integrated Security=False;Connect Timeout=30;Encrypt=False;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False";

            // IQueryable<VesselVisitDetail> initialQuery = _naviscontainercontext.VesselVisitDetails.Where((vesselDetail) => vesselDetail.VisitId == visitId);
            string query = "SELECT name AS Name FROM BGT_VesselVisitDetails WHERE (VisitId = @visitId)";
            using (SqlConnection connection = new(connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@visitId", visitId);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (await reader.ReadAsync())
                        {
                            if (!string.IsNullOrEmpty(reader["Name"].ToString()))
                            {
                                return reader["Name"].ToString()!;
                            }
                            else
                            {
                                return "";
                            }
                        }
                    }
                }
            }
            return "";
        }

        public async Task<string> GetEventDateByUnitGkeyAndEventId(long unitGkey, string eventId)
        {

            string connectionString = "Data Source=172.22.10.200;Initial Catalog=BGT_Portal_N4;user=awafa;password=a7561;Integrated Security=False;Connect Timeout=30;Encrypt=False;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False";
            var query = "SELECT Eventtime AS EventTime FROM BGT_ServerEvent WHERE UnitGKey=@unitGkey AND EventID=@eventId";

            using (SqlConnection connection = new(connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@unitGkey", unitGkey);
                    command.Parameters.AddWithValue("@eventId", eventId);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (await reader.ReadAsync())
                        {
                            if (!string.IsNullOrEmpty(reader["EventTime"].ToString()))
                            {
                                return Convert.ToDateTime(reader["EventTime"].ToString()).ToString("M-dd-yyyy hh:mm");
                            }
                            else
                            {
                                return null!;
                            }
                        }
                    }
                }
            }
            return null!;
        }
        public async Task<string> GetEventReceivedDateByUnitIdAndEventId(string unitId, string eventId)
        {
            string connectionString = "Data Source=172.22.10.200;Initial Catalog=BGT_Portal_N4;user=awafa;password=a7561;Integrated Security=False;Connect Timeout=30;Encrypt=False;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False";
            string query = "SELECT MAX(Eventtime) AS EventTime FROM dbo.BGT_ServerEvent GROUP BY EventID  HAVING (UnitID = @unitId ) AND (EventID = @eventId)";

            using (SqlConnection connection = new(connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@unitId", unitId);
                    command.Parameters.AddWithValue("@eventId", eventId);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (await reader.ReadAsync())
                        {
                            if (!string.IsNullOrEmpty(reader["EventTime"].ToString()))
                            {
                                return Convert.ToDateTime(reader["EventTime"]).ToString("M-dd-yyyy hh:mm");
                            }
                            else
                            {
                                return "";
                            }
                        }
                    }
                }
            }
            return "";
        }

        public async Task<(string? gateOut, string? receivedBackEmpty)> ExtractGateOutForUnit(long containerUnitGkey, string containerId)
        {
            var gateOut = await GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_OUT_GATE);
            var passGateOutDate = DateTime.TryParse(gateOut, out DateTime result);
            string receivedBackEmptyDate = string.Empty;
            if (gateOut != null && passGateOutDate)
                receivedBackEmptyDate = await GetUnitReceivedBackDateByEventNameDateAndContainerId(Constants.UNIT_IN_GATE, result, containerId);
            return (gateOut, receivedBackEmptyDate);
        }

        public async Task<(long containerUnitGkey, string vesselName, string vesselATA)> ExtractUnitGkeyVesselNameVesselATA(ContainerLifeTimeMasterDataDto containerLifeTimeMasterDataDto)
        {
            long containerUnitGkey = containerLifeTimeMasterDataDto.UnitGkey;
            var vesselName = await GetVesselName(containerLifeTimeMasterDataDto.ArrivePositionLocId ?? "");
            var vesselATA = await GetVesselATA(containerLifeTimeMasterDataDto.ArrivePositionLocId ?? "");
            return (containerUnitGkey, vesselName, vesselATA);
        }
        public async Task<(long containerUnitGkey, string vesselName, string vesselATC)> ExtractUnitGkeyVesselNameVesselATC(ContainerLifeTimeMasterDataDto containerLifeTimeMasterDataDto)
        {
            long containerUnitGkey = containerLifeTimeMasterDataDto.UnitGkey;

            var vesselName = await GetVesselName(containerLifeTimeMasterDataDto.LastPositionLocId ?? "");

            var vesselATC = await GetVesselATC(containerLifeTimeMasterDataDto.LastPositionLocId ?? "");
            return (containerUnitGkey, vesselName, vesselATC);
        }

    }
}