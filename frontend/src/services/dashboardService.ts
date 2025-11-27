import { apiClient } from "@/app/api/client";

export const dashboardService = {
  async getStats(isAdmin: boolean) {
    const endpoint = isAdmin === true ? "/api/dashboard/admin" : "/api/dashboard/user";

    return await apiClient.get(endpoint);
  },
};
