
namespace API.Dtos.Container
{
    public class ContainerGeneralProps
    {
        
        public string UnitId { get; set; } = string.Empty;
        public string  Category { get; set; }

        public string Status { get; set; } = string.Empty;
        
        public ContainerGeneralProps(string unitId, string  category, string status)
        {
            UnitId = unitId; Category = category; Status = status;
        }
    }
}