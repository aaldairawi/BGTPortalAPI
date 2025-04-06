using API.Dtos.CargoContainer;
using API.Dtos.CargoContainer.Export;
using API.Dtos.CargoContainer.Import;
using API.Enums;

namespace API.Extensions
{
    public static class NavisApiExtensions
    {

        
        public static ContainerImportResultDto MapContainerImportResult(this ContainerLifeTimeMasterDataDto input,
        string vesselName, string vesselATA, string containerDischargeDate, string stripped, string receivedBackEmpty,

        string loadedToTruck, string gateOut)
        {
            return new ContainerImportResultDto(
                input.ContainerId, Category.IMPORT,
                input.FreightKind == "FCL" ? "FULL" : "EMPTY", input.LineName ?? string.Empty, vesselName, input.ArrivePositionLocId ?? string.Empty,
                vesselATA, containerDischargeDate, stripped, receivedBackEmpty, input.Berth ?? string.Empty, loadedToTruck, gateOut);

        }
        public static ContainerExportResultDto MapContainerExportResult(this ContainerLifeTimeMasterDataDto input,
        string vesselName, string receivedEmpty, string vesselATC, string containerLoaded, string receivedFull,
         string unitStuffed)
        {
            
            var unitStatus = input.FreightKind == "FCL" ? "Full" : "Empty";
            return new ContainerExportResultDto(input.ContainerId, Category.EXPORT, unitStatus,
            input.LineName ?? string.Empty, vesselName ?? string.Empty, input.LastPositionLocId ?? string.Empty, receivedEmpty ?? string.Empty,
            containerLoaded ?? string.Empty, vesselATC ?? string.Empty, input.Berth ?? string.Empty, unitStuffed ?? string.Empty, receivedFull ?? string.Empty);

        }
        
    }
}