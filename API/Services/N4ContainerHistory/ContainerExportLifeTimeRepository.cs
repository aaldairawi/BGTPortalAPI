using API.Dtos.Container;
using API.Dtos.Container.Export;
using API.Extensions;
using API.Helper;

namespace API.Services.N4ContainerHistory
{
    public class ContainerExportLifeTimeRepository(IContainerGeneralRequests containerGeneralRequests,
    IVesselInformation vesselInformation) : IContainerExportLifeTime
    {
        private readonly IContainerGeneralRequests _containerGeneralContext = containerGeneralRequests ?? throw new ArgumentNullException(nameof(containerGeneralRequests));
        private readonly IVesselInformation _vesselInformation = vesselInformation ?? throw new ArgumentNullException(nameof(vesselInformation));

        public async Task<ContainerExportResultDto> GetContainerExportResult(ContainerLifeTimeMasterDataDto input)
        {


            VesselTimingDto vesselTiming = await _vesselInformation.GetVesselActualTimeOfArrivalOrCompletion(input, false);

            var unitInGate = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(vesselTiming.ContainerUnitGkey, Constants.UNIT_IN_GATE);
            string? unitStuff = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(vesselTiming.ContainerUnitGkey, Constants.UNIT_STUFF);
            string? containerLoaded = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(vesselTiming.ContainerUnitGkey, Constants.UNIT_LOAD);
            string? receivedEmpty = string.Empty;
            string? receivedFull = string.Empty;
            if (string.IsNullOrEmpty(unitInGate) && !string.IsNullOrEmpty(unitStuff))
            {
                // Sets the received empty date for the stuffed unit in the yard to the Unit_Receive date.

                receivedEmpty = await _containerGeneralContext.GetEventReceivedDateByUnitIdAndEventId(input.ContainerId, Constants.UNIT_RECEIVE);
            }

            // This check ensures the unit was stuffed outside and is now back for export.
            if (!string.IsNullOrEmpty(unitInGate) && input.FreightKind == "FCL")// check this!
            {
                receivedFull = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(vesselTiming.ContainerUnitGkey, Constants.UNIT_IN_GATE);
            }
            // Add a check here for units that came back empty from outside and are going to be exported!.
            if (!string.IsNullOrEmpty(unitInGate) && input.FreightKind == "MTY")
            {
                receivedEmpty = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(vesselTiming.ContainerUnitGkey, Constants.UNIT_IN_GATE);
            }

            var vesselNameResult = vesselTiming.VesselName ?? "";
            var vesselATCResult = vesselTiming.VesselATC ?? "";
            var receivedEmptyResult = receivedEmpty ?? "";
            var containerLoadedResult = containerLoaded ?? "";
            var receivedFullResult = receivedFull ?? "";
            var unitStuffResult = unitStuff ?? "";

            return input.MapContainerExportResult(vesselNameResult, receivedEmptyResult, vesselATCResult,
            containerLoadedResult, receivedFullResult, unitStuffResult);
        }
    }
}