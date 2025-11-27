import { Document, Page, View, Text } from "@react-pdf/renderer";
import { MainHeader } from "./MainHeader";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { styles } from "./styles";

export interface Letter {
  tanggal_masuk: string;
  tanggal_masuk_formatted: string;
  pengirim: string;
  tujuan?: string;
  penerima?: string;
  perihal: string;
}

export interface MonthlyReportData {
  surat: Letter[];
  total: number;
  month?: number;
  year?: number;
}

interface MonthlyReportDocumentProps {
  data: MonthlyReportData;
}

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const MonthlyReportDocument = ({ data }: MonthlyReportDocumentProps) => {
  const perPage = 25;
  const pages = [];
  for (let i = 0; i < data.surat.length; i += perPage) {
    pages.push(data.surat.slice(i, i + perPage));
  }
  if (pages.length === 0) pages.push([]);

  const monthName = data.month ? monthNames[data.month - 1] : "";
  const year = data.year || "";

  return (
    <Document>
      {pages.map((pageData, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <MainHeader />
          <View style={styles.monthlyTitle}>
            <Text>REKAP KEGIATAN SANAPATI</Text>
            <Text>
              BULAN {monthName.toUpperCase()} TAHUN {year}
            </Text>
          </View>
          <View style={styles.table}>
            <TableHeader />
            {pageData.map((letter, idx) => (
              <TableRow
                key={idx}
                letter={letter}
                index={pageIndex * perPage + idx}
              />
            ))}
          </View>
          {pageIndex === pages.length - 1 && (
            <View style={styles.footer}>
              <Text>Total jumlah surat masuk: {data.total} surat.</Text>
            </View>
          )}
          <Text style={styles.pageNumber}>
            Halaman {pageIndex + 1} dari {pages.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
};
