using System;
using System.Collections.Generic;

namespace API.Data.ExistingViews;

public partial class InvoiceCustomer
{
    public int ConsigneeGkey { get; set; }

    public string? ConsigneeId { get; set; }

    public string? ConsigneeName { get; set; }

    public string? Role { get; set; }

    public string? SapCode { get; set; }
}
