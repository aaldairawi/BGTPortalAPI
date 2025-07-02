
using API.Helper;
using API.Services.Database;
using Microsoft.Data.SqlClient;


namespace API.Services.N4ContainerHistory
{
    public class ContainerGeneralRequestsRepository(IDatabase database) : IContainerGeneralRequests
    {
        private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));

        private async Task<string?> GetUnitReceivedBackDateByEventNameDateAndContainerId(string eventName, DateTime dateTimeOfEvent, string containerId)
        {
            var query = Container_SQL_Queries.GetUnitReceivedBackDateByEventNameDateAndContainerId();

            var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
            {
                while (await reader.ReadAsync())
                {
                    return Convert.ToDateTime(reader["PlacedTime"].ToString()).ToString("M-dd-yyyy hh:mm");
                }

                return null;
            }, new SqlParameter("@dayOfDate", dateTimeOfEvent.Day), new SqlParameter("@monthOfDate", dateTimeOfEvent.Month), new SqlParameter("@yearOfDate", dateTimeOfEvent.Year), new SqlParameter("@containerId", containerId), new SqlParameter("@eventName", eventName));
            return result;
        }

        public async Task<string?> GetEventDateByUnitGkeyAndEventId(long unitGkey, string eventId)
        {
            var query = Container_SQL_Queries.GetEventDateByUnitGkeyAndEventId();

            var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
            {
                while (await reader.ReadAsync())
                {
                    return Convert.ToDateTime(reader["EventTime"].ToString()).ToString("M-dd-yyyy hh:mm");
                }
                return null;
            }, new SqlParameter("@unitGkey", unitGkey), new SqlParameter("@eventId", eventId));
            return result;
        }
        public async Task<string?> GetEventReceivedDateByUnitIdAndEventId(string unitId, string eventId)
        {
            var query = Container_SQL_Queries.GetEventReceivedDateByUnitIdAndEventId();


            var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
            {
                while (await reader.ReadAsync())
                {
                    return Convert.ToDateTime(reader["EventTime"]).ToString("M-dd-yyyy hh:mm");
                }
                return null;

            }, new SqlParameter("@unitId", unitId), new SqlParameter("@eventId", eventId));
            return result;
        }

        public async Task<(string? gateOut, string? receivedBackEmpty)> ExtractGateOutForUnit(long containerUnitGkey, string containerId)
        {
            var gateOut = await GetEventDateByUnitGkeyAndEventId(containerUnitGkey, Constants.UNIT_OUT_GATE);
            var passGateOutDate = DateTime.TryParse(gateOut, out DateTime result);
            string? receivedBackEmptyDate = string.Empty;

            if (gateOut != null && passGateOutDate)
                receivedBackEmptyDate = await GetUnitReceivedBackDateByEventNameDateAndContainerId(Constants.UNIT_IN_GATE, result, containerId);
            return (gateOut, receivedBackEmptyDate);
        }


    }
}