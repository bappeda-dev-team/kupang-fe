'use client'

import { ButtonSky, ButtonSkyBorder, ButtonRedBorder } from "@/components/global/Button";
import { ModalAddGambaranUmum } from "../ModalGambaranUmum";
import { useState, useEffect } from "react";
import { LoadingSync } from "@/components/global/Loading";
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { ModalEditGambaranUmum } from "../ModalGambaranUmum";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";

interface table {
    id: string;
    nip: string;
}
interface gambaran_umum {
    id : string;
    gambaran_umum : string;
}

const GambaranUmum: React.FC<table> = ({ id, nip }) => {

    const [isOpenNewGambaranUmum, setIsOpenNewGambaranUmum] = useState<boolean>(false);
    const [isOpenEditGambaranUmum, setIsOpenEditGambaranUmum] = useState<boolean>(false);
    const [IdEdit, setIdEdit] = useState<string>('');
    const [gambaran, setGambaran] = useState<gambaran_umum[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();;

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchGambaran = async() => {
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
                    const data = hasil.find((item: any) => item.gambaran_umum);
                    if(data == null){
                        setDataNull(true);
                        setGambaran([]);
                    } else {
                        setDataNull(false);
                        setGambaran(data.gambaran_umum);
                    }
                } else {
                    setDataNull(true);
                    setGambaran([]);
                }
            } catch(err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        if(nip != undefined){
            fetchGambaran();
        }
    },[id, nip, token, Deleted, isOpenEditGambaranUmum, isOpenNewGambaranUmum]);

    const handleModalNewGambaranUmum = () => {
        if(isOpenNewGambaranUmum){
            setIsOpenNewGambaranUmum(false);
        } else {
            setIsOpenNewGambaranUmum(true);
        }
    }
    const handleModalEditgambaranUmum = (id: string) => {
        if(isOpenEditGambaranUmum){
            setIsOpenEditGambaranUmum(false);
            setIdEdit('');
        } else {
            setIdEdit(id);
            setIsOpenEditGambaranUmum(true);
        }
    }

    const hapusGambaranUmum = async(id_gu: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/gambaran_umum/delete/${id_gu}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Gambaran Umum Berhasil Dihapus", "success", 1000);
            setDeleted((prev) => !prev);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if(Loading){
        return(
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Gambaran Umum</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return(
        <>
            {/* gambaran umum */}
            <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                <h1 className="font-bold">Gambaran Umum</h1>
                <ButtonSky onClick={handleModalNewGambaranUmum}>
                    <TbCirclePlus className="mr-1"/>
                    Tambah Gambaran Umum
                </ButtonSky>
                <ModalAddGambaranUmum 
                    onClose={handleModalNewGambaranUmum} 
                    isOpen={isOpenNewGambaranUmum}
                    id_rekin={id} 
                />
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <div className="overflow-auto m-2 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-300 border border-gray-300">
                                <td className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                                <td className="border-r border-b px-6 py-3 min-w-[500px]">Gambaran Umum</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                            </tr>
                        </thead>
                        <tbody className='border'>
                            {dataNull ? 
                                <tr>
                                    <td className="px-6 py-3" colSpan={3}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                            :
                                gambaran.map((data, index) => (
                                    <tr key={data.id}>
                                        <td className="border px-6 py-3">{index + 1}</td>
                                        <td className="border px-6 py-3">{data.gambaran_umum}</td>
                                        <td className="border px-6 py-3">
                                            <div className="flex flex-col justify-center items-center gap-2">
                                                <ButtonSkyBorder className="w-full" onClick={() => handleModalEditgambaranUmum(data.id)}>
                                                    <TbPencil className="mr-1"/>
                                                    Edit
                                                </ButtonSkyBorder>
                                                <ModalEditGambaranUmum
                                                    onClose={() => handleModalEditgambaranUmum('')} 
                                                    isOpen={isOpenEditGambaranUmum}
                                                    id_rekin={id}
                                                    id={IdEdit}
                                                />
                                                <ButtonRedBorder 
                                                    className="w-full"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus Gambaran Umum yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                            if(result.isConfirmed){
                                                                hapusGambaranUmum(data.id);
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
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default GambaranUmum;