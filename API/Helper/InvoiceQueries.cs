
namespace API.Helper
{
    public static class InvoiceQueries
    {

        public static string GetAllFinalizedInvoicesQuery()
        {
            return "SELECT bil_invoices.gkey AS InvoiceGkey , bil_invoices.draft_nbr AS Draft, bil_invoices.final_nbr AS Final, bil_invoices.finalized_date AS FinalizedDate, bil_customer.id AS Customer, bil_currencies.id AS Currency FROM bil_invoice_type INNER JOIN bil_invoices  ON bil_invoice_type.gkey = bil_invoices.invtype_gkey INNER JOIN bil_customer ON bil_invoices.payee_customer_gkey = bil_customer.gkey INNER JOIN bil_currencies ON bil_invoices.currency_gkey = bil_currencies.gkey WHERE (bil_invoice_type.life_cycle_state = 'ACT') AND (LEFT (bil_invoice_type.id, 3) = @invoiceId) AND CONVERT(DATE, bil_invoices.finalized_date)  = @finalizedDate AND (bil_invoices.status = 'FINAL')";
        }
        public static string GetCustomerSapCodeQuery()
        {
            return "SELECT sap_code AS CustomerSapCode FROM consignee_SAPdetails WHERE consignee_id = @customerName";
        }

        public static string GetCTypeFinalizedInvoiceItemDetails()
        {
            return "SELECT DISTINCT billingnavis.dbo.bil_invoices.final_nbr AS InvoiceFinalNumber, billingnavis.dbo.bil_invoice_items.event_id  AS ContainerId, billingnavis.dbo.bil_invoices.draft_nbr AS InvoiceDraftNumber, billingnavis.dbo.bil_invoice_items.event_type_id AS ChargeableUnitEvent, ROUND(billingnavis.dbo.bil_invoice_items.amount, 2) AS Total, billingnavis.dbo.bil_invoice_items.quantity AS Quantity, billingnavis.dbo.bil_invoice_items.quantity_billed AS QuantityBilled,  billingnavis.dbo.bil_invoice_items.description AS Description,   billingnavis.dbo.bil_invoices.finalized_date AS InvoiceFinalizedDate, billingnavis.dbo.bil_invoices.created AS InvoiceCreatedDate, billingnavis.dbo.bil_invoice_items.gl_code AS GlCode, billingnavis.dbo.bil_customer.name AS CustomerName FROM billingnavis.dbo.bil_invoice_items INNER JOIN billingnavis.dbo.bil_invoices ON billingnavis.dbo.bil_invoice_items.invoice_gkey = billingnavis.dbo.bil_invoices.gkey INNER JOIN billingnavis.dbo.bil_customer ON billingnavis.dbo.bil_invoices.payee_customer_gkey = billingnavis.dbo.bil_customer.gkey WHERE billingnavis.dbo.bil_invoices.gkey = @invoiceGkey";
        }
        public static string GetInvoiceTypeById()
        {
            return "SELECT LEFT (id, 3) AS TypeGroup FROM bil_invoice_type WHERE (life_cycle_state = 'ACT') AND (LEFT (id, 1) like @invoiceId) GROUP BY LEFT (id, 3)";
        }
        public static string GetInvoiceGkeyFromParmValues()
        {
            return "SELECT value AS Value FROM bil_invoice_parm_values WHERE uivalue = 'UnitFacilityVisitGkey' AND invoice_gkey = @invoiceGkey";
        }
        public static string RetrieveBerthAssignedToInvoice()
        {
            return "SELECT flex_string07 AS Berth FROM inv_unit_fcy_visit WHERE gkey =@unitFacilityVisitGkey";
        }
        
    }
}