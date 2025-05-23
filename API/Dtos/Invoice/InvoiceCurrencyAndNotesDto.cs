
namespace API.Dtos.Invoice
{
    public class InvoiceCurrencyAndNotesDto
    {
        public string InvoiceCurrency {get; init;}
        public string InvoiceNotes {get; init;}

        public InvoiceCurrencyAndNotesDto(string currency, string notes)
        {
            InvoiceCurrency = currency; InvoiceNotes = notes;
            
        }


    }
}