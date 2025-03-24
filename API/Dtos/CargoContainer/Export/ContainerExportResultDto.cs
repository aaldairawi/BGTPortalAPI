namespace API.Dtos.CargoContainer.Export
{
    public class ContainerExportResultDto : ContainerGeneralProps
    {

        public string? ShippingLine { get; set; } = string.Empty;
        public string? VesselName { get; set; } = string.Empty;
        public string? VesselVoyage { get; set; } = string.Empty;
        public string? ReceivedEmpty { get; set; } = string.Empty;
        public string? ContainerLoaded { get; set; } = string.Empty;
        public string? VesselCompleted { get; set; } = string.Empty; 

        public string? Berth { get; set; } = string.Empty;
        public string? UnitStuffed { get; set; } = string.Empty;

        public string? ReceivedFull { get; set; } = string.Empty;
        public ContainerExportResultDto(string unitId, string category, string status,
                      string shippingLine, string vesselName, string vesselVoyage,
                      string receivedEmpty, string containerLoaded, string vesselCompleted,
                      string berth, string unitStuffed, string receivedFull) : base(unitId, category, status)
        {
            ShippingLine = shippingLine; VesselName = vesselName; VesselVoyage = vesselVoyage;
            ReceivedEmpty = receivedEmpty; ContainerLoaded = containerLoaded;
            VesselCompleted = vesselCompleted; Berth = berth; UnitStuffed = unitStuffed;
            ReceivedFull = receivedFull;
        }
    }
}