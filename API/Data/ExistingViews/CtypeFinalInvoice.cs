using System;
using System.Collections.Generic;

namespace API.Data.ExistingViews;

public partial class CtypeFinalInvoice
{
    public string? InvoiceType { get; set; }

    public long InvoiceGkey { get; set; }

    public long Draft { get; set; }

    public string? Final { get; set; }

    public DateTime? FinalDate { get; set; }

    public string CustomerName { get; set; } = null!;

    public string? Currency { get; set; }
}
