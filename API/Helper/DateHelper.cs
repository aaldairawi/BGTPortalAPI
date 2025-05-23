namespace API.Helper
{
    public static class DateHelper
    {
        public static string FormatSafeDate(object? rawValue, bool formatAsYearMonthDate)
        {

            if (DateTime.TryParse(rawValue?.ToString(), out var parsed) && parsed != default)
            {
                if (formatAsYearMonthDate)
                {
                    return parsed.ToString("yyyy-MM-dd");
                }
                else
                {
                    return parsed.ToString("MM/dd/yyyy");
                }
            }

            return string.Empty;
        }

        public static DateTime FormatStringToDate(string rawValue)
        {
            if (DateTime.TryParse(rawValue, out var converted))
            {
                return converted;
            }
            return DateTime.MinValue;
        }


    }
}