using API.Dtos.Container;
using API.Dtos.Container.Import;
using API.Extensions;
using API.Helper;

namespace API.Services.N4ContainerHistory
{
    public class ContainerImportLifeTimeRepository : IContainerImportLifeTime
    {

        private readonly IContainerGeneralRequests _containerGeneralContext;
        public ContainerImportLifeTimeRepository(IContainerGeneralRequests context)
        {
            _containerGeneralContext = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<ContainerImportResultDto> GetContainerImportResult(ContainerLifeTimeMasterDataDto input)
        {
            var (containerUnitGkey, vesselName, vesselATA) = await _containerGeneralContext.ExtractUnitGkeyVesselNameVesselATA(input);

            var containerDischarge = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_DISCH);

            var stripped = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_STRIP);

            var containerLoadedOnTruck = await _containerGeneralContext.GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_DELIVER);
            var containerStripped = stripped ?? string.Empty;

            var (gateOut, receivedBackEmpty) = await _containerGeneralContext.ExtractGateOutForUnit(containerUnitGkey, input.ContainerId);

            var containerReceivedData = stripped ?? receivedBackEmpty;
            return input.MapContainerImportResult(vesselName ?? string.Empty, vesselATA ?? string.Empty,
            containerDischarge ?? string.Empty, containerStripped, containerReceivedData ?? string.Empty, 
            containerLoadedOnTruck ?? string.Empty, gateOut ?? string.Empty);

        }

    }
}