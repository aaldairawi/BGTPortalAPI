
namespace API.Dtos.VesselSchedule;

public class WorkingVesselDto
{
    public required string VesselName { get; set; }
    public required string VisitID { get; set; }
    public required string OperatorCode { get; set; }
    public required string ATA { get; set; }
    public required string ETA { get; set; } 
    public required string StartTime { get; set; }
    public required string Berth { get; set; }
    public required string Phase { get; set; }

}
