import { apiClient } from "@/app/api/client";

export const letterService = {
  async createLetter(formData: FormData) {
    return apiClient.upload("/api/surat", formData);
  },

  async getLetters(
    forCurrentUser = false, 
    page = 1, 
    limit = 10,
    month?: number,
    year?: number
  ) {
    let endpoint = forCurrentUser
      ? `/api/surat/me?page=${page}&limit=${limit}`
      : `/api/surat?page=${page}&limit=${limit}`;
  
    if (month && year) {
      endpoint += `&bulan=${month}&tahun=${year}`;
    }
  
    return apiClient.get(endpoint);
  },

  async getLettersByUserId(userId: number, page = 1, limit = 10) {
    const endpoint = `/api/surat/user/${userId}?page=${page}&limit=${limit}`;
    return apiClient.get(endpoint);
  },

  async getLetterDetails(nomorRegistrasi: number) {
    return apiClient.get(`/api/surat/${nomorRegistrasi}`);
  },

  async updateLetterStatus(
    nomorRegistrasi: number,
    status: "pending" | "diterima"
  ) {
    return apiClient.patch(`/api/surat/${nomorRegistrasi}/status`, { status });
  },

  async updateLetter(nomorRegistrasi: string | number, formData: FormData) {
    const id =
      typeof nomorRegistrasi === "string"
        ? parseInt(nomorRegistrasi, 10)
        : nomorRegistrasi;

    if (isNaN(id)) {
      throw new Error("Invalid nomor registrasi");
    }

    return apiClient.put(`/api/surat/${id}`, formData);
  },

  async getMonthlyReport(month: number, year: number) {
    return await apiClient.get(
      `/api/surat/laporan-bulanan?bulan=${month}&tahun=${year}`
    );
  },
};
