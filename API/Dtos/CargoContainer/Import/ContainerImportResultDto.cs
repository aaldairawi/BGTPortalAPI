
namespace API.Dtos.CargoContainer.Import
{
    public class ContainerImportResultDto : ContainerGeneralProps
    {

        public string? ShippingLine { get; set; } = string.Empty;
        public string? VesselName { get; set; } = string.Empty;
        public string? VesselVoyage { get; set; } = string.Empty;
        public string? VesselATA { get; set; } = string.Empty;

        public string? ContainerDischarge { get; set; } = string.Empty;
        public string? Stripped { get; set; } = string.Empty;
        public string? Received { get; set; } = string.Empty;
        public string? Berth { get; set; } = string.Empty;
        public string? LoadedToTruck { get; set; } = string.Empty;
        public string? GateOut { get; set; } = string.Empty;


        public ContainerImportResultDto(string unitId, string category, string status,
                      string shippingLine, string vesselName, string vesselVoyage, string vesselATA,
                      string containerDischarge, string stripped, string received,
                      string berth, string loadedToTruck, string gateOut) : base(unitId, category, status)
        {
            ShippingLine = shippingLine; VesselName = vesselName;
            VesselVoyage = vesselVoyage; VesselATA = vesselATA; ContainerDischarge = containerDischarge;
            Stripped = stripped; Received = received;
            Berth = berth; LoadedToTruck = loadedToTruck; GateOut = gateOut;
        }
    }
}