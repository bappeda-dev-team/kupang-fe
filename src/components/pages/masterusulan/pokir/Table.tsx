'use client'

import { ButtonSky, ButtonGreen, ButtonRed } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useState, useEffect, useMemo } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken, getOpdTahun } from "@/components/lib/Cookie";
import { OpdNull } from "@/components/global/OpdTahunNull";
import { ModalAddUsulan } from "../ModalUsulan";

interface Usulan {
  id: string;
  usulan: string;
  alamat: string;
  uraian: string;
  tahun: string;
  rencana_kinerja_id: string;
  pegawai_id: string;
  kode_opd: string;
  status: string;
}

const Table = () => {

    const [Pokir, setPokir] = useState<Usulan[]>([]);
    const [ModalNew, setModalNew] = useState<boolean>(false);
    const [TriggerFetch, setTriggerFetch] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);
    const [IdEdit, setIdEdit] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const token = getToken();
    const headers = useMemo(() => {
        const value: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            value.Authorization = `${token}`;
        }
        return value;
    }, [token]);
    const [SelectedOpd, setSelectedOpd] = useState<{ value: string; label?: string } | null>(null);

    useEffect(() => {
        const { opd } = getOpdTahun();
        if (opd?.value) {
            setSelectedOpd({
                value: opd.value,
                label: opd.label,
            });
        } else {
            setSelectedOpd(null);
        }
    }, []);

    useEffect(() => {
        if (!SelectedOpd) {
            setPokir([]);
            setDataNull(false);
            setErrorMessage(null);
            return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPokir = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const response = await fetch(`${API_URL}/pokok-pikirans/opd/${SelectedOpd.value}`, {
                    headers,
                });
                if (!response.ok) {
                    throw new Error("Gagal memuat data pokok pikiran");
                }
                const payload = await response.json();
                let rows: Usulan[] = [];
                if (Array.isArray(payload)) {
                    rows = payload;
                } else if (Array.isArray(payload.data)) {
                    rows = payload.data;
                } else if (Array.isArray(payload.pokok_pikirans)) {
                    rows = payload.pokok_pikirans;
                } else if (Array.isArray(payload.usulan_pokok_pikiran)) {
                    rows = payload.usulan_pokok_pikiran;
                }
                setPokir(rows);
                setDataNull(rows.length === 0);
            } catch (err) {
                console.error(err);
                setPokir([]);
                setDataNull(true);
                const message =
                    err instanceof Error ? err.message : "Periksa koneksi internet atau database server";
                setErrorMessage(message);
            } finally {
                setLoading(false);
            }
        };

        fetchPokir();
    }, [SelectedOpd, headers, TriggerFetch]);

    const hapusPokir = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pokok-pikirans/${id}`, {
                method: "DELETE",
                headers,
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setPokir(Pokir.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data Pokok Pikiran Berhasil Dihapus", "success", 1000);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    const handleModalNew = () => {
        setModalNew((prev) => !prev);
    }
    const handleModalEdit = (id: string) => {
        setIdEdit(id);
        setModalEdit(true);
    }
    const handleModalEditClose = () => {
        setModalEdit(false);
        setIdEdit('');
    }

    if(!SelectedOpd){
        return (
            <div className="mt-3 rounded-xl shadow-lg border">
                <OpdNull />
                <div className="flex justify-center uppercase text-sm text-gray-600 pb-5">
                    Pilih OPD di header dan klik &ldquo;Aktifkan&rdquo; untuk melihat data pokok pikiran.
                </div>
            </div>
        );
    }   

    if(Loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(errorMessage){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">{errorMessage}</h1>
            </div>
        )
    }

    return(
        <>
            <ButtonSky onClick={handleModalNew}>Tambah Pokok Pikiran</ButtonSky>
            <ModalAddUsulan 
                metode="baru"
                jenis="pokir"
                isOpen={ModalNew}
                onClose={handleModalNew}
                onSuccess={() => setTriggerFetch((prev) => !prev)}
                isMasterData
            />
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Usulan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Alamat</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Uraian</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Kode OPD</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Status</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                    {DataNull ? 
                        <tr>
                            <td className="px-6 py-3 uppercase" colSpan={13}>
                                Data Kosong / Belum Ditambahkan
                            </td>
                        </tr>
                    :
                        Pokir.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4">{data.usulan ? data.usulan : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.alamat ? data.alamat : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.uraian ? data.uraian : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.status ? data.status : "-"}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen 
                                        className="w-full"
                                        onClick={() => handleModalEdit(data.id)}
                                    >
                                        Edit
                                    </ButtonGreen>
                                    <ModalAddUsulan 
                                        jenis="pokir"
                                        metode="lama"
                                        onClose={handleModalEditClose}
                                        isOpen={ModalEdit}
                                        id={IdEdit}
                                        onSuccess={() => setTriggerFetch((prev) => !prev)}
                                        isMasterData
                                    />
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus Usulan Musrenbang yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusPokir(data.id);
                                                }
                                            });
                                        }}
                                    >
                                        Hapus
                                    </ButtonRed>
                                </div>
                            </td>
                        </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;
