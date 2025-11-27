import { View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./styles";

export const MainHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          style={styles.logo}
          src="https://upload.wikimedia.org/wikipedia/id/6/6a/LOGO_KOTA_BANDAR_LAMPUNG_BARU.png"
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>PEMERINTAH KOTA BANDAR LAMPUNG</Text>
          <Text style={styles.subTitle}>DINAS KOMUNIKASI DAN INFORMATIKA</Text>
          <Text style={styles.address}>
            Jalan Dr. Susilo No. 2, Telp./Fax. (0721) 260295, Bandar Lampung -
            35214
          </Text>
          <Text style={styles.website}>
            Website : www.bandarlampungkota.go.id
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
};
