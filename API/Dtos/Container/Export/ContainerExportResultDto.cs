
namespace API.Dtos.Container.Export
{
    public class ContainerExportResultDto(string unitId, string category, string status,
                  string shippingLine, string vesselName, string vesselVoyage,
                  string receivedEmpty, string containerLoaded, string vesselCompleted,
                  string berth, string unitStuffed, string receivedFull) : ContainerGeneralProps(unitId, category, status)
    {

        public string? ShippingLine { get; set; } = shippingLine;
        public string? VesselName { get; set; } = vesselName;
        public string? VesselVoyage { get; set; } = vesselVoyage;
        public string? ReceivedEmpty { get; set; } = receivedEmpty;
        public string? ContainerLoaded { get; set; } = containerLoaded;
        public string? VesselCompleted { get; set; } = vesselCompleted;
        public string? Berth { get; set; } = berth; public string? UnitStuffed { get; set; } = unitStuffed;

        public string? ReceivedFull { get; set; } = receivedFull;
    }
}