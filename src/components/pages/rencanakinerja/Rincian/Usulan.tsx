'use client'

import { ButtonSky, ButtonRed } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { getUser, getToken } from "@/components/lib/Cookie";
import { LoadingSync } from "@/components/global/Loading";
import { ModalAddUsulan } from "../ModalUsulan";
import { AlertQuestion, AlertNotification } from "@/components/global/Alert";

interface table {
    id: string;
    nip: string;
}

interface usulan {
    id : string;
    jenis_usulan : string;
    usulan : string;
    alamat : string;
    uraian: string;
    tahun: string;
}

const Usulan: React.FC<table> = ({ id, nip }) => {

    const [Usulan, setUsulan] = useState<usulan[]>([]);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [ModalAdd, setModalAdd] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const token = getToken();

    const handleModalAddUsulan = () => {
        setModalAdd((prev) => !prev);
    }

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchUsulan = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/rencana_kinerja/${id}/pegawai/${nip}/input_rincian_kak`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.rencana_kinerja;
                if(hasil){
                    const data = hasil.find((item: any) => item.usulan);
                    if(data == null){
                        setDataNull(true);
                        setUsulan([]);
                    } else {
                        setDataNull(false);
                        setUsulan(data.usulan);
                    }
                } else {
                    setDataNull(true);
                    setUsulan([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if(nip != undefined){    
            fetchUsulan();
        }
    },[id, nip, token, fetchTrigger]);

    const hapusUsulanMusrenbang = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/usulan_musrebang/delete_usulan_terpilih/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            const result = await response.json();
            if(!response.ok){
                alert("cant fetch data")
            }
            if(result.code === 200){
                setUsulan(Usulan.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", "Data Usulan Musrenbang Berhasil Dihapus", "success", 1000);
            } else {
                AlertNotification("Gagal", `${result.status}`, "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };
    const hapusUsulanPokir = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/usulan_pokok_pikiran/delete_usulan_terpilih/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if(!response.ok){
                alert("cant fetch data")
            }
            if(result.code === 200){
                setUsulan(Usulan.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", "Data Usulan Musrenbang Berhasil Dihapus", "success", 1000);
            } else {
                AlertNotification("Gagal", `${result.status}`, "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };
    const hapusUsulanInisiatif = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/usulan_inisiatif/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if(!response.ok){
                alert("cant fetch data")
            }
            if(result.code === 200){
                setUsulan(Usulan.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", "Data Usulan Musrenbang Berhasil Dihapus", "success", 1000);
            } else {
                AlertNotification("Gagal", `${result.status}`, "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };
    const hapusUsulanMandatori = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/usulan_mandatori/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if(!response.ok){
                alert("cant fetch data")
            }
            if(result.code === 200){
                setUsulan(Usulan.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", "Data Usulan Musrenbang Berhasil Dihapus", "success", 1000);
            } else {
                AlertNotification("Gagal", `${result.status}`, "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if(Loading){
        return(
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Usulan</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return(
        <>
            {/* usulan musrebang */}
            <div className="mt-3 rounded-t-xl border px-5 py-3">
                <h1 className="font-bold">Usulan</h1>
            </div>
            <div className="flex flex-col justify-start rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <ButtonSky className="mt-2" onClick={handleModalAddUsulan}>Tambah Usulan</ButtonSky>
                <ModalAddUsulan isOpen={ModalAdd} onClose={handleModalAddUsulan} rekin_id={id} onSuccess={() => setFetchTrigger((prev) => !prev)}/>
                <div className="overflow-auto mt-3 rounded-t-xl border">
                    <table className="w-full">
                        <thead className="bg-gray-300">
                            <tr>
                                <td className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                                <td className="border-r border-b px-6 py-3 min-w-[400px]">Usulan</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Jenis</td>
                                <td className="border-r border-b px-6 py-3 min-w-[300px]">Alamat</td>
                                <td className="border-r border-b px-6 py-3 min-w-[100px]">Tahun</td>
                                <td className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</td>
                            </tr>
                        </thead>
                        <tbody>
                            {dataNull ? (
                                <tr>
                                   <td className="px-6 py-3" colSpan={5}>
                                        Data Kosong / Belum Ditambahkan
                                   </td>
                                </tr>
                            ) : (
                                Usulan.map((data, index) => (
                                    <tr key={data.id}>
                                        <td className="border-r border-b px-6 py-3 min-w-[50px]">{index + 1}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[400px]">{data.usulan || "-"}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.jenis_usulan || "-"}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[300px]">{data.alamat || "-"}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[100px]">{data.tahun|| "-" }</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[100px]">
                                            <ButtonRed
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Usulan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if(result.isConfirmed){
                                                            if(data.jenis_usulan === 'usulan_musrebang'){
                                                                hapusUsulanMusrenbang(data.id);
                                                            } else if(data.jenis_usulan === 'usulan_pokok_pikiran'){
                                                                hapusUsulanPokir(data.id);
                                                            } else if(data.jenis_usulan === 'usulan_inisiatif'){
                                                                hapusUsulanInisiatif(data.id);
                                                            } else if(data.jenis_usulan === 'usulan_mandatori'){
                                                                hapusUsulanMandatori(data.id);
                                                            }
                                                        }
                                                    });
                                                }}
                                            >
                                                Hapus
                                            </ButtonRed>
                                        </td>
                                    </tr>
                                ))
                            )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Usulan;