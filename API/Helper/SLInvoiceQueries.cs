
namespace API.Helper
{
    public static class SLInvoiceQueries
    {

        public static string GetSLParentAndChildInvoiceItems()
        {
            return @"
                    -- Step 1: Set parent invoice GKEY
                    DECLARE @parentGkey INT = @invoiceGkey;

                    -- Step 2: Get identifying fields from the SL2 invoice (parent)
                    DECLARE @notes VARCHAR(255);
                    DECLARE @finalized_date DATETIME;

                    SELECT 
                        @notes = notes,
                        @finalized_date = finalized_date
                    FROM billingnavis.dbo.bil_invoices
                    WHERE gkey = @parentGkey;

                    -- Step 3: Find SL4 invoice with same notes + date, using LIKE on invoice type
                    DECLARE @partnerGkey INT;

                    SELECT TOP 1 
                        bi.gkey
                    INTO #PartnerTemp
                    FROM billingnavis.dbo.bil_invoices bi
                    JOIN billingnavis.dbo.bil_invoice_type bit ON bi.invtype_gkey = bit.gkey
                    WHERE 
                        bi.notes = @notes AND
                        CAST(bi.finalized_date AS DATE) = CAST(@finalized_date AS DATE) AND
                        bit.id LIKE 'SL4_%' AND
                        bi.gkey <> @parentGkey;

                    SELECT @partnerGkey = gkey FROM #PartnerTemp;
                    DROP TABLE #PartnerTemp;

                    -- Step 4: Return invoice items from both parent and partner
                    SELECT 
                        'Parent' AS SourceType,
                        description,
                        Qnty AS Quantity,
                        Rate,
                        Total AS ItemTotalAmount,
                        final_nbr AS InvoiceFinalNumber,
                        notes,
                        name,
                        finalized_date AS FinalizedDate,
                        gl_code,
                        rate_billed AS RateBilled,
                        TariffsID AS TariffId,
                        gkey,
                        event_type_id AS EventTypeId,
                        currency_gkey
                    FROM BGT_Portal_N4.dbo.NavisIntegration_InvoiceItem
                    WHERE gkey = @parentGkey

                    UNION ALL

                    SELECT 
                        'Partner' AS SourceType,
                        description,
                        Qnty,
                        Rate,
                        Total,
                        final_nbr,
                        notes,
                        name,
                        finalized_date,
                        gl_code,
                        rate_billed,
                        TariffsID,
                        gkey,
                        event_type_id,
                        currency_gkey
                    FROM BGT_Portal_N4.dbo.NavisIntegration_InvoiceItem
                    WHERE gkey = @partnerGkey;";
        }
        public static string GetSLInvoiceItemsByFinalNumber()
        {
            return @"
                SELECT 
                    final_nbr AS InvoiceFinalNumber,
                    gl_code AS GlCode,
                    TariffsID AS TariffId,
                    Qnty AS Quantity,
                    Total AS ItemTotalAmount
                FROM BGT_Portal_N4.dbo.NavisIntegration_InvoiceItem
                WHERE final_nbr = @invoiceFinalNumber;";

        }


        public static string GetSL4FirstCsvLineItem()
        {
            return @"
                    SELECT 
                        notes AS Notes,
                        SUM(total) / 1320.0 AS TotalInvoiceLineAmount
                    FROM NavisIntegration_InvoiceItem
                    WHERE  final_nbr = @parentInvoiceNumber
                    GROUP BY final_nbr, notes;";
        }


        public static string GetSL4SecondCsvLineItem()
        {
            return @"
                    SELECT 
                        final_nbr AS FinalNumber,
                        notes AS Notes,
                        SUM(total) AS TotalInvoiceLineAmount
                    FROM NavisIntegration_InvoiceItem
                    WHERE final_nbr = @partnerInvoiceNumber
                    AND final_nbr LIKE 'THC%'
                    GROUP BY final_nbr, notes;";
        }

        public static string GetShippingLineInvoicesByFinalizedDate()
        {
            return @"
        SELECT 
            i.gkey AS InvoiceGkey,
            i.final_nbr AS Final,
            i.status AS Status,
            i.finalized_date AS FinalizedDate,
            i.creator AS Creator,
            i.changer AS Changer,
            i.paid_in_full AS Paid,
            i.notes AS Notes,
            c.id AS Customer,
            cur.id AS Currency,
            t.id AS InvoiceType,
            SUM(ii.amount) AS Total
        FROM bil_invoice_type t
        INNER JOIN bil_invoices i ON t.gkey = i.invtype_gkey
        INNER JOIN bil_customer c ON i.payee_customer_gkey = c.gkey
        INNER JOIN bil_currencies cur ON i.currency_gkey = cur.gkey
        INNER JOIN bil_invoice_items ii ON i.gkey = ii.invoice_gkey
        WHERE 
            t.life_cycle_state = 'ACT'
            AND (t.id LIKE 'SL2%')
            AND i.status = 'FINAL'
            AND CAST(i.finalized_date AS DATE) = @finalizedDate
        GROUP BY 
            i.gkey,
            i.final_nbr,
            i.status,
            i.finalized_date,
            i.creator,
            i.changer,
            i.paid_in_full,
            i.notes,
            c.id,
            cur.id,
            t.id;";
        }

    }

}