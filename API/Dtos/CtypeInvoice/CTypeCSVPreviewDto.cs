namespace API.Dtos.CtypeInvoice
{
    public class CTypeCSVPreviewDto
    {
        public string CustomerName { get; set; } = string.Empty;
        public string ProfitCenter { get; set; } = string.Empty; // Done
        public string FinalNumber { get; set; } = string.Empty;
        public string GlCode { get; set; } = string.Empty;
        public string ChargeableUnitEvent { get; set; } = string.Empty;
        public string ContainerId { get; set; } = string.Empty;
        public double Amount { get; set; }
        public string InvoiceContainerSizeQuantityBilled { get; set; } = string.Empty;
        public string FinalizedDate { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;

        public string CustomerSapCode { get; set; } = string.Empty;
        public double Total { get; set; }
        public string Berth { get; set; } = string.Empty; // Done
        public CTypeCSVPreviewDto(string customerName, string profitCenter, string finalNumber, string glCode, 
        string chargeableUnitEvent, string containerId, double amount,
        string invoiceContainerSizeQuantityBilled, string finalizedDate, string currency, string consigneeId, double total, string berth)
        {
            CustomerName = customerName; ProfitCenter = profitCenter; FinalNumber = finalNumber; GlCode = glCode; ChargeableUnitEvent = chargeableUnitEvent; ContainerId = containerId;
            Amount = amount; InvoiceContainerSizeQuantityBilled = invoiceContainerSizeQuantityBilled; FinalizedDate = finalizedDate;
            Currency = currency; CustomerSapCode = consigneeId; Total = total; Berth = berth;
        }

    }
}