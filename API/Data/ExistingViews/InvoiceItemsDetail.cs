
namespace API.Data.ExistingViews;

public partial class InvoiceItemsDetail
{
    public string? InvoiceFinalNumber { get; set; }

    public string? ContainerId { get; set; }

    public long? InvoiceItemGkey { get; set; }

    public long InvoiceDraftNumber { get; set; }

    public string? ChargeableUnitEvent { get; set; }

    public double? Total { get; set; }

    public double? Quantity { get; set; }

    public double? QuantityBilled { get; set; }

    public long InvoiceGkey { get; set; }

    public string? Description { get; set; }

    public string? Notes { get; set; }

    public long? CustomerGkey { get; set; }

    public DateTime? InvoiceFinalizedDate { get; set; }

    public DateTime? InvoiceCreatedDate { get; set; }

    public string? GlCode { get; set; }

    public string CustomerName { get; set; } = null!;
}
