
namespace API.Helper
{
    public static class VesselScheduleQueries
    {
        public static string GetVesselSchedule()
        {
            return @"SELECT 
                name AS VesselName,
                VisitID AS VisitID,
                Operator AS Operator,
                ATA AS ATA,
                VesselUnderOperation AS StartTime,
                ETA AS ETA,
                Berth AS Berth,
                phase AS Phase
            FROM Bgt_Vessel_vist ORDER BY ETA";
        }

    }
}