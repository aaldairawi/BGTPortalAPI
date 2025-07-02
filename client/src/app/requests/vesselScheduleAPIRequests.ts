import { requests } from "../agent/agent";

export const VesselScheduleAPIRequests = {
  getVesselSchedule: async () => {
    const result = await requests.get(`vesselschedule/vessel-schedule`);
    return result;
  },
};
