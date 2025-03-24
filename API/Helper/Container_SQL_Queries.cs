
namespace API.Helper
{
    public static class Container_SQL_Queries
    {
        public static string ContainerMasterDataQuery()
        {
            return "Select D.* from ContainerLifetime_Masterdata as D right JOIN (SELECT MAX(A.UnitGkey) AS LastVistUnitGkey, a.id FROM dbo.ContainerLifetime_Masterdata As A WHERE category IN ('IMPRT') AND id=@unitNumber GROUP BY A.id) as M ON m.LastVistUnitGkey=d.UnitGkey";

        }
        public static string ExportContainerMasterDataQuery()
        {
            return "Select D.* from ContainerLifetime_Masterdata as D right JOIN (SELECT MAX(A.UnitGkey) AS LastVistUnitGkey, a.id FROM dbo.ContainerLifetime_Masterdata As A WHERE category IN ('EXPRT','STRGE') AND id=@unitNumber GROUP BY A.id) as M ON m.LastVistUnitGkey=d.UnitGkey";

        }
        //--AND (bil_invoices.finalized_date > getdate() - 120) Add this in production to get only 4 months worth of invoices.
        public static string GetAllFinalizedInvoicesQuery()
        {
            return "SELECT bil_invoices.gkey AS InvoiceGkey , bil_invoices.draft_nbr AS Draft, bil_invoices.final_nbr AS Final, bil_invoices.finalized_date AS FinalizedDate, bil_customer.id AS Customer, bil_currencies.id AS Currency FROM bil_invoice_type INNER JOIN bil_invoices  ON bil_invoice_type.gkey = bil_invoices.invtype_gkey INNER JOIN bil_customer ON bil_invoices.payee_customer_gkey = bil_customer.gkey INNER JOIN bil_currencies ON bil_invoices.currency_gkey = bil_currencies.gkey WHERE (bil_invoice_type.life_cycle_state = 'ACT') AND (LEFT (bil_invoice_type.id, 3) = @invoiceType) AND CONVERT(DATE, bil_invoices.finalized_date)  = @finalizedDate AND (bil_invoices.status = 'FINAL')";
        }
        public static string GetCustomerSapCodeQuery()
        {
            return "SELECT sap_code AS CustomerSapCode FROM consignee_SAPdetails WHERE consignee_id = @customerName";
        }
        public static string GetContainerSizeQuery()
        {
            return "SELECT nominal_length  AS ContainerSize FROM ref_equipment r,ref_equip_type t WHERE (r.eqtyp_gkey=t.gkey) and id_full =@containerId";
        }
        public static string GetCTypeFinalizedInvoiceItemDetails()
        {
            return "SELECT DISTINCT billingnavis.dbo.bil_invoices.final_nbr AS InvoiceFinalNumber, billingnavis.dbo.bil_invoice_items.event_id  AS ContainerId, billingnavis.dbo.bil_invoices.draft_nbr AS InvoiceDraftNumber, billingnavis.dbo.bil_invoice_items.event_type_id AS ChargeableUnitEvent, ROUND(billingnavis.dbo.bil_invoice_items.amount, 2) AS Total, billingnavis.dbo.bil_invoice_items.quantity AS Quantity, billingnavis.dbo.bil_invoice_items.quantity_billed AS QuantityBilled,  billingnavis.dbo.bil_invoice_items.description AS Description,   billingnavis.dbo.bil_invoices.finalized_date AS InvoiceFinalizedDate, billingnavis.dbo.bil_invoices.created AS InvoiceCreatedDate, billingnavis.dbo.bil_invoice_items.gl_code AS GlCode, billingnavis.dbo.bil_customer.name AS CustomerName FROM billingnavis.dbo.bil_invoice_items INNER JOIN billingnavis.dbo.bil_invoices ON billingnavis.dbo.bil_invoice_items.invoice_gkey = billingnavis.dbo.bil_invoices.gkey INNER JOIN billingnavis.dbo.bil_customer ON billingnavis.dbo.bil_invoices.payee_customer_gkey = billingnavis.dbo.bil_customer.gkey WHERE billingnavis.dbo.bil_invoices.gkey = @invoiceGkey";
        }
        public static string GetAllCInvoiceTypes()
        {
            return "SELECT LEFT (id, 3) AS TypeGroup FROM bil_invoice_type WHERE (life_cycle_state = 'ACT') AND (LEFT (id, 1) like 'C%') GROUP BY LEFT (id, 3)";
        }
        public static string GetInvoiceGkeyFromParmValues()
        {
            return "SELECT value AS Value FROM bil_invoice_parm_values WHERE uivalue = 'UnitFacilityVisitGkey' AND invoice_gkey = @invoiceGkey";
        }
        public static string GetInoviceBerth()
        {
            return "SELECT flex_string07 AS Berth FROM inv_unit_fcy_visit WHERE gkey =@unitFacilityVisitGkey";
        }
    }
}