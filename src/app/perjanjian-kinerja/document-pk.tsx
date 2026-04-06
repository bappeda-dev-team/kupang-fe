'use client'

import { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import NamaJabatan from '../../components/cetak/nama-jabatan';
import TTD from '../../components/cetak/tanda-tangan';
import TableRekin from '../../components/cetak/table-rekin';
import TableProgram from '../../components/cetak/table-program';
import { Font } from '@react-pdf/renderer';
// import type { PkPegawai } from './pk-opd-types';

Font.register({ family: 'Times-Roman', src: '/font/times.ttf', fontStyle: 'normal', fontWeight: 'normal' });

interface DocumentProps {
    branding: any;
    data: any;
}

// Gaya untuk MyDocument
const styles = StyleSheet.create({
    page: {
        paddingVertical: 30, // px-20
        paddingHorizontal: 38, // py-5
        fontFamily: "Times-Roman",
        textAlign: 'justify'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center', // Untuk centering horizontal teks
    },
    logoContainer: {
        marginBottom: 20, // Spasi bawah logo
        alignItems: 'center',
    },
    heading: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 5,
    },
    heading2: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 5,
    },
    marginBottom: {
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
    },
    boldText: {
        fontWeight: 'bold',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4, // equivalent to Tailwind's gap-1, though you might need to adjust spacing manually or use margins
    },
    marginTop: {
        marginTop: 10, // equivalent to Tailwind's mt-4
    },
    logoImage: {
        width: 60,
        objectFit: 'contain'
    },
    tandaTangan: {
        marginTop: 80,
        flexDirection: 'row',       // Mengatur item (TTD components) untuk berjajar secara horizontal
        justifyContent: 'space-evenly', // Mendistribusikan ruang kosong secara merata di antara dan di sekitar item
        alignItems: 'flex-start',   // Opsional: mengatur item untuk rata di bagian atas (atau 'center', 'flex-end')
        width: '100%',              // Pastikan kontainer mengambil lebar penuh agar justifyContent berfungsi
    },
    logo: {
        width: 100,
        height: 100,
    },
});

export async function imageToBase64(imageUrl: string): Promise<string> {
    const res = await fetch(
        `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    );

    const blob = await res.blob();

    return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}

const DocumentPk: React.FC<DocumentProps> = ({ branding, data }) => {

    const [logoBase64, setLogoBase64] = useState("");

    useEffect(() => {
        const image = process.env.NEXT_PUBLIC_LOGO_URL as string;

        imageToBase64(image).then(setLogoBase64);
    }, []);

    if (!logoBase64) {
        return (
            <Document>
                <Page size="A4">
                    <Text>Loading PDF...</Text>
                </Page>
            </Document>
        );
    }

    return (
        <Document title='dokumen perjanjian kinerja'>
            <Page size="A4" style={styles.page}>
                <View style={styles.logoContainer}>
                    <Image
                        src={logoBase64}
                        style={styles.logoImage}
                    />
                </View>

                <Text style={styles.heading}>
                    Perjanjian Kinerja
                </Text>
                <Text style={styles.heading2}>
                    {data.nama_opd}
                </Text>
                <Text style={[styles.heading2, styles.marginBottom]}>
                    Tahun {data.tahun}
                </Text>

                <Text style={styles.paragraph}>
                    Dalam rangka mewujudkan manajemen pemerintah yang efektif, transparan, dan akuntabel serta berorientasi kepada hasil, kami yang bertanda tangan di bawah ini :
                </Text>

                {/* pihak pertama */}
                {/* bawahan */}
                <NamaJabatan
                    nama={data?.pegawai?.nama_pegawai || "-"}
                    jabatan={data?.pegawai?.jabatan_pegawai || "-"}
                />

                <View style={styles.flexRow}>
                    <Text style={styles.paragraph}>selanjutnya disebut</Text>
                    <Text style={[styles.paragraph, styles.boldText]}>Pihak Pertama.</Text>
                </View>

                {/* pihak kedua */}
                {/* atasan */}
                <NamaJabatan
                    nama={data?.pegawai?.nama_atasan || "-"}
                    jabatan={data?.pegawai?.jabatan_atasan || "-"}
                />

                <View style={styles.flexRow}>
                    <Text style={styles.paragraph}>selaku atas pihak pertama, selanjutnya disebut</Text>
                    <Text style={[styles.paragraph, styles.boldText]}>Pihak Kedua.</Text>
                </View>

                <Text style={[styles.paragraph, styles.marginTop]}>
                    Pihak Pertama berjanji akan mewujudkan target kinerja yang seharusnya sesuai lampiran perjanjian ini, dalam rangka mencapai target kinerja jangka menengah seperti yang telah ditetapkan dalam dokumen perencanaan. Keberhasilan dan kegagalan pencapaian target kinerja tersebut menjadi tanggung jawab kami.
                </Text>

                <Text style={[styles.paragraph, styles.marginTop, styles.marginBottom]}>
                    Pihak kedua akan melakukan supervisi yang diperlukan serta akan melakukan evaluasi terhadap capaian kinerja dari perjanjian ini dan mengambil tindakan yang diperlukan dalam rangka pemberian penghargaan dan sanksi.
                </Text>

                {/* TTD */}
                <View style={[styles.tandaTangan]}>
                    {/* pihak kedua */}
                    {data.level == 1 ? (
                        <TTD
                            nama={data?.pegawai?.nama_atasan || "-"}
                            nip={""}
                            pihak={data?.pegawai?.jabatan_atasan || "-"}
                            tanggal={false}
                        />
                    ) :
                        (
                            <TTD
                                nama={data?.pegawai?.nama_atasan || "-"}
                                nip={data?.pegawai?.nip_atasan || "-"}
                                pihak={data?.pegawai?.jabatan_atasan || "-"}
                                tanggal={false}
                            />
                        )}
                    {/* pihak pertama */}
                    <TTD
                        nama={data?.pegawai.nama_pegawai || "-"}
                        nip={data?.pegawai.nip || "-"}
                        pihak='Pihak Pertama'
                        tanggal
                    />
                </View>

                {/* NEXT PAGE */}
                <View style={styles.heading} break>
                    <Text>PERJANJIAN KINERJA TAHUN {data?.tahun}</Text>
                    <Text>{data?.pegawai.jabatan_pegawai || ""}</Text>
                </View>
                <TableRekin rekin={data?.pegawai.pks || []} />
                {data?.pegawai?.item_pk &&
                    <TableProgram
                        data={data?.pegawai?.item_pk || []}
                        jenis_item={data?.pegawai?.jenis_item || ""}
                        total={data?.pegawai?.total_pagu}
                    />
                }
                <View style={[styles.marginTop, styles.tandaTangan]}>
                    {/* pihak kedua */}
                    {data.level == 1 ? (
                        <TTD
                            nama={data?.pegawai?.nama_atasan || "-"}
                            nip={""}
                            pihak={data?.pegawai?.jabatan_atasan || "-"}
                            tanggal={false}
                        />
                    ) :
                        (
                            <TTD
                                nama={data?.pegawai?.nama_atasan || "-"}
                                nip={data?.pegawai?.nip_atasan || "-"}
                                pihak={data?.pegawai?.jabatan_atasan || "-"}
                                tanggal={false}
                            />
                        )}
                    {/* pihak pertama */}
                    <TTD
                        nama={data?.pegawai?.nama_pegawai || "-"}
                        nip={data?.pegawai?.nip || "-"}
                        pihak={data?.pegawai?.jabatan_pegawai || ""}
                        tanggal
                    />
                </View>
            </Page>
        </Document>
    );
}

export default DocumentPk;
