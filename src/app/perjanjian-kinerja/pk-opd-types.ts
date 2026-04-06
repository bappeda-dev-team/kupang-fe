export interface PkOpdResponse {
  kode_opd: string;
  nama_opd: string;
  nama_kepala_opd: string;
  nip_kepala_opd: string;
  tahun: number;
  pk_item: PkOpdByLevel[];
  sasaran_pemdas: SasaranPemda[];
}

export interface SasaranPemda {
    nama_kepala_pemda: string;
    nip_kepala_pemda: string;
    id_sasaran_pemda: number;
    sasaran_pemda: string;
}

export interface PkOpdByLevel {
  level_pk: number;
  pegawais: PkPegawai[];
}

export interface PkPegawai {
  jenis_item: string;
  nama_atasan: string;
  nip_atasan: string;
  jabatan_atasan: string;
  nama_pegawai: string;
  jabatan_pegawai: string;
  nip: string;
  pks: PkAsn[];
  subkegiatan: SubkegiatanRekin[];
}

export interface SubkegiatanRekin {
  id_rekin: string;
  kode_program: string;
  nama_program: string;
  kode_kegiatan: string;
  nama_kegiatan: string;
  kode_subkegiatan: string;
  nama_subkegiatan: string;
}

export interface PkAsn {
  id: string;
  id_pohon: number;
  id_parent_pohon: number;
  kode_opd: string;
  nama_opd: string;
  level_pk: number;

  nip_atasan: string;
  nama_atasan: string;
  id_rekin_atasan: string;
  rekin_atasan: string;

  nip_pemilik_pk: string;
  nama_pemilik_pk: string;
  id_rekin_pemilik_pk: string;
  rekin_pemilik_pk: string;

  tahun: number;
  keterangan: string;

  indikators: IndikatorRekin[];
  pagu_anggaran: number;
}

export interface IndikatorRekin {
  indikator: string;
  targets: TargetRekin[];
}

export interface TargetRekin {
  target: string;
  satuan: string;
}
