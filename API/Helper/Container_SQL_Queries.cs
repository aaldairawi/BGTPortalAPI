
namespace API.Helper
{
    public static class Container_SQL_Queries
    {
       public static string ImportContainerMasterDataQuery()
{
    return @"
        SELECT 
            D.UnitGkey AS UnitGkey,
            D.visit_state_ufv AS VisitStateUfv,
            D.visit_state_unit AS VisitStateUnit,
            D.transit_state AS TransitState,
            D.category AS Category,
            D.freight_kind AS FreightKind,
            D.last_pos_loctype AS LastPositionLocType,
            D.last_pos_locid AS LastPositionLocId,
            D.LineName AS LineName,
            D.arrive_pos_locid AS ArrivePositionLocId,
            D.Berth AS Berth

        FROM ContainerLifetime_Masterdata AS D
        RIGHT JOIN (
            SELECT 
                MAX(A.UnitGkey) AS LastVistUnitGkey, 
                A.Id 
            FROM dbo.ContainerLifetime_Masterdata AS A
            WHERE category IN ('IMPRT') AND id = @unitNumber
            GROUP BY A.Id
        ) AS M ON M.LastVistUnitGkey = D.UnitGkey";
}

public static string ExportContainerMasterDataQuery()
{
    return @"
        SELECT 
            D.UnitGkey AS UnitGkey,
            D.visit_state_ufv AS VisitStateUfv,
            D.visit_state_unit AS VisitStateUnit,
            D.transit_state AS TransitState,
            D.category AS Category,
            D.freight_kind AS FreightKind,
            D.last_pos_loctype AS LastPositionLocType,
            D.last_pos_locid AS LastPositionLocId,
            D.LineName AS LineName,
            D.arrive_pos_locid AS ArrivePositionLocId,
            D.Berth AS Berth
        FROM ContainerLifetime_Masterdata AS D
        RIGHT JOIN (
            SELECT 
                MAX(A.UnitGkey) AS LastVistUnitGkey, 
                A.Id 
            FROM dbo.ContainerLifetime_Masterdata AS A
            WHERE category IN ('EXPRT', 'STRGE') AND id = @unitNumber
            GROUP BY A.Id
        ) AS M ON M.LastVistUnitGkey = D.UnitGkey";
}



        public static string GetContainerSizeQuery()
        {
            return "SELECT nominal_length  AS ContainerSize FROM ref_equipment r,ref_equip_type t WHERE (r.eqtyp_gkey=t.gkey) and id_full =@containerId";
        }
        public static string GetContainerCurrentStatusQuery()
        {
            return @"SELECT TOP (1) 
            UnitNbr AS UnitNbr, TState AS TState, 
            category AS Category, visit_state AS VisitState,
            freight_kind AS FreightKind,
            [Line Operator] AS LineOperator,
            [Operator Name] AS OperatorName,
            berth AS Berth 
            FROM Navis_InternalContainerTracking WHERE UnitNbr=@containerNumber ORDER BY gID DESC";
        }

        public static string GetVesselATA()
        {
            return @"SELECT ata AS ActualTimeOfArrival FROM dbo.argo_carrier_visit WHERE id = @vesselId";
        }

        public static string GetVesselATC()
        {
            return @"
        SELECT vsl_vessel_visit_details.end_work AS EndWork
        FROM argo_carrier_visit
        INNER JOIN vsl_vessel_visit_details
            ON argo_carrier_visit.cvcvd_gkey = vsl_vessel_visit_details.vvd_gkey
        WHERE argo_carrier_visit.id = @vesselId";
        }
        public static string GetUnitReceivedBackDateByEventNameDateAndContainerId()
        {
            return @"
                    SELECT CtrLifeTime_New.placed_time AS PlacedTime
                    FROM CtrLifeTime_New
                    WHERE 
                        DAY(DeleveryDate) = @dayOfDate AND 
                        MONTH(DeleveryDate) = @monthOfDate AND 
                        YEAR(DeleveryDate) = @yearOfDate AND 
                        id = @containerId AND 
                        EventName = @eventName";

        }
        public static string GetVesselName()
        {
            return @"
                    SELECT name AS Name 
                    FROM BGT_VesselVisitDetails 
                    WHERE VisitId = @visitId";
        }

        public static string GetEventDateByUnitGkeyAndEventId()
        {
            return @"
            SELECT Eventtime AS EventTime 
            FROM BGT_ServerEvent 
            WHERE UnitGKey = @unitGkey AND EventID = @eventId";

        }

        public static string GetEventReceivedDateByUnitIdAndEventId()
        {
            return @"
                SELECT MAX(Eventtime) AS EventTime 
                FROM BGT_ServerEvent 
                WHERE UnitID = @unitId AND EventID = @eventId 
                GROUP BY EventID";
        }




    }
}