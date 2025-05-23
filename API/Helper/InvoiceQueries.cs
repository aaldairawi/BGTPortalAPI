
namespace API.Helper
{
    public static class InvoiceQueries
    {

        public static string GetFinalizedInvoicesByQueryParams(string orderByColumn)
        {
            return $@"SELECT bil_invoices.gkey AS InvoiceGkey , bil_invoices.final_nbr AS Final,
             bil_invoices.finalized_date AS FinalizedDate, bil_invoices.creator AS Creator, bil_invoices.paid_in_full AS Paid,   
             bil_customer.id AS Customer, bil_currencies.id AS Currency , SUM(bil_invoice_items.amount) AS Total

                FROM bil_invoice_type INNER JOIN bil_invoices  ON bil_invoice_type.gkey = bil_invoices.invtype_gkey 
                INNER JOIN bil_customer ON bil_invoices.payee_customer_gkey = bil_customer.gkey 
                INNER JOIN bil_currencies ON bil_invoices.currency_gkey = bil_currencies.gkey 
                INNER JOIN bil_invoice_items
                ON bil_invoices.gkey = bil_invoice_items.invoice_gkey

                WHERE (bil_invoice_type.life_cycle_state = 'ACT') AND (LEFT (bil_invoice_type.id, 3) = @invoiceId) 
                AND CONVERT(DATE, bil_invoices.finalized_date)  = @finalizedDate AND (bil_invoices.status = 'FINAL')
                GROUP BY 
                bil_invoices.gkey, bil_invoices.draft_nbr, bil_invoices.final_nbr,
                bil_invoices.finalized_date, bil_invoices.creator, bil_invoices.paid_in_full,
                bil_customer.id, bil_currencies.id
                ORDER BY {orderByColumn};";
        }

        public static string GetOneFinalizedInvoiceById()
        {
            return @"SELECT bil_invoices.gkey AS InvoiceGkey , 
            bil_invoices.final_nbr AS Final,
             bil_invoices.finalized_date AS FinalizedDate, 
             bil_invoices.creator AS Creator, bil_invoices.paid_in_full AS Paid,   
             bil_customer.id AS Customer, bil_currencies.id AS Currency , SUM(bil_invoice_items.amount) AS Total 
                FROM bil_invoice_type INNER JOIN bil_invoices  ON bil_invoice_type.gkey = bil_invoices.invtype_gkey 
                INNER JOIN bil_customer ON bil_invoices.payee_customer_gkey = bil_customer.gkey 
                INNER JOIN bil_currencies ON bil_invoices.currency_gkey = bil_currencies.gkey 
                INNER JOIN bil_invoice_items 
                ON bil_invoices.gkey = bil_invoice_items.invoice_gkey
                WHERE bil_invoices.final_nbr = @invoiceFinalId
                GROUP BY 
                bil_invoices.gkey, bil_invoices.draft_nbr, bil_invoices.final_nbr,
                bil_invoices.finalized_date, bil_invoices.creator, bil_invoices.paid_in_full,
                bil_customer.id, bil_currencies.id";
        }

        public static string GetCustomerSapCodeQuery()
        {
            return @"SELECT sap_code AS CustomerSapCode FROM consignee_SAPdetails WHERE consignee_id = @customerName";
        }

        public static string GetCTypeFinalizedInvoiceItemDetails()
        {
            return @"SELECT DISTINCT billingnavis.dbo.bil_invoices.final_nbr AS InvoiceFinalNumber, 
            billingnavis.dbo.bil_invoice_items.event_id  AS ContainerId, billingnavis.dbo.bil_invoices.draft_nbr 
            AS InvoiceDraftNumber, billingnavis.dbo.bil_invoice_items.event_type_id AS ChargeableUnitEvent, 
            ROUND(billingnavis.dbo.bil_invoice_items.amount, 2) AS Total, billingnavis.dbo.bil_invoice_items.quantity 
            AS Quantity, billingnavis.dbo.bil_invoice_items.quantity_billed AS QuantityBilled,  
            billingnavis.dbo.bil_invoice_items.description AS Description,   billingnavis.dbo.bil_invoices.finalized_date 
            AS InvoiceFinalizedDate, billingnavis.dbo.bil_invoices.created AS InvoiceCreatedDate, 
            billingnavis.dbo.bil_invoice_items.gl_code AS GlCode, billingnavis.dbo.bil_customer.name AS CustomerName 
            FROM billingnavis.dbo.bil_invoice_items INNER JOIN billingnavis.dbo.bil_invoices ON 
            billingnavis.dbo.bil_invoice_items.invoice_gkey = billingnavis.dbo.bil_invoices.gkey INNER JOIN 
            billingnavis.dbo.bil_customer ON billingnavis.dbo.bil_invoices.payee_customer_gkey = billingnavis.dbo.bil_customer.gkey 
            WHERE billingnavis.dbo.bil_invoices.gkey = @invoiceGkey";
        }
        public static string GetInvoiceItems()
        {
            return @"
        SELECT 
            ii.gkey AS InvoiceItemGkey,
            ii.invoice_gkey,
            i.final_nbr AS InvoiceFinalNumber,
            ii.event_id AS ContainerId,
            ii.event_type_id AS ChargeableUnitEvent,
            ii.gl_code AS GLCode,
            ii.description AS Description,
            ii.quantity AS Quantity,
            ii.amount AS Amount,
            ii.quantity_billed AS QuantityBilled,
            i.finalized_date AS FinalizedDate
        FROM billingnavis.dbo.bil_invoice_items ii
        INNER JOIN billingnavis.dbo.bil_invoices i
            ON ii.invoice_gkey = i.gkey
        WHERE ii.invoice_gkey = @invoiceGkey;";
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

        public static string LoadAllInvoiceTypes()
        {
            return @"SELECT LEFT(id, 3) AS InvoiceTypes  FROM bil_invoice_type
                    WHERE (life_cycle_state = 'ACT') AND (LEFT(id, 1)) IN ('C', 'S')
                    GROUP BY LEFT(id, 3)";
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

        public static string RetrieveBerthAssignedToInvoice()
        {
            return "SELECT flex_string07 AS Berth FROM inv_unit_fcy_visit WHERE gkey =@unitFacilityVisitGkey";
        }
        public static string GetInvoiceTypeByInvoiceFinalNumber()
        {
            return @" SELECT LEFT(bil_invoice_type.id , 3) AS InvoiceType
                FROM bil_invoice_type
                INNER JOIN bil_invoices ON bil_invoices.invtype_gkey = bil_invoice_type.gkey
                WHERE bil_invoices.final_nbr  = @invoiceFinalNumber";
        }

        public static string GetRefValueFromBgtReference()
        {
            return @"SELECT ref_value AS RefValue FROM bgt_reference WHERE ref_id = @refId";
        }
        public static string GetInvoiceMetaData()
        {
            return @"
                    SELECT 
                    i.final_nbr AS InvoiceFinalNumber,
                    i.finalized_date AS InvoiceFinalizedDate,
                    i.notes AS InvoiceNotes,
                    c.name AS CustomerName,
                    curr.id AS InvoiceCurrency,
                    ISNULL(sap.sap_code, '') AS CustomerSapCode,
                    ISNULL(SUM(ii.amount), 0) AS TotalAmount,
                    ISNULL(p.value,'') AS UnitFacilityVisitGkey,                
                    CASE 
                        WHEN invu.flex_string07 = 'B20' THEN ISNULL(ref20.ref_value, '5000')
                        WHEN invu.flex_string07 = 'B27' THEN ISNULL(ref27.ref_value, '5000')
                        ELSE '5000'
                    END AS ProfitCenter
                FROM bil_invoices i
                JOIN bil_customer c ON c.gkey = i.payee_customer_gkey
                LEFT JOIN bil_currencies curr ON curr.gkey = i.currency_gkey
                LEFT JOIN bil_invoice_items ii ON ii.invoice_gkey = i.gkey
                LEFT JOIN [PORTAL].BgtPortal.dbo.consignee_SAPdetails sap ON sap.consignee_id = c.name
                LEFT JOIN bil_invoice_parm_values p 
                    ON p.invoice_gkey = i.gkey AND p.uivalue = 'UnitFacilityVisitGkey'
                LEFT JOIN [sparcsn4].[dbo].[inv_unit_fcy_visit] invu ON invu.gkey = p.value
                LEFT JOIN [PORTAL].BgtPortal.dbo.bgt_reference ref20 ON ref20.ref_id = 'profit_cent_20'
                LEFT JOIN [PORTAL].BgtPortal.dbo.bgt_reference ref27 ON ref27.ref_id = 'profit_cent_27'
                --__INVOICE_FILTER__
                GROUP BY 
                    i.final_nbr,
                    i.finalized_date,
                    i.notes,
                    curr.id,
                    c.name,
                    sap.sap_code,
                    p.value,
                    invu.flex_string07,
                    ref20.ref_value,
                    ref27.ref_value;
                ;";
        }
    }

}