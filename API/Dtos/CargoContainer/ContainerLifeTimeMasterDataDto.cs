using System.ComponentModel.DataAnnotations;

namespace API.Dtos.CargoContainer
{
  public record ContainerLifeTimeMasterDataDto
 (

      string ContainerId,
        long UnitGkey,
      string VisitStateUfv,
      string VisitStateUnit,
      string? TransitState,
      string Category,
      string FreightKind,
      string? LastPositionLocType,
      string? LastPositionLocId,
      string? LineName,
      string? ArrivePositionLocId,
      string? Berth


 );
}