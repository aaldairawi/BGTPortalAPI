
using API.Dtos.VesselSchedule;
using API.Helper;
using API.Services.Database;


namespace API.Services.VesselSchedule
{
    public class VesselScheduleRepository(IDatabase database) : IVesselSchedule
    {
        private readonly IDatabase _database = database ?? throw
        new ArgumentNullException(nameof(database));

        public async Task<List<WorkingVesselDto>> GetVesselSchedule()
        {
            var query = VesselScheduleQueries.GetVesselSchedule();

            var result = await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BGTPortalN4DatabaseConnection,
                query,
                async reader =>
                {
                    var list = new List<WorkingVesselDto>();

                    // Pre-resolve column ordinals
                    var vesselNameOrdinal = reader.GetOrdinal("VesselName");
                    var visitIdOrdinal = reader.GetOrdinal("VisitID");
                    var operatorCodeOrdinal = reader.GetOrdinal("Operator");
                    var ataOrdinal = reader.GetOrdinal("ATA");
                    var etaOrdinal = reader.GetOrdinal("ETA");
                    var startTimeOrdinal = reader.GetOrdinal("StartTime");
                    var berthOrdinal = reader.GetOrdinal("Berth");
                    var phaseOrdinal = reader.GetOrdinal("Phase");

                    while (await reader.ReadAsync())
                    {
                        list.Add(new WorkingVesselDto
                        {
                            VesselName = reader.IsDBNull(vesselNameOrdinal) ? string.Empty : reader.GetString(vesselNameOrdinal),
                            VisitID = reader.IsDBNull(visitIdOrdinal) ? string.Empty : reader.GetString(visitIdOrdinal),
                            OperatorCode = reader.IsDBNull(operatorCodeOrdinal) ? string.Empty : reader.GetString(operatorCodeOrdinal),
                            ATA = reader.IsDBNull(ataOrdinal) ? string.Empty : reader.GetString(ataOrdinal),
                            ETA = reader.IsDBNull(etaOrdinal) ? string.Empty : reader.GetString(etaOrdinal),
                            StartTime = reader.IsDBNull(startTimeOrdinal) ? string.Empty : reader.GetString(startTimeOrdinal),
                            Berth = reader.IsDBNull(berthOrdinal) ? string.Empty : reader.GetString(berthOrdinal),
                            Phase = reader.IsDBNull(phaseOrdinal) ? string.Empty : reader.GetString(phaseOrdinal),
                     
                        });
                    }

                    return list;
                });

            return result;
        }






    }
}