import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';

// Ubah nama interface agar tidak bentrok dengan nama komponen
interface NamaJabatanProps {
  nama: string | null;
  jabatan: string | null;
}

Font.register({ family: 'Times-Roman', src: '/font/times.ttf', fontStyle: 'normal', fontWeight: 'normal' });

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginLeft: 15,
    paddingRight: 15,
    fontSize: 11,
    fontFamily: "Times-Roman",
    lineHeight: 1.4, // Sedikit dikurangi agar tidak terlalu renggang saat wrap
  },
  tableRow: {
    flexDirection: 'row',
    // alignItems: 'flex-start' sangat penting agar "Jabatan" tetap di atas 
    // meskipun isi jabatan di kolom 3 sangat panjang (berbaris-baris)
    alignItems: 'flex-start', 
    marginBottom: 4, 
  },
  column1: {
    width: 60, // Sesuaikan lebar label "Nama" dan "Jabatan"
  },
  column2: {
    width: 15, // Lebar tetap untuk titik dua ":"
    textAlign: 'center',
  },
  column3: {
    // Menggunakan flex: 1 alih-alih flexGrow saja agar react-pdf 
    // tahu batas pasti area teks untuk melakukan wrapping
    flex: 1, 
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  bold: {
    fontWeight: 'bold',
  },
});

const NamaJabatan: React.FC<NamaJabatanProps> = ({ nama, jabatan }) => (
  <View style={styles.container}>
    {/* Baris Nama */}
    <View style={styles.tableRow}>
      <Text style={styles.column1}>Nama</Text>
      <Text style={styles.column2}>:</Text>
      <Text style={[styles.column3, styles.uppercase, styles.bold]}>
        {nama || "-"}
      </Text>
    </View>

    {/* Baris Jabatan */}
    <View style={styles.tableRow}>
      <Text style={styles.column1}>Jabatan</Text>
      <Text style={styles.column2}>:</Text>
      <Text style={[styles.column3, styles.uppercase]}>
        {jabatan || "-"}
      </Text>
    </View>
  </View>
);

export default NamaJabatan;