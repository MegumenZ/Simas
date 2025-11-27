import { View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";

interface TableRowProps {
  letter: Letter;
  index: number;
}

export interface Letter {
  tanggal_masuk: string;
  tanggal_masuk_formatted: string;
  pengirim: string;
  tujuan?: string;
  penerima?: string;
  perihal: string;
}

export const TableRow = ({ letter, index }: TableRowProps) => {
  const truncate = (text: string, max: number) =>
    text?.length > max ? text.substring(0, max) + "..." : text;

  return (
    <View style={styles.tableRow} wrap={false}>
      <View style={styles.tableColNo}>
        <Text>{index + 1}</Text>
      </View>
      <View style={styles.tableColDate}>
        <Text>{letter.tanggal_masuk_formatted}</Text>
      </View>
      <View style={styles.tableColSender}>
        <Text>{truncate(letter.pengirim, 40)}</Text>
      </View>
      <View style={styles.tableColReceiver}>
        <Text>{truncate(letter.tujuan || letter.penerima || "-", 80)}</Text>
      </View>
      <View style={styles.tableColSubject}>
        <Text>{truncate(letter.perihal, 80)}</Text>
      </View>
    </View>
  );
};
