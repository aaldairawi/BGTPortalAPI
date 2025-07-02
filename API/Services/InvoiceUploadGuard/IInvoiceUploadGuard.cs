

namespace API.Services.InvoiceUploadGuard;

public interface IInvoiceUploadGuard
{
    Task<bool> HasAlreadyBeenUploadedAsync(string invoiceFinalNumber);
    Task<bool> AnyAlreadyUploadedAsync(IEnumerable<string> invoiceFinalNumbers);
}
