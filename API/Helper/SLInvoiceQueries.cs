
namespace API.Helper
{
    public static class SLInvoiceQueries
    {
        // Get the invoice items from dbo.NavisIntegration_InvoiceItem.
        public static string GetInvoiceItems()
        {
            return @"
        SELECT 
            description AS Description,
            TariffsID AS TariffId,
            event_type_id AS EventTypeId,
            Qnty AS Quantity,
            Rate AS Rate,
            rate_billed AS RateBilled,
            Total AS ItemTotalAmount,
            final_nbr AS InvoiceFinalNumber,
            notes AS Notes,
            name AS Name,
            finalized_date AS FinalizedDate
        FROM dbo.NavisIntegration_InvoiceItem
        WHERE gkey = @invoiceGkey";
        }


    }
}