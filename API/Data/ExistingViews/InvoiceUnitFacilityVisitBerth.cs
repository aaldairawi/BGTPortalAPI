using System;
using System.Collections.Generic;

namespace API.Data.ExistingViews;

public partial class InvoiceUnitFacilityVisitBerth
{
    public long Gkey { get; set; }

    public long? Horizon { get; set; }

    public string VisitState { get; set; } = null!;

    public string? TransitState { get; set; }

    public DateTime? CreateTime { get; set; }

    public string? Berth { get; set; }
}
