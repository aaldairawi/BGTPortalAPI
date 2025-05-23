using API.Dtos.Container;
using API.Dtos.Container.Export;
using API.Extensions;
using API.Helper;

namespace API.Services.N4ContainerHistory
{
    public class ContainerExportLifeTimeRepository : IContainerExportLifeTime
    {
        private readonly IContainerGeneralRequests _containerGeneralContext;
        public ContainerExportLifeTimeRepository(IContainerGeneralRequests containerGeneralRequests)
        {
            _containerGeneralContext = containerGeneralRequests ?? throw new ArgumentNullException(nameof(containerGeneralRequests));
        }

        public async Task<ContainerExportResultDto> GetContainerExportResult(ContainerLifeTimeMasterDataDto input)
        {

            var (containerUnitGkey, vesselName, vesselATC) = await _containerGeneralContext.ExtractUnitGkeyVesselNameVesselATC(input);

            var unitInGate = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_IN_GATE);
            string unitStuff = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_STUFF);
            string containerLoaded = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_LOAD);
            string receivedEmpty = string.Empty;
            string receivedFull = string.Empty;
            if (string.IsNullOrEmpty(unitInGate) && !string.IsNullOrEmpty(unitStuff)) // Unit got stuffed inside the yard.
            {
                // Sets the received empty date for the stuffed unit in the yard to the Unit_Receive date.

                receivedEmpty = await _containerGeneralContext.GetEventReceivedDateByUnitIdAndEventId(input.ContainerId, Constants.UNIT_RECEIVE);
            }

            // This check ensures the unit was stuffed outside and is now back for export.
            if (!string.IsNullOrEmpty(unitInGate) && input.FreightKind == "FCL")// check this!
            {
                receivedFull = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_IN_GATE);
            }
            // Add a check here for units that came back empty from outside and are going to be exported!.
            if (!string.IsNullOrEmpty(unitInGate) && input.FreightKind == "MTY")
            {
                receivedEmpty = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_IN_GATE);
            }
            return input.MapContainerExportResult(vesselName, receivedEmpty, vesselATC, containerLoaded, receivedFull, unitStuff);
        }
    }
}