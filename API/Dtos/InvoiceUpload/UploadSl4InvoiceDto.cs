
namespace API.Dtos.InvoiceUpload
{
    public class UploadSl4InvoiceDto
    {
        public required string ParentInvoiceNumber { get; set; }
        public required string PartnerInvoiceNumber { get; set; }
        public required string InvoiceType { get; set; }
        public required string Berth { get; set; }

        public UploadSl4InvoiceDto() { }

        public UploadSl4InvoiceDto(string parentInvoiceNumber,
        string partnerInvoiceNumber, string invoiceType, string berth)
        {
            ParentInvoiceNumber = parentInvoiceNumber;
            PartnerInvoiceNumber = partnerInvoiceNumber;
            InvoiceType = invoiceType;
            Berth = berth;
        }
    }


}