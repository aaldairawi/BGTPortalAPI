
using API.Enums;

namespace API.Dtos.Stripping.Containers;

public class StrippedContainerDto
{
    public required int  Id { get; set; }
    public required string ContainerNumber { get; set; }
    public required string LineOperator { get; set; }
    public required string ISO { get; set; }
    public required string Size { get; set; }
    public required DateTime DateStripped { get; set; }
    public required LaborType LaborType { get; set; }
    public required string DriverName { get; set; }
    public required string Berth { get; set; }
    public required bool Final { get; set; }

}

