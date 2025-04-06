namespace API.Dtos.CtypeInvoice
{
    public class FinalizedInvoiceItemsDto(
        string id,
        string description,
        int quantity,
        double quantityBilled,
        double total,
        string glCode,
        string invoiceFinalNumber,
        string customerName,
        string invoiceCreatedDate,
        string invoiceFinalizedDate,
        string containerId,
        string chargeableUnitEvent,
        string invoiceDraftNumber
    )
    {
        public string Id { get; init; } = id;
        public string Description { get; init; } = description;
        public int Quantity { get; init; } = quantity;
        public double QuantityBilled { get; init; } = quantityBilled;
        public double Total { get; init; } = total;
        public string GlCode { get; init; } = glCode;
        public string InvoiceFinalNumber { get; init; } = invoiceFinalNumber;
        public string CustomerName { get; init; } = customerName;
        public string InvoiceCreatedDate { get; init; } = invoiceCreatedDate;
        public string InvoiceFinalizedDate { get; init; } = invoiceFinalizedDate;
        public string ContainerId { get; init; } = containerId;
        public string InvoiceDraftNumber { get; init; } = invoiceDraftNumber;
        public string ChargeableUnitEvent { get; init; } = chargeableUnitEvent;
    }
}
