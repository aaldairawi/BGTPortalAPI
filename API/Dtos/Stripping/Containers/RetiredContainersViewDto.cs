
namespace API.Dtos.Stripping.Containers;

public class RetiredContainersViewDto
{
    public required string ContainerNumber { get; init; }
    public required string LineOperator { get; init; }
    public required string ISO { get; init; }
    public required string Size { get; init; }
    public required DateTime DateStripped { get; init; }
    public required string Berth { get; init; }



}



