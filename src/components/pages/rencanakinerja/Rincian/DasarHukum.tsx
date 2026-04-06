'use client'

import { ButtonSky, ButtonSkyBorder, ButtonRedBorder } from "@/components/global/Button";
import { ModalDasarHukumAdd, ModalDasarHukumEdit } from "../ModalDasarHukum";
import { useState, useEffect } from "react";
import { getToken, getUser } from "@/components/lib/Cookie";
import { LoadingSync } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";

interface table {
    id: string;
    nip: string;
}
interface dasar_hukum {
    id : string;
    peraturan_terkait : string;
    uraian : string;
    urutan: number;
}

const DasarHukum: React.FC<table> = ({ id, nip }) => {

    const [isOpenNewDasarHukum, setIsOpenNewDasarHukum] = useState<boolean>(false);
    const [isOpenEditDasarHukum, setIsOpenEditDasarHukum] = useState<boolean>(false);
    const [IdEdit, setIdEdit] = useState<string>('');
    const [dasarHukum, setDasarHukum] = useState<dasar_hukum[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchDasarHukum = async() => {
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
                    const data = hasil.find((item: any) => item.dasar_hukum);
                    if(data == null){
                        setDataNull(true);
                        setDasarHukum([]);
                    } else {
                        setDataNull(false);
                        setDasarHukum(data.dasar_hukum);
                    }
                } else {
                    setDataNull(true);
                    setDasarHukum([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if(nip != undefined){    
            fetchDasarHukum();
        }
    },[token, id, nip, isOpenNewDasarHukum, isOpenEditDasarHukum, Deleted]);

    const handleModalNewDasarHukum = () => {
        if(isOpenNewDasarHukum){
            setIsOpenNewDasarHukum(false);
        } else {
            setIsOpenNewDasarHukum(true);
        }
    }
    const handleModalEditDasarHukum = (id: string) => {
        if(isOpenEditDasarHukum){
            setIsOpenEditDasarHukum(false);
            setIdEdit('');
        } else {
            setIdEdit(id);
            setIsOpenEditDasarHukum(true);
        }
    }

    const hapusDasarHukum = async(id_ds: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/dasar_hukum/delete/${id_ds}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("response !ok ketika gagal hapus dasar hukum");
            }
            AlertNotification("Berhasil", "Dasar Hukum Berhasil Dihapus", "success", 1000);
            setDeleted((prev) => !prev);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if(Loading){
        return(
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Dasar Hukum</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return(
        <>
            {/* Dasar Hukum */}
            <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                <h1 className="font-bold">Dasar Hukum</h1>
                <ButtonSky onClick={handleModalNewDasarHukum}>
                    <TbCirclePlus className="mr-1"/>
                    Tambah Dasar Hukum
                </ButtonSky>
                <ModalDasarHukumAdd 
                    onClose={handleModalNewDasarHukum} 
                    isOpen={isOpenNewDasarHukum}
                    id_rekin={id}
                />
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <div className="overflow-auto m-2 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-300 border border-gray-300">
                                <td className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Peraturan Terkait</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Uraian</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                            </tr>
                        </thead>
                        <tbody className='border'>
                            {dataNull ? (
                                <tr>
                                    <td className="px-6 py-3" colSpan={4}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                            ) : (
                                dasarHukum.map((data, index) => (
                                    <tr key={data.id}>
                                        <td className="border px-6 py-3">{index + 1}</td>
                                        <td className="border px-6 py-3">{data.peraturan_terkait}</td>
                                        <td className="border px-6 py-3">{data.uraian}</td>
                                        <td className="border px-6 py-3">
                                            <div className="flex flex-col justify-center items-center gap-2">
                                                <ButtonSkyBorder className="w-full" onClick={() => handleModalEditDasarHukum(data.id)}>
                                                    <TbPencil className="mr-1"/>
                                                    Edit
                                                </ButtonSkyBorder>
                                                <ModalDasarHukumEdit
                                                    onClose={() => handleModalEditDasarHukum('')} 
                                                    isOpen={isOpenEditDasarHukum}
                                                    id_rekin={id}
                                                    id={IdEdit}
                                                />
                                                <ButtonRedBorder
                                                    className="w-full"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus Dasar Hukum yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                            if(result.isConfirmed){
                                                                hapusDasarHukum(data.id);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <TbTrash className="mr-1"/>
                                                    Hapus
                                                </ButtonRedBorder>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default DasarHukum;