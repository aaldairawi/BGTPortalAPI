namespace API.Dtos.Stripping.Dashboard;

public class StrippingDashboardDto
{
    public string Berth { get; set; } = string.Empty;
    public string LaborType { get; set; } = string.Empty;
    public int Shift20 { get; set; }
    public int Shift40 { get; set; }
    public int Shift45 { get; set; }
    public int Total => Shift20 + Shift40 + Shift45;
}
