import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatRupiah } from '../utils/format-rupiah';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
    },

    // --- Gaya Tabel Umum ---
    table: {
        width: 'auto',
        marginBottom: 20,
        borderWidth: 1,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'stretch', // Pastikan sel mengisi tinggi baris
    },
    tableColHeader: {
        padding: 5,
        backgroundColor: 'white', // Latar belakang abu-abu untuk header
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    tableCol: {
        justifyContent: 'center', // Center content vertically
        alignItems: 'flex-start', // Default align text to start
        padding: 10
    },
    colBorderRight: {
        borderRightWidth: 1,
    },
    colBorderBottom: {
        borderBottom: 1,
    },
    tableCell: {
        margin: 'auto', // Tidak perlu margin, padding sudah diatur di tableCol
        fontSize: 11, // Ukuran font untuk konten sel
    },
    tableCellCenter: {
        textAlign: 'center', // Untuk sel yang teksnya di tengah
    },
    tableCellBold: {
        fontWeight: 'bold', // Untuk teks tebal
    },

    // --- Lebar Kolom Spesifik ---
    col1: { width: '5%' },   // No
    col2: { width: '70%' },  // Rencana Kinerja
    col3: { width: '25%' },  // Sasaran Kinerja
});

interface Program {
    // TODO: jangan any anjeng
    data: any[];
    jenis_item: string;
    total: number;
}

// Komponen Tabel
const TableProgram: React.FC<Program> = ({ data, jenis_item, total }) => (
    <View style={styles.table} break>
        {/* Header Tabel */}
        <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.tableCellCenter, styles.col1, styles.colBorderRight, styles.colBorderBottom]}>
                <Text style={styles.tableCell}>No</Text>
            </View>
            <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                <Text style={styles.tableCell}>
                    {/* {
            jenis_item === "Strategic" ? "Program" :
              jenis_item === "Tactical" ? "Kegiatan" :
                jenis_item === "Operational" ? "Sub Kegiatan" :
                  "Program / Kegiatan / Sub Kegiatan"
                  } */}
                    Program / Kegiatan / Sub Kegiatan
                </Text>
            </View>
            <View style={[styles.tableColHeader, styles.col3, styles.colBorderBottom]}>
                <Text style={styles.tableCell}>Anggaran</Text>
            </View>
        </View>

        {/* Baris Data 1 */}
        {data.map((item: any, index: number) => (
            <View style={styles.tableRow} key={index}>
                <View style={[styles.tableCol, styles.col1, styles.tableCellCenter, styles.colBorderRight, styles.colBorderBottom]}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={[styles.tableCol, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
                    <Text style={styles.tableCell}>({item.kode_item || "x"}) {item.nama_item || "-"}</Text>
                </View>
                <View style={[styles.tableCol, styles.col3, styles.colBorderBottom]}>
                    <Text style={styles.tableCell}>Rp.{formatRupiah(item.pagu_item || 0)}</Text>
                </View>
            </View>
        ))}

        {/* Total */}
        <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.tableCellCenter, styles.col1, styles.colBorderRight]}>
                <Text style={styles.tableCell}></Text>
            </View>
            <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight]}>
                <Text style={styles.tableCell}>Jumlah</Text>
            </View>
            <View style={[styles.tableColHeader, styles.col3]}>
                <Text style={styles.tableCell}>Rp.{formatRupiah(total || 0)}</Text>
            </View>
        </View>
    </View>
);

export default TableProgram;
