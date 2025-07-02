
namespace API.Dtos.Invoice;

public class SLParentAndPartnerInvoiceItemsDto
{
    public List<SLInvoiceItemDto> ParentInvoiceItems { get; set; } = [];
    public List<SLInvoiceItemDto> PartnerInvoiceItems { get; set; } = [];
}