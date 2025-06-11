using API.Dtos.Container;

namespace API.Services.N4ContainerHistory
{
    public interface IContainerGeneralRequests
    {

        Task<string?> GetEventDateByUnitGkeyAndEventId(long unitGkey, string eventId);

        Task<string?> GetEventReceivedDateByUnitIdAndEventId(string unitId, string eventId);

        Task<(string? gateOut, string? receivedBackEmpty)> ExtractGateOutForUnit(long containerUnitGkey,
        string containerId);
    }
}