namespace API.Dtos.CargoContainer
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