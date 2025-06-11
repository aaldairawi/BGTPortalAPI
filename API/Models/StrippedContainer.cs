
using API.Enums;

namespace API.Models
{
    public class StrippedContainer
    {

        public required string ContainerNumber { get; set; }
        public required string LineOperator { get; set; }
        public required string ISO { get; set; }
        public required string Size { get; set; }
        public required DateTime DateStripped { get; set; }
        public required LaborType LaborType { get; set; }
        public required string DriverName { get; set; }
        public required string Berth { get; set; }
        public required bool StrippedInNavis { get; set; }
        public required bool StrippedInApp { get; set; }
        public required bool Final { get; set; }

        public StrippedContainer(string cnNumber, string lineOperator, string iso, string cnSize, DateTime dateStripped, LaborType laborType,
        string driverName, string berth, bool strippedInNavis, bool strippedInApp, bool final)
        {
            ContainerNumber = cnNumber; LineOperator = lineOperator; ISO = iso; Size = cnSize;
            DateStripped = dateStripped; LaborType = laborType; DriverName = driverName; Berth = berth;
            StrippedInNavis = strippedInNavis; StrippedInApp = strippedInApp;
            Final = final;
        }

    }
}