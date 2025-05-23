namespace API.Dtos.Container
{
    public record ContainerCurrentStatusDto
    (
        string ContainerId,
        string UnitTState,
        string UnitCategory,
        string UnitVisitState,
        string UnitFreightKind,
        string UnitLineOperator,
        string UnitNameOps,
        string UnitBerth
    );
}