using API.Dtos.CargoContainer;

namespace API.Helper
{
    public static class ContainerCategoryChecks
    {
        /// <summary>
        /// Container category is import , the yard and both states are active.
        /// </summary>
        /// <param name="input"></param>
        /// <returns>True otherwise false.</returns>
        public static bool ContainerStatusImportActiveYard(this ContainerLifeTimeMasterDataDto input) => input.VisitStateUfv == Constants.VISIT_STATE_ACTIVE && 
        input.TransitState == Constants.TRANSIT_STATE_IN_YARD && input.Category == Constants.IMPORT_AS_IMPRT && input.LastPositionLocType == Constants.YARD;


        /// <summary>
        /// Category is import and the unit has left on a truck.
        /// </summary>
        /// <param name="input"></param>
        /// <returns>True if the unit is under import and is placed on a truck in the yard.</returns>
        public static bool ContainerStatusImportAndDepartedOnTruck(this ContainerLifeTimeMasterDataDto input) => input.Category == Constants.CATEGORY_IMPORT && 
        input.LastPositionLocType == Constants.TRUCK && input.VisitStateUfv == Constants.VISIT_STATE_UFV_DEPARTED_3DEPARTED && 
        input.TransitState == Constants.TRANSIT_STATE_S70_DEPARTED;

        /// <summary>
        /// Unit under import and has been stripped in yard already.
        /// </summary>
        /// <param name="input"></param>
        /// <returns>True if the unit has been stripped in the yard already false otherwise.</returns>
        public static bool ContainerStatusImportAndStrippedInYard(this ContainerLifeTimeMasterDataDto input) => input.VisitStateUfv == Constants.VISIT_STATE_UFV_4RETIRED 
        && input.TransitState == Constants.TRANSIT_STATE_S99_RETIRED
        && input.Category == Constants.CATEGORY_IMPORT && input.LastPositionLocType == Constants.YARD;
        /// <summary>
        /// Unit is in the yard and is loaded onto a truck.
        /// </summary>
        /// <param name="input"></param>
        /// <returns>True if the unit is in the yard and the category is import false other wise.</returns>
        public static bool ContainerStatusImportActiveAndLoadedOnTruck(this ContainerLifeTimeMasterDataDto input) => input.VisitStateUfv == Constants.VISIT_STATE_ACTIVE
        && input.LastPositionLocType == Constants.TRUCK && input.Category == Constants.IMPORT_AS_IMPRT && input.TransitState == Constants.TRANSIT_STATE_S60_LOADED;


    }
}