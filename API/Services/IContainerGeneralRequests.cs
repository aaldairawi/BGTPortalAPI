using API.Dtos.CargoContainer;

namespace API.Services
{
    public interface IContainerGeneralRequests
    {
        Task<ContainerLifeTimeMasterDataDto> GetContainerLifeTimeMasterDataImport(string unitNumber);
        Task<ContainerLifeTimeMasterDataDto> GetContainerLifeTimeMasterDataExport(string unitNumber);

        Task<string> GetVesselATA(string vesselId);
        Task<string> GetVesselATC(string vesselId);
        Task<string> GetVesselName(string visitId);
        Task<string> GetUnitReceivedBackDateByEventNameDateAndContainerId(string eventName, DateTime dateTimeOfEvent, string containerId);

        Task<string> GetEventDateByUnitGkeyAndEventId(long unitGkey, string eventId);
        Task<string> GetEventReceivedDateByUnitIdAndEventId(string unitId, string eventId);
        Task<(string? gateOut, string? receivedBackEmpty)> ExtractGateOutForUnit(long containerUnitGkey, string containerId);
        Task<(long containerUnitGkey, string vesselName, string vesselATA)> ExtractUnitGkeyVesselNameVesselATA(ContainerLifeTimeMasterDataDto containerLifeTimeMasterDataDto);
        Task<(long containerUnitGkey, string vesselName, string vesselATC)> ExtractUnitGkeyVesselNameVesselATC(ContainerLifeTimeMasterDataDto containerLifeTimeMasterDataDto);
    }
}