export interface OptionTypeString {
    value: string;
    label: string;
}
export interface OptionType {
    value: number;
    label: string;
}
export interface PerangkatDaerah {
    nama_opd: string;
    kode_opd: string;
}
export interface Permasalahan {
    id?: number;
    data_dukung: DataDukung;
}
export interface DataDukung {
    data_dukung: string;
    id: number;
    jumlah_data: TargetJumlahData[];
    narasi_data_dukung: string;
    permasalahan_opd_id?: number;
}
export interface TargetJumlahData {
    id?: number;
    id_data_dukung?: number;
    tahun: string;
    jumlah_data: number;
    satuan: string;
}
export interface BidangUrusan {
    value: string;
    label: string;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    tahun: string;
}
export interface TablePermasalahan {
    value?: number;
    label?: string;
    id?: number;
    id_permasalahan: TablePermasalahan[];
    parent: number | null;
    nama_pohon: string;
    masalah?: string;
    level_pohon: number;
    perangkat_daerah: {
        nama_opd: string;
        kode_opd: string;
    };
    jenis_masalah: string;
}
export interface IsuStrategis {
    created_at: string;
    id: number;
    isu_strategis: string;
    kode_bidang_urusan: string;
    kode_opd: string;
    nama_bidang_urusan: string;
    nama_opd: string;
    permasalahan_opd: PermasalahanOpd[];
    tahun_akhir: string;
    tahun_awal: string;
}
export interface PermasalahanOpd {
    data_dukung: DataDukung[];
    id: number;
    jenis_masalah: string;
    level_pohon: number;
    masalah: string;
}