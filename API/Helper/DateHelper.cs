namespace API.Helper
{
    public static class DateHelper
    {
        public static string NullableDateToString(Nullable<DateTime> dateTime) => Convert.ToDateTime(dateTime.ToString()).ToString("M/d/yyyy HH:mm");
        public static string NullableDateToDate(Nullable<DateTime> dateTime) => Convert.ToDateTime(dateTime).ToString("yyyy-MM-dd");
        public static bool IsStringConvertableToDateTime(string input) => DateTime.TryParse(input, out _);
        public static string FormatSafeDate(object? rawValue)
        {
            if (DateTime.TryParse(rawValue?.ToString(), out var parsed) && parsed != default)
            {
                return parsed.ToString("yyyy-MM-dd");
            }

            return string.Empty;
        }

    }
}