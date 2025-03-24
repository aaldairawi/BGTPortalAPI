using System;
using System.Collections.Generic;

namespace API.Data.ExistingViews;

public partial class InvoiceParmValue
{
    public long Gkey { get; set; }

    public long InvoiceGkey { get; set; }

    public string Metafield { get; set; } = null!;

    public string? Value { get; set; }

    public string? UiValue { get; set; }
}
