using API.Dtos.Container;
using API.Dtos.Container.Import;
using API.Extensions;
using API.Helper;

namespace API.Services.N4ContainerHistory
{
    public class ContainerImportLifeTimeRepository(IContainerGeneralRequests context, IVesselInformation vesselInformation) : IContainerImportLifeTime
    {

        private readonly IContainerGeneralRequests _containerGeneralContext = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IVesselInformation _vesselInformation = vesselInformation ?? throw new ArgumentNullException(nameof(vesselInformation));

        public async Task<ContainerImportResultDto> GetContainerImportResult(ContainerLifeTimeMasterDataDto input)
        {
            

            var vesselInformation = await _vesselInformation.GetVesselActualTimeOfArrivalOrCompletion(input, true);

            var containerDischarge = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(vesselInformation.ContainerUnitGkey, Constants.UNIT_DISCH);

            var stripped = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(vesselInformation.ContainerUnitGkey, Constants.UNIT_STRIP);

            var containerLoadedOnTruck = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(vesselInformation.ContainerUnitGkey, Constants.UNIT_DELIVER);
            var containerStripped = stripped ?? string.Empty;

            var (gateOut, receivedBackEmpty) = await _containerGeneralContext.ExtractGateOutForUnit(vesselInformation.ContainerUnitGkey,
            input.ContainerId);


            var containerReceivedData = stripped ?? receivedBackEmpty;
            var vesselName = vesselInformation.VesselName ?? "";
            var vesselATA = vesselInformation.VesselATA ?? "";

            return input.MapContainerImportResult(vesselName, vesselATA,
            containerDischarge ?? string.Empty, containerStripped, containerReceivedData ?? string.Empty,
            containerLoadedOnTruck ?? string.Empty, gateOut ?? string.Empty);

        }

    }
}