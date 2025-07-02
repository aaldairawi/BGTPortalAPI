

using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Services.InvoiceUploadGuard;

public class InvoiceUploadGuardRepository(BGTContext context) : IInvoiceUploadGuard
{


    private readonly BGTContext _context = context;

    public async Task<bool> HasAlreadyBeenUploadedAsync(string invoiceFinalNumber)
    {

        return await _context.InvoiceHeaders
            .AnyAsync(i => i.FinalInvoiceNumber == invoiceFinalNumber);
    }

    public async Task<bool> AnyAlreadyUploadedAsync(IEnumerable<string> invoiceFinalNumbers)
    {
        return await _context.InvoiceHeaders
            .AnyAsync(i => invoiceFinalNumbers.Contains(i.FinalInvoiceNumber));
    }
}
