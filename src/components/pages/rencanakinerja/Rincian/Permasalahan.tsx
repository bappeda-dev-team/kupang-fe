'use client'

import { ButtonSky, ButtonSkyBorder, ButtonRedBorder } from "@/components/global/Button";
import { ModalPermasalahanAdd, ModalPermasalahanEdit } from "../ModalPermasalahan";
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
    Id: number;
    RekinId: string;
    Permasalahan: string;
    PenyebabInternal: string;
    PenyebabEksternal: string;
    JenisPermasalahan: string;
}

const Permasalahan: React.FC<table> = ({ id, nip }) => {

    const [isOpenNewDasarHukum, setIsOpenNewDasarHukum] = useState<boolean>(false);
    const [isOpenEditDasarHukum, setIsOpenEditDasarHukum] = useState<boolean>(false);
    const [IdEdit, setIdEdit] = useState<number>(0);
    const [Permasalahan, setPermasalahan] = useState<dasar_hukum[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

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
                        const data = hasil.find((item: any) => item.permasalahan);
                        ;if(data == null){
                            setDataNull(true);
                            setPermasalahan([]);
                        } else {
                            setDataNull(false);
                            setPermasalahan(data.permasalahan);
                        }
                    } else {
                        setDataNull(true);
                        setPermasalahan([]);
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
        },[id, nip, token, isOpenEditDasarHukum, isOpenNewDasarHukum]);

    const handleModalNewDasarHukum = () => {
        if(isOpenNewDasarHukum){
            setIsOpenNewDasarHukum(false);
        } else {
            setIsOpenNewDasarHukum(true);
        }
    }
    const handleModalEditDasarHukum = (id: number) => {
        if(isOpenEditDasarHukum){
            setIsOpenEditDasarHukum(false);
            setIdEdit(0);
        } else {
            setIdEdit(id);
            setIsOpenEditDasarHukum(true);
        }
    }

    const hapusPermasalahan = async(id_p: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/permasalahan_rekin/delete/${id_p}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("response !ok ketika gagal hapus Permasalahan");
            }
            AlertNotification("Berhasil", "Permasalahan Berhasil Dihapus", "success", 1000);
            setDeleted((prev) => !prev);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if(Loading){
        return(
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Permasalahan</h1>
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
                <h1 className="font-bold">Permasalahan</h1>
                <ButtonSky onClick={handleModalNewDasarHukum}>
                    <TbCirclePlus className="mr-1"/>
                    Tambah Permasalahan
                </ButtonSky>
                <ModalPermasalahanAdd 
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
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Permasalahan</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Penyebab Internal</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Penyebab Eksternal</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Jenis Permasalahan</td>
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
                                Permasalahan.map((data, index) => (
                                    <tr key={data.Id}>
                                        <td className="border px-6 py-3">{index + 1}</td>
                                        <td className="border px-6 py-3">{data.Permasalahan}</td>
                                        <td className="border px-6 py-3">{data.PenyebabInternal}</td>
                                        <td className="border px-6 py-3">{data.PenyebabEksternal}</td>
                                        <td className="border px-6 py-3">{data.JenisPermasalahan}</td>
                                        <td className="border px-6 py-3">
                                            <div className="flex flex-col justify-center items-center gap-2">
                                                <ButtonSkyBorder className="w-full" onClick={() => handleModalEditDasarHukum(data.Id)}>
                                                    <TbPencil className="mr-1"/>
                                                    Edit
                                                </ButtonSkyBorder>
                                                <ModalPermasalahanEdit
                                                    onClose={() => handleModalEditDasarHukum(0)} 
                                                    isOpen={isOpenEditDasarHukum}
                                                    id_rekin={id}
                                                    id={IdEdit}
                                                />
                                                <ButtonRedBorder
                                                    className="w-full"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus Permasalahan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                            if(result.isConfirmed){
                                                                hapusPermasalahan(data.Id);
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

export default Permasalahan;