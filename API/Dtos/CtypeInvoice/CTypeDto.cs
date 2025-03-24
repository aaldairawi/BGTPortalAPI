namespace API.Dtos.CtypeInvoice
{
    public class CTypeDto
    {
        public string TypeGroup { get; set; } = string.Empty;
        public CTypeDto(string invoiceType)
        {
            TypeGroup = invoiceType;
        }
    }
}