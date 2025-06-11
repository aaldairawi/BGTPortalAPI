
namespace API.Helper
{
    public static class GetInvoiceQueries
    {



        public static string GetFinalizedInvoicesByQueryParams()
        {
            return @"
        SELECT 
            bil_invoices.gkey AS InvoiceGkey,
            bil_invoices.final_nbr AS Final,
            bil_invoices.status AS Status,
            bil_invoices.finalized_date AS FinalizedDate,
            bil_invoices.creator AS Creator,
            bil_invoices.changer AS Changer,
            bil_invoices.paid_in_full AS Paid,
            bil_invoices.notes AS Notes,
            bil_customer.id AS Customer,
            bil_currencies.id AS Currency,
            bil_invoice_type.id AS InvoiceType,
            SUM(bil_invoice_items.amount) AS Total
        FROM bil_invoice_type
        INNER JOIN bil_invoices 
            ON bil_invoice_type.gkey = bil_invoices.invtype_gkey
        INNER JOIN bil_customer 
            ON bil_invoices.payee_customer_gkey = bil_customer.gkey
        INNER JOIN bil_currencies 
            ON bil_invoices.currency_gkey = bil_currencies.gkey
        INNER JOIN bil_invoice_items 
            ON bil_invoices.gkey = bil_invoice_items.invoice_gkey
        
        WHERE 
            bil_invoice_type.life_cycle_state = 'ACT'
            AND bil_invoice_type.id LIKE @invoiceId + '%'
            AND bil_invoices.finalized_date >= @finalizedDate
            AND bil_invoices.finalized_date < DATEADD(DAY, 1, @finalizedDate)
            AND bil_invoices.finalized_date >= DATEADD(MONTH, -4, GETDATE())
            AND bil_invoices.status = 'FINAL'
        GROUP BY 
            bil_invoices.gkey,
            bil_invoices.final_nbr,
            bil_invoices.status,
            bil_invoices.finalized_date,
            bil_invoices.creator,
            bil_invoices.changer,
            bil_invoices.paid_in_full,
            bil_invoices.notes,
            bil_customer.id,
            bil_currencies.id,
            bil_invoice_type.id";
        }
        public static string GetOneFinalizedInvoiceById()
        {
            return @"
        SELECT 
            bil_invoices.gkey AS InvoiceGkey,
            bil_invoices.final_nbr AS Final,
            bil_invoices.status AS Status,
            bil_invoices.finalized_date AS FinalizedDate,
            bil_invoices.creator AS Creator,
            bil_invoices.changer AS Changer,
            bil_invoices.paid_in_full AS Paid,
            bil_invoices.notes AS Notes,
            bil_customer.id AS Customer,
            bil_currencies.id AS Currency,
            bil_invoice_type.id AS InvoiceType,
            SUM(bil_invoice_items.amount) AS Total
        FROM bil_invoice_type
        INNER JOIN bil_invoices 
            ON bil_invoice_type.gkey = bil_invoices.invtype_gkey
        INNER JOIN bil_customer 
            ON bil_invoices.payee_customer_gkey = bil_customer.gkey
        INNER JOIN bil_currencies 
            ON bil_invoices.currency_gkey = bil_currencies.gkey
        INNER JOIN bil_invoice_items 
            ON bil_invoices.gkey = bil_invoice_items.invoice_gkey
        
        WHERE bil_invoices.final_nbr = @invoiceFinalId
        GROUP BY 
            bil_invoices.gkey,
            bil_invoices.final_nbr,
            bil_invoices.status,
            bil_invoices.finalized_date,
            bil_invoices.creator,
            bil_invoices.changer,
            bil_invoices.paid_in_full,
            bil_invoices.notes,
            bil_customer.id,
            bil_currencies.id,
            bil_invoice_type.id";
        }


        public static string GetInvoiceItems()
        {
            return @"SELECT DISTINCT 
                    ii.description AS Description,
                    ii.quantity AS Quantity,
                    ii.quantity_billed AS QuantityBilled,
                    ii.rate_billed AS Rate,
                    ROUND(ii.amount, 2) AS Total,
                    ii.gl_code AS GlCode,
                    i.final_nbr AS InvoiceFinalNumber,
                    c.name AS CustomerName,
                    i.created AS InvoiceCreatedDate,
                    i.finalized_date AS InvoiceFinalizedDate,
                    ii.gkey AS InvoiceItemGkey,
                    ii.event_id AS ContainerId,
                    ii.event_type_id AS ChargeableUnitEvent
                FROM billingnavis.dbo.bil_invoice_items ii
                INNER JOIN billingnavis.dbo.bil_invoices i
                    ON ii.invoice_gkey = i.gkey 
                INNER JOIN billingnavis.dbo.bil_customer c
                    ON i.payee_customer_gkey = c.gkey
                WHERE ii.invoice_gkey = @invoiceGkey;
                ";
        }


        public static string LoadAllCtypeInvoices()
        {
            return @"SELECT LEFT(id, 3) AS InvoiceTypes  FROM bil_invoice_type
                    WHERE (life_cycle_state = 'ACT') AND (LEFT(id, 1)) = 'C'
                    GROUP BY LEFT(id, 3)";
        }
        public static string LoadAllStypeInvoices()
        {
            return @"SELECT LEFT(id, 3) AS InvoiceTypes FROM bil_invoice_type
            WHERE (life_cycle_state = 'ACT') AND (LEFT(id, 2)) = 'SL' 
            GROUP BY LEFT(id, 3);";
        }


    }

}