
namespace API.Helper
{
    public static class InvoiceMetaDataQueries
    {



        public static string BillingInvoiceMetaData()
        {
            {
                return @"
                        SELECT 
                            i.final_nbr AS InvoiceFinalNumber,
                            i.finalized_date AS InvoiceFinalizedDate,
                            i.notes AS InvoiceNotes,
                            c.name AS CustomerName,
                            curr.id AS InvoiceCurrency,
                            ISNULL(SUM(ii.amount), 0) AS TotalAmount,
                            invu.flex_string07 AS Berth

                        FROM billingnavis.dbo.bil_invoices i
                        JOIN #TempInvoices t ON i.final_nbr = t.final_nbr
                        JOIN billingnavis.dbo.bil_customer c ON c.gkey = i.payee_customer_gkey
                        LEFT JOIN billingnavis.dbo.bil_currencies curr ON curr.gkey = i.currency_gkey
                        LEFT JOIN billingnavis.dbo.bil_invoice_items ii ON ii.invoice_gkey = i.gkey
                        LEFT JOIN billingnavis.dbo.bil_invoice_parm_values p 
                            ON p.invoice_gkey = i.gkey AND p.uivalue = 'UnitFacilityVisitGkey'
                        LEFT JOIN sparcsn4.dbo.inv_unit_fcy_visit invu 
                            ON invu.gkey = TRY_CAST(p.value AS BIGINT)

                        GROUP BY 
                            i.final_nbr,
                            i.finalized_date,
                            i.notes,
                            curr.id,
                            c.name,
                            p.value,
                            invu.flex_string07;";
            }
        }


        public static string GetBillingInvoiceMetaDataFromNavisIntegrationInvoiceItemView()
        {
            return @"
                    SELECT 
                        final_nbr AS InvoiceFinalNumber,
                        finalized_date AS InvoiceFinalizedDate,
                        notes AS InvoiceNotes,
                        name AS CustomerName,
                        payee_customer_gkey AS CustomerGkey,
                        'USD' AS InvoiceCurrency,
                        SUM(Total) AS TotalAmount,
                        @berth AS Berth
                    FROM BGT_Portal_N4.dbo.NavisIntegration_InvoiceItem
                    WHERE final_nbr = @invoiceFinalNumber
                    GROUP BY 
                        final_nbr,
                        finalized_date,
                        notes,
                        name,payee_customer_gkey;";

        }


        public static string GetBillingInvoiceMetaDataFromNavisIntegrationInvoiceItemViewSL4()
        {
            return @"
                    SELECT 
                        final_nbr AS InvoiceFinalNumber,
                        finalized_date AS InvoiceFinalizedDate,
                        notes AS InvoiceNotes,
                        payee_customer_gkey AS CustomerGkey,
                        'USD' AS InvoiceCurrency,
                        SUM(Total) AS TotalAmount,
                        @berth AS Berth
                    FROM BGT_Portal_N4.dbo.NavisIntegration_InvoiceItem
                    WHERE final_nbr = @invoiceFinalNumber
                    GROUP BY 
                        final_nbr,
                        finalized_date,
                        notes,
                        payee_customer_gkey;";

        }






    }
}