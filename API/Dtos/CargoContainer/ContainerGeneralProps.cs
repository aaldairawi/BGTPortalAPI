using System.ComponentModel.DataAnnotations;
using API.Enums;

namespace API.Dtos.CargoContainer
{
    public class ContainerGeneralProps
    {
        [StringLength(maximumLength: 11, ErrorMessage = "UnitId must be 11 characters long.")]
        public string UnitId { get; set; } = string.Empty;

        public Category Category { get; set; }

        public string Status { get; set; } = string.Empty;
        
        public ContainerGeneralProps(string unitId, Category category, string status)
        {
            UnitId = unitId; Category = category; Status = status;
        }
    }
}