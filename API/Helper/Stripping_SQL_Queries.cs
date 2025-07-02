
namespace API.Helper;


public static class Stripping_SQL_Queries
{
    public static string GetAllDriversWithCreator()
    {
        return @"SELECT IdFDriver AS Id , Name , Creator FROM StrippingBgtFlDrivers";
    }

    public static string CreateStrippingDriver()
    {
        return @"INSERT INTO StrippingBgtFlDrivers (Name, Creator)
        VALUES (@driverName, @creator) SELECT SCOPE_IDENTITY() AS Id;";
    }


    public static string SelectCreatedDriver()
    {
        return @"
        SELECT TOP 1 IdFDriver, Name, Creator
        FROM StrippingBgtFlDrivers
        WHERE Name = @driverName AND Creator = @creator
        ORDER BY IdFDriver DESC;";
    }


    public static string DeleteStrippingDriver()
    {
        return @"DELETE FROM StrippingBgtFlDrivers WHERE IdFDriver = @driverId";
    }
    public static string DeleteStrippingLabor()
    {
        return @"DELETE FROM StrippingLaborType WHERE LaborTypeId = @laborTypeId";
    }



    public static string CreateStrippingLaborType()
    {
        return @"INSERT INTO StrippingLaborType (LaborName)
        VALUES (@laborType) SELECT SCOPE_IDENTITY() AS Id;";
    }


    public static string GetAllContainersStrippedInNavis()
    {
        return @"
                 SELECT ContainerNumber, LineOperator, ISO, Size, 
                DateStripped, Berth
				FROM RetiredContainersView
                WHERE DateStripped >= @dateStripped
				AND DateStripped < DATEADD(Day, 1, @dateStripped) AND Berth = @berth";
    }

    public static string GetAllContainersFromStrippedInAppDatabase()
    {
        return @"
        SELECT 
            Id, ContainerNumber, LineOperator, ISO, Size, 
            DateStripped, LaborType, DriverName, Berth, Final
        FROM StrippedInAppContainers
        WHERE DateStripped >= @dateStripped 
          AND DateStripped < DATEADD(DAY, 1, @dateStripped)
          AND Berth = @berth
        ORDER BY DateStripped ASC;";
    }



    public static string SaveRetiredConainersFromNavis()
    {
        return @"
            INSERT INTO StrippedInAppContainers (ContainerNumber,LineOperator,ISO,Size,DateStripped,LaborType,DriverName,Berth,StrippedInNavis,StrippedInApp,Final)
            VALUES (@containerNumber, @lineOperator,@iso,@size,@dateStripped,@laborType,@driverName,@berth,@strippedInNavis,@strippedInApp,@final)";
    }


    public static string DoesContainerExistInStrippedContainersDatabase()
    {
        return @"SELECT ContainerNumber From StrippedInAppContainers WHERE ContainerNumber = @containerNumber";
    }
    public static string DoesContainerExistInStrippedInAppWithTheSameDateStrippedDate()
    {
        return @"SELECT ContainerNumber FROM StrippedInAppContainers 
        WHERE ContainerNumber = @containerNumber AND DateStripped >= @dateStripped AND DateStripped < DATEADD(Day, 1 , @dateStripped)";
    }
    public static string GetAllActiveLaborTypes()
    {
        return @"SELECT LaborTypeId AS Id , LaborName AS LaborType FROM StrippingLaborType";
    }

    public static string ConfirmContainerExistsAndNotYetStrippedInApp()
    {
        return @"SELECT * FROM StrippedInAppContainers WHERE ContainerNumber = @containerNumber AND StrippedInNavis = 1 AND StrippedInApp = 0;";

    }
    public static string UpdateContainersQuery()
    {
        return @"
            UPDATE StrippedInAppContainers
            SET 
            StrippedInApp = 1,
            Final = 1,
            DriverName = @driverName,
            LaborType = @laborType
            WHERE ContainerNumber = @containerNumber AND
             DateStripped >=  @dateStripped AND DateStripped <  DATEADD(DAY, 1, @dateStripped)";

    }
    public static string GetDashboardDataByRange()
    {
        return @"
        SELECT 
            Berth AS Berth,
            LaborType AS [LaborType],
            SUM(CASE WHEN Size = 20 THEN 1 ELSE 0 END) AS Size20,
            SUM(CASE WHEN Size = 40 THEN 1 ELSE 0 END) AS Size40,
            SUM(CASE WHEN Size = 45 THEN 1 ELSE 0 END) AS Size45
        FROM StrippedInAppContainers
        WHERE DateStripped BETWEEN @from AND @to
        AND Final = 1
        GROUP BY Berth, LaborType
        ORDER BY Berth, LaborType;";
    }



    public static string GetDashboardCsvData() => @"
SELECT
    Id, ContainerNumber, LineOperator, ISO, Size,
    DateStripped, LaborType, DriverName, Berth, Final
FROM StrippedInAppContainers
WHERE DateStripped >= @from
  AND DateStripped <  DATEADD(DAY, 1, @to)
ORDER BY DateStripped;";






}
