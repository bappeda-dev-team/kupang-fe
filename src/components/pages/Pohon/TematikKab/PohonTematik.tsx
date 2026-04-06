import '@/components/pages/Pohon/treeflex.css'
import { useState, useEffect, useRef } from 'react';
import { LoadingBeat } from '@/components/global/Loading';
import { Pohon } from '@/components/lib/Pohon/Pemda/Pohon';
import { getOpdTahun, getToken, getUser } from '@/components/lib/Cookie';
import { PohonLaporan } from '@/components/lib/Pohon/Cascading/PohonLaporan';

interface pohontematik {
    id: number;
    show_all: boolean;
    jenis: "laporan" | "pemda" | ""
    set_show_all: () => void;
}
interface opd {
    kode_opd: string;
    nama_opd: string;
}

interface tematik {
    id: number;
    parent: number;
    tema: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string;
    childs: childs[];
}
interface childs {
    id: number;
    parent: number;
    tema_sub_tematik: string;
    keterangan: string;
    kode_opd: opd;
    indikators: string;
    strategics: childs[];
}

const PohonTematik = ({ id, jenis, show_all, set_show_all }: pohontematik) => {

    const [Pokin, setPokin] = useState<tematik[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');
    const [Deleted, setDeleted] = useState<boolean>(false);
    const token = getToken();
    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
    }, []);

    useEffect(() => {
        const fetchTematikKab = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const API_URL_CASCADING_PEMDA = process.env.NEXT_PUBLIC_API_URL_CASCADING_PEMDA;
            setLoading(true);
            try {
                let url = "";
                if(jenis === "pemda"){
                    url = `${API_URL}/pohon_kinerja_admin/tematik/${id}`;
                } else if(jenis === "laporan"){
                    url = `${API_URL_CASCADING_PEMDA}/laporan/cascading_pemda?tematikId=${id}&tahun=${Tahun?.value}`;
                }
                const response = await fetch(`${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if(jenis === "pemda"){
                    const data = result?.data || [];
                    setPokin(data);
                } else if(jenis === "laporan"){
                    const data = result?.data[0];
                    setPokin(data);
                }
            } catch (err) {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja tematik');
            } finally {
                setLoading(false);
            }
        }
        if (id != undefined && Tahun?.value != undefined) {
            fetchTematikKab();
        }
    }, [id, token, Deleted, jenis, Tahun]);

    if (error) {
        return (
            <h1 className="text-red-500">{error}</h1>
        )
    }
    if (Loading) {
        return (
            <LoadingBeat className="mx-5 py-5" />
        )
    }

    return (
        <>
            <ul>
                {jenis === "pemda" &&
                    <Pohon
                        user={User?.roles}
                        tema={Pokin}
                        tahun={Tahun?.value}
                        deleteTrigger={() => setDeleted((prev) => !prev)}
                        show_all={show_all}
                        set_show_all={set_show_all}
                    />
                }
                {jenis === "laporan" &&
                    <PohonLaporan
                        tema={Pokin}
                        show_all={show_all}
                        set_show_all={set_show_all}
                    />
                }
            </ul>
        </>
    )
}

export default PohonTematik;
