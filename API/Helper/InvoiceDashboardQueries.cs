
using Microsoft.Data.SqlClient;

namespace API.Helper
{
    public static class InvoiceDashboardQueries
    {



        public static (string Query, SqlParameter[] Parameters) BuildPendingInvoicesQueryWithInvoiceList(
        DateOnly finalizedDate, List<string> invoiceNumbers)
        {
            var baseQuery = @"
        SELECT
            i.final_nbr AS FinalInvoiceNumber,
            i.finalized_date AS FinalizedDate,
            cur.id AS Currency,
            t.id AS InvoiceType,
            c.id AS Customer,
            SUM(ii.amount) AS InvoiceTotal
        FROM bil_invoice_type t 
        INNER JOIN bil_invoices i ON t.gkey = i.invtype_gkey
        INNER JOIN bil_customer c ON i.payee_customer_gkey = c.gkey
        INNER JOIN bil_currencies cur ON i.currency_gkey = cur.gkey
        INNER JOIN bil_invoice_items ii ON i.gkey = ii.invoice_gkey
        WHERE i.status = 'FINAL' 
            AND i.finalized_date = @finalizedDate
            AND i.final_nbr IN ({0})
        GROUP BY
            i.final_nbr,
            i.finalized_date,
            cur.id,
            t.id,
            c.id;
    ";

            var parameters = new List<SqlParameter>
    {
        new("@finalizedDate", finalizedDate.ToDateTime(TimeOnly.MinValue))
    };

            var invoiceParamNames = new List<string>();
            for (int i = 0; i < invoiceNumbers.Count; i++)
            {
                var paramName = $"@inv{i}";
                invoiceParamNames.Add(paramName);
                parameters.Add(new SqlParameter(paramName, invoiceNumbers[i]));
            }

            var inClause = string.Join(", ", invoiceParamNames);
            var finalQuery = string.Format(baseQuery, inClause);

            return (finalQuery, parameters.ToArray());
        }


        public static string GetAllCAndSlInvoicesCreatedOnFinalizedDate()
        {
            return @"
                SELECT DISTINCT
                    i.final_nbr AS FinalInvoiceNumber
                FROM bil_invoice_type t
                JOIN bil_invoices i ON t.gkey = i.invtype_gkey
                WHERE
                    i.status = 'FINAL'
                    AND (t.id LIKE 'C%' OR t.id LIKE 'SL2%' OR t.id LIKE 'SL4%')
                    AND i.finalized_date >= @finalizedDate
                    AND i.finalized_date < DATEADD(DAY, 1, @finalizedDate)";
        }





    }
}