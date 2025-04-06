
namespace API.Helper
{
    public static class Container_SQL_Queries
    {
        public static string ContainerMasterDataQuery()
        {
            return "Select D.* from ContainerLifetime_Masterdata as D right JOIN (SELECT MAX(A.UnitGkey) AS LastVistUnitGkey, a.id FROM dbo.ContainerLifetime_Masterdata As A WHERE category IN ('IMPRT') AND id=@unitNumber GROUP BY A.id) as M ON m.LastVistUnitGkey=d.UnitGkey";
        }
        public static string ExportContainerMasterDataQuery()
        {
            return "Select D.* from ContainerLifetime_Masterdata as D right JOIN (SELECT MAX(A.UnitGkey) AS LastVistUnitGkey, a.id FROM dbo.ContainerLifetime_Masterdata As A WHERE category IN ('EXPRT','STRGE') AND id=@unitNumber GROUP BY A.id) as M ON m.LastVistUnitGkey=d.UnitGkey";
        }
        //--AND (bil_invoices.finalized_date > getdate() - 120) Add this in production to get only 4 months worth of invoices.
        
        public static string GetContainerSizeQuery()
        {
            return "SELECT nominal_length  AS ContainerSize FROM ref_equipment r,ref_equip_type t WHERE (r.eqtyp_gkey=t.gkey) and id_full =@containerId";
        }
        public static string GetContainerCurrentStatusQuery()
        {
            return "SELECT TOP (1) * FROM Navis_InternalContainerTracking WHERE UnitNbr=@containerNumber ORDER BY gID DESC";
        }
        
    }
}