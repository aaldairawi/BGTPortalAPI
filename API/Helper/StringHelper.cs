
using API.Enums;

namespace API.Helper
{
    public static class StringHelper
    {
        public static Currency CurrencyToString(this string? currencyCode)
        {
            return currencyCode?.ToUpperInvariant() switch
            {
                "USD" => Currency.USD,
                _ => Currency.IQD,
            };

        }
    }
}