
namespace API.Helper
{
    public static class InvoiceHelperQueries
    {
        public static string GetCustomerSapCodeQuery()
        {
            return @"
                SELECT consignee_name AS CustomerName, sap_code AS CustomerSapCode
                FROM consignee_SAPdetails
                WHERE LTRIM(RTRIM(consignee_name)) IN ({0});";

        }

        public static string GetInvoiceFinalizedDate()
        {
            return @"SELECT finalized_date As FinalizedDate FROM billingnavis.dbo.bil_invoices WHERE final_nbr = @invoiceFinalNbr;";
        }


        public static string GetInvoiceCurrencyAndNotes()
        {
            return @"SELECT c.id AS Currency, i.notes AS InvoiceNotes
             FROM bil_currencies c 
             INNER JOIN bil_invoices i ON c.gkey = i.currency_gkey 
             WHERE i.final_nbr = @invoiceFinalNumber;";
        }


        public static string GetInvoiceTotalAmount()
        {
            return @"SELECT  i.final_nbr AS InvoiceFinalNumber, SUM(ii.amount) AS TotalAmount
            FROM  billingnavis.dbo.bil_invoices i
            INNER JOIN  billingnavis.dbo.bil_invoice_items ii ON i.gkey = ii.invoice_gkey
            WHERE  i.final_nbr = @invoiceFinalNumber
            GROUP BY  i.final_nbr;";
        }
        public static string GetInvoiceTypeByInvoiceFinalNumber()
        {
            return @" SELECT LEFT(bil_invoice_type.id , 3) AS InvoiceType
                FROM bil_invoice_type
                INNER JOIN bil_invoices ON bil_invoices.invtype_gkey = bil_invoice_type.gkey
                WHERE bil_invoices.final_nbr  = @invoiceFinalNumber";
        }
        public static string RetrieveBerthAssignedToInvoice()
        {
            return "SELECT flex_string07 AS Berth FROM inv_unit_fcy_visit WHERE gkey =@unitFacilityVisitGkey";
        }
        public static string GetCustomerNameBasedOnInvoiceFinalNumber()
        {
            return @"SELECT c.name AS CustomerName FROM billingnavis.dbo.bil_invoices i
            INNER JOIN billingnavis.dbo.bil_customer c ON i.payee_customer_gkey = c.gkey WHERE i.final_nbr = @invoiceFinalNumber;";
        }


        public static string GetInvoiceGkeyFromBillingInvoices()
        {
            return @"SELECT gkey AS InvoiceGkey FROM bil_invoices WHERE final_nbr = @invoiceFinalNumber;";
        }

        public static string GetUnitFacilityGkeyFromParmValues()
        {
            return "SELECT value AS Value FROM bil_invoice_parm_values WHERE uivalue = 'UnitFacilityVisitGkey' AND invoice_gkey = @invoiceGkey";
        }

        public static string GetProfitCenterForBerth()
        {
            return @"
                SELECT 
            ";
        }


    }
}