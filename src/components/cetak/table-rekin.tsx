import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import type { PkAsn } from '@/app/perjanjian-kinerja/pk-opd-types';

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
  tableCellSmall: {
    margin: 'auto', // Tidak perlu margin, padding sudah diatur di tableCol
    fontSize: 8, // Ukuran font untuk konten sel
  },
  tableCellCenter: {
    textAlign: 'center', // Untuk sel yang teksnya di tengah
  },
  tableCellBold: {
    fontWeight: 'bold', // Untuk teks tebal
  },

  // --- Lebar Kolom Spesifik ---
  col1: { width: '5%' },   // No
  col2: { width: '25%' },  // Rencana Kinerja
  col3: { width: '30%' },  // Sasaran Kinerja
  col4: { width: '30%' },  // Indikator Kinerja
  col5: { width: '10%' },  // Target

  rowContentItem: {
    // paddingVertical: TABLE_CELL_PADDING / 2,
    // paddingHorizontal: TABLE_CELL_PADDING,
  }
});

interface Table {
  rekin: PkAsn[];
}

const TableRekin: React.FC<Table> = ({ rekin }) => (
  <View style={styles.table}>

    {/* HEADER */}
    <View style={styles.tableRow}>
      <View style={[styles.tableColHeader, styles.col1, styles.colBorderRight, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>No</Text>
      </View>
      <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>Rencana Kinerja Atasan</Text>
      </View>
      <View style={[styles.tableColHeader, styles.col3, styles.colBorderRight, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>Sasaran Kinerja</Text>
      </View>
      <View style={[styles.tableColHeader, styles.col4, styles.colBorderRight, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>Indikator Kinerja</Text>
      </View>
      <View style={[styles.tableColHeader, styles.col5, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>Target</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.tableColHeader, styles.col1, styles.colBorderRight, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>(1)</Text>
      </View>
      <View style={[styles.tableColHeader, styles.col2, styles.colBorderRight, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>(2)</Text>
      </View>
      <View style={[styles.tableColHeader, styles.col3, styles.colBorderRight, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>(3)</Text>
      </View>
      <View style={[styles.tableColHeader, styles.col4, styles.colBorderRight, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>(4)</Text>
      </View>
      <View style={[styles.tableColHeader, styles.col5, styles.colBorderBottom]}>
        <Text style={styles.tableCell}>(5)</Text>
      </View>
    </View>

    {/* BODY */}
    {rekin.map((item, index) => {
      const indikators = item.indikators ?? []

      return indikators.map((ind, indIdx) => {
        const targets = ind.targets ?? []

        return targets.map((tar, tarIdx) => (
          <View
            key={`${item.id}-${indIdx}-${tarIdx}`}
            style={styles.tableRow}
          >
            {/* NO */}
            <View style={[styles.tableCol, styles.col1, styles.colBorderRight]}>
              <Text style={styles.tableCell}>{indIdx === 0 && tarIdx === 0 ? index + 1 : ""}</Text>
            </View>

            {/* REKIN ATASAN */}
            <View style={[styles.tableCol, styles.col2, styles.colBorderRight]}>
              <Text style={styles.tableCell}>{indIdx === 0 && tarIdx === 0 ? item.rekin_atasan : ""}</Text>
            </View>

            {/* SASARAN */}
            <View style={[styles.tableCol, styles.col3, styles.colBorderRight]}>
              <Text style={styles.tableCell}>{indIdx === 0 && tarIdx === 0 ? item.rekin_pemilik_pk : ""}</Text>
            </View>

            {/* INDIKATOR */}
            <View style={[styles.tableCol, styles.col4, styles.colBorderRight]}>
              <Text style={styles.tableCell}>{ind.indikator}</Text>
            </View>

            {/* TARGET */}
            <View style={[styles.tableCol, styles.col5]}>
              <Text style={styles.tableCellSmall}>{tar.target} / {tar.satuan}</Text>
            </View>
          </View>
        ))
      })
    })}
  </View>
)

export default TableRekin;
