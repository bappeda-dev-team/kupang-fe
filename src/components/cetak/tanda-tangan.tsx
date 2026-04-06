import React from 'react';
import { View, Text, StyleSheet, Font } from '@react-pdf/renderer';

Font.registerHyphenationCallback(word => [word]);
Font.register({ family: 'Times-Roman', src: '/font/times.ttf', fontStyle: 'normal', fontWeight: 'normal' });

// Ubah nama interface agar tidak bentrok dengan nama komponen
interface TTDProps {
  nama: string | null;
  nip: string | null;
  pihak: string;
  tanggal: boolean;
}

const styles = StyleSheet.create({
  // Kontainer utama untuk satu blok tanda tangan
  signatureBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "Times-Roman",
    textAlign: 'center',
    width: 200, // Memberikan lebar pasti agar teks tahu kapan harus 'wrap'
  },
  tanggalText: {
    fontSize: 10,
    marginBottom: 4,
  },
  jabatanText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold', // Gunakan font bold standar
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  opacityZero: {
    opacity: 0,
  },
  opacityFull: {
    opacity: 1,
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 210, // Memberi batas lebar agar teks turun ke bawah (wrap)
  },
  pihakContainer: {
    // Memberikan tinggi minimal agar nama di bawah tetap sejajar 
    // meskipun teks 'pihak' cuma 1 baris atau 3 baris.
    minHeight: 50,
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  pihakText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.3,
  },
  spacer: {
    height: 40, // Ruang tanda tangan yang konsisten
  },
  nameText: {
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 2,
  },
  nipText: {
    textTransform: 'uppercase', // 'uppercase'
    fontSize: 11, // 'text-base'
    fontWeight: 'bold', // 'font-bold'
  },
});

const TTD: React.FC<TTDProps> = ({ pihak, nama, nip, tanggal }) => {
  const today = new Date();
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  const namaKota = process.env.NEXT_PUBLIC_CLIENT_NAME || "Semarang";

  return (
    <View style={styles.container}>
      {/* Baris Kota & Tanggal */}
      <Text style={[styles.tanggalText, tanggal ? styles.opacityFull : styles.opacityZero]}>
        {namaKota}, {formattedDate}
      </Text>

      {/* Kontainer Pihak/Jabatan */}
      <View style={styles.pihakContainer}>
        <Text style={styles.pihakText}>{pihak || "Pihak"},</Text>
      </View>

      {/* Ruang Tanda Tangan */}
      <View style={styles.spacer} />

      {/* Nama dan NIP */}
      <View style={styles.container}>
        <Text style={styles.nameText}>{nama || "-"}</Text>
        <Text style={styles.nipText}>NIP. {nip || "-"}</Text>
      </View>
    </View>
  );
}

export default TTD;