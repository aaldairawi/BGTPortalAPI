using API.Data.ExistingViews;
using API.Dtos.CargoContainer;
using API.Dtos.CargoContainer.Export;
using API.Dtos.CargoContainer.Import;
using API.Dtos.CtypeInvoice;

namespace API.Extensions
{
    public static class NavisApiExtensions
    {

        
        public static ContainerImportResultDto MapContainerImportResult(this ContainerLifeTimeMasterDataDto input,
        string vesselName, string vesselATA, string containerDischargeDate, string stripped, string receivedBackEmpty,

        string loadedToTruck, string gateOut)
        {
            return new ContainerImportResultDto(
                input.ContainerId, input.Category == "IMPRT" ? "IMPORT" : string.Empty,
                input.FreightKind == "FCL" ? "FULL" : "EMPTY", input.LineName ?? string.Empty, vesselName, input.ArrivePositionLocId ?? string.Empty,
                vesselATA, containerDischargeDate, stripped, receivedBackEmpty, input.Berth ?? string.Empty, loadedToTruck, gateOut);

        }
        public static ContainerExportResultDto MapContainerExportResult(this ContainerLifeTimeMasterDataDto input,
        string vesselName, string receivedEmpty, string vesselATC, string containerLoaded, string receivedFull,
         string unitStuffed)
        {
            var category = input.Category == "EXPRT" ? "Export" : "Storage";
            var unitStatus = input.FreightKind == "FCL" ? "Full" : "Empty";
            return new ContainerExportResultDto(input.ContainerId, category, unitStatus,
            input.LineName ?? string.Empty, vesselName ?? string.Empty, input.LastPositionLocId ?? string.Empty, receivedEmpty ?? string.Empty,
            containerLoaded ?? string.Empty, vesselATC ?? string.Empty, input.Berth ?? string.Empty, unitStuffed ?? string.Empty, receivedFull ?? string.Empty);

        }
        public static CTypeCSVPreviewDto MapToCSVPreviewDto(this CTypeInvoiceItemsDto input, string customer,
        string profitCenter, string finalNumber, string containerSize, string finalizedDate, string currency, string customerSapCode,
        double totalInvoiceSum, string berth)
        {
            string finalNumberContainerSizeQuantity = $"{finalNumber}-{containerSize}-{input.Quantity}";
            return new CTypeCSVPreviewDto(customer, profitCenter, finalNumber, input.GlCode, input.ChargeableUnitEvent,
            input.ContainerId, input.Total, finalNumberContainerSizeQuantity, finalizedDate, currency, customerSapCode, totalInvoiceSum, berth);
        }
    }
}