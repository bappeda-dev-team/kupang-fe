'use client'

import { ButtonSky, ButtonSkyBorder } from "@/components/global/Button";
import { getToken, getUser } from "@/components/lib/Cookie";
import { useState, useEffect } from "react";
import { LoadingSync, LoadingButtonClip } from "@/components/global/Loading";
import { useRouter } from "next/navigation";
import React from "react";
import { TbPencil } from "react-icons/tb";

interface id {
    id: string;
}
interface sakip {
    id_rencana_kinerja: string;
    id_pohon: number;
    nama_pohon: string;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: string;
    catatan: string;
    operasional_daerah: opd;
    pegawai_id: string;
    nama_pegawai: string;
    indikator: indikator[];
}
interface opd {
    nama_opd: string;
    kode_opd: string;
}
interface indikator {
    id_indikator: string;
    rencana_kinerja_id: string;
    nama_indikator: string;
    targets: targets[];
}
interface targets {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

const Sakip: React.FC<id> = ({id}) => {

    const [Sakip, setSakip] = useState<sakip | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const [ProsesIk, setProsesIk] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const token = getToken();
    const router = useRouter();
    
    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[]);

    const handleManualIk = () => {
      setProsesIk(true);  
      router.push("manual_ik/tambah");
    }

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSakip = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/detail-rencana_kinerja/${id}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.rencana_kinerja;
                if(hasil){
                    if(hasil == null){
                        setDataNull(true);
                        setSakip(null);
                    } else {
                        setDataNull(false);
                        setSakip(hasil);
                    }
                } else {
                    setDataNull(true);
                    setSakip(null);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if(user?.roles != undefined){
            fetchSakip();
        }
    },[id, user, token]);
    
    if(Loading){
        return(
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Sasaran Kinerja</h1>
                </div>
                <div className="border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return(
        <>
        {/* SasaranKinerja */}
        <div className="mt-3 rounded-t-xl border px-5 py-3">
                <div className="flex justify-between">
                    <h1 className="font-bold">Sasaran Kinerja</h1>
                    <ButtonSky halaman_url={`/rencanakinerja/${id}/edit`}>
                        <TbPencil className="mr-1"/>
                        Edit Sasaran
                    </ButtonSky>
                </div>
                <div className="mx-2 my-3">
                    <table className="w-full">
                        <tbody className='border'>
                        {dataNull ? 
                                <tr>
                                    <td className="px-6 py-3" colSpan={5}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                            :
                            <>
                                <tr>
                                    <td className="px-2 py-2 border">OPD </td>
                                    <td className="px-2 py-2 border">{Sakip?.operasional_daerah?.nama_opd || "-"}</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border">ASN </td>
                                    <td className="px-2 py-2 border">{Sakip?.nama_pegawai || "-"}</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border">NIP </td>
                                    <td className="px-2 py-2 border">{user?.nip}</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border">Pangkat </td>
                                    <td className="px-2 py-2 border">{user?.roles}</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border">Sasaran Kinerja </td>
                                    <td className="px-2 py-2 border">{Sakip?.nama_rencana_kinerja}</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border">Tahun </td>
                                    <td className="px-2 py-2 border">{Sakip?.tahun}</td>
                                </tr>
                                {Sakip?.indikator &&
                                    Sakip?.indikator.map((i: indikator, index: number) => (
                                        <React.Fragment key={i.id_indikator}>
                                            <tr>
                                                <td className="px-2 py-2 border bg-slate-100">Indikator Kinerja ke {index + 1}</td>
                                                <td className="px-2 py-2 border bg-slate-100">{i.nama_indikator}</td>
                                            </tr>
                                            {i.targets.map((t: targets) => (
                                                <tr key={t.id_target}>
                                                    <td className="px-2 py-2 border">Target Indikator Kinerja ke {index + 1}</td>
                                                    <td className="px-2 py-2 border">{t.target} {t.satuan}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className="px-2 py-2 border">Manual IK </td>
                                                <td className="px-2 py-2 border">
                                                    <ButtonSkyBorder
                                                        disabled={ProsesIk}
                                                        onClick={handleManualIk}
                                                    >
                                                        {ProsesIk ?
                                                            <p className="flex items-center">
                                                                <LoadingButtonClip />
                                                                Manual IK
                                                            </p>
                                                        :
                                                            "Manual IK"
                                                        }
                                                    </ButtonSkyBorder>
                                                </td>
                                            </tr>
                                            {/* <tr>
                                                <td className="px-2 py-2 border">Data Input </td>
                                                <td className="px-2 py-2 border">kinerja</td>
                                            </tr> */}
                                        </React.Fragment>
                                    ))
                                }
                            </>
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Sakip; 