import { View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";

export const TableHeader = () => (
  <View style={styles.tableHeader}>
    <View style={styles.tableColNo}>
      <Text style={styles.tableHeaderText}>NO.</Text>
    </View>
    <View style={styles.tableColDate}>
      <Text style={styles.tableHeaderText}>TGL SURAT</Text>
    </View>
    <View style={styles.tableColSender}>
      <Text style={styles.tableHeaderTextLeft}>PENGIRIM</Text>
    </View>
    <View style={styles.tableColReceiver}>
      <Text style={styles.tableHeaderText}>TUJUAN</Text>
    </View>
    <View style={styles.tableColSubject}>
      <Text style={styles.tableHeaderTextLeft}>PERIHAL</Text>
    </View>
  </View>
);
