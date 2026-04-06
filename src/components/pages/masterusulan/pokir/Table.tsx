'use client'

import { ButtonSky, ButtonGreen, ButtonRed } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
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
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPokir = async() => {
            setLoading(true)
            try{
                const response = await fetch(`${API_URL}/usulan_pokok_pikiran/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                      },
                });
                const result = await response.json();
                const data = result.usulan_pokok_pikiran;
                if(data.length == 0){
                    setDataNull(true);
                    setPokir([]);
                } else if(result.code === 401){
                    setError(true);
                } else {
                    setDataNull(false);
                    setPokir(data);
                    setError(false);
                }
                setPokir(data);
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        fetchPokir();
    }, [token, TriggerFetch]);

    const hapusPokir = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/usulan_pokok_pikiran/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                  },
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
        setModalEdit(true);
        setIdEdit(id);
    }
    const handleModalEditClose = () => {
        setModalEdit(false);
        setIdEdit('');
    }

    if(Loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(Error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
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