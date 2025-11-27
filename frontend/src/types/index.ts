export interface User {
  id: number;
  email_instansi: string;
  nama_instansi: string;
  token?: string;
  role: "admin" | "user";
  total_surat: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface Letter {
  id: number;
  nomor_registrasi: number;
  pengirim: string;
  nomor_surat: string;
  tanggal_masuk: string;
  tanggal_surat: string;
  perihal: string;
  file_url: string;
  status: "pending" | "diterima";
  user_id: number;
  user?: User;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface LettersResponse {
  data: Letter[];
  total: number;
  page: number;
  totalPages: number;
}
export const UserRole = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
