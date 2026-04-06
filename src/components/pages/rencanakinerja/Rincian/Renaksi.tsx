'use client'

import { ButtonSky, ButtonSkyBorder, ButtonRedBorder } from "@/components/global/Button";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";
import { ModalRenaksi } from "../ModalRenaksi";
import { ModalTahapan } from "../ModalTahapan";
import React, { useState, useEffect } from "react";
import { getUser, getToken, getOpdTahun } from "@/components/lib/Cookie";
import { LoadingSync } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";

interface id {
   id: string;
}

interface RencanaAksi {
   id: string;
   rekin_id: string;
   kode_opd: string;
   urutan: number;
   nama_rencana_aksi: string;
   pelaksanaan: Pelaksanaan[];
   jumlah_bobot: number;
}
interface Pelaksanaan {
   id: string;
   rencana_aksi_id: string;
   bulan: number;
   bobot: number;
}
interface TotalPerBulan {
   bulan: number;
   total_bobot: number;
}

const Renaksi: React.FC<id> = ({ id }) => {

   const [User, setUser] = useState<any>(null);
   const token = getToken();

   const [Renaksi, setRenaksi] = useState<RencanaAksi[]>([]);
   const [TotalPerBulan, setTotalPerBulan] = useState<TotalPerBulan[]>([]);
   const [TotalAll, setTotalAll] = useState<number>(0);
   const [TotalWaktu, setTotalWaktu] = useState<number>(0);

   const [Loading, setLoading] = useState<boolean>(false);
   const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);
   const [DataNull, setDataNull] = useState<boolean>(false);

   const [isOpenNewRenaksi, setIsOpenNewRenaksi] = useState<boolean>(false);
   const [isOpenEditRenaksi, setIsOpenEditRenaksi] = useState<boolean>(false);
   const [IdRenaksi, setIdRenaksi] = useState<string>('');

   const [isOpenNewTahapan, setIsOpenNewTahapan] = useState<boolean>(false);
   const [isOpenEditTahapan, setIsOpenEditTahapan] = useState<boolean>(false);
   const [IdPelaksanaan, setIdPelaksanaan] = useState<string>('');
   const [NamaRenaksi, setNamaRenaksi] = useState<string>('');
   const [Bulan, setBulan] = useState<number | null>(null);

   useEffect(() => {
      const fetchUser = getUser();
      if (fetchUser) {
         setUser(fetchUser.user);
      }
   }, []);

   useEffect(() => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const fetchRenaksi = async () => {
         setLoading(true);
         try {
            const response = await fetch(`${API_URL}/rencana_kinerja/${id}/pegawai/${User?.nip}/input_rincian_kak`, {
               headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
               },
            });
            const result = await response.json();
            const hasil = result.rencana_kinerja;
            if (hasil) {
               const data = hasil.find((item: any) => item.rencana_aksis);
               if (data.rencana_aksis.rencana_aksi == null) {
                  setDataNull(true);
                  setRenaksi([]);
               } else {
                  setDataNull(false);
                  setRenaksi(data.rencana_aksis.rencana_aksi);
                  setTotalPerBulan(data.rencana_aksis.total_per_bulan);
                  setTotalAll(data.rencana_aksis.total_keseluruhan);
                  setTotalWaktu(data.rencana_aksis.waktu_dibutuhkan);
               }
            } else {
               setDataNull(true);
               setRenaksi([]);
               setTotalPerBulan([]);
               setTotalAll(0);
               setTotalWaktu(0);
            }
         } catch (err) {
            console.log(err)
         } finally {
            setLoading(false);
         }
      };
      if (User?.roles != undefined) {
         fetchRenaksi();
      }
   }, [id, User, token, fetchTrigger]);

   const handleModalNewRenaksi = () => {
      if (isOpenNewRenaksi) {
         setIsOpenNewRenaksi(false);
      } else {
         setIsOpenNewRenaksi(true);
      }
   }
   const handleModalEditRenaksi = (id: string) => {
      if (isOpenEditRenaksi) {
         setIsOpenEditRenaksi(false);
         setIdRenaksi('');
      } else {
         setIsOpenEditRenaksi(true);
         setIdRenaksi(id);
      }
   }
   const handleModalNewTahapan = (nama: string, bulan: number | null, renaksi_id: string) => {
      if (isOpenNewTahapan) {
         setIsOpenNewTahapan(false);
         setNamaRenaksi('');
         setIdRenaksi('')
         setBulan(null);
      } else {
         setNamaRenaksi(nama);
         setIsOpenNewTahapan(true);
         setIdRenaksi(renaksi_id);
         setBulan(bulan);
      }
   }
   const handleModalEditTahapan = (id: string, nama: string, bulan: number | null, renaksi_id: string) => {
      if (isOpenEditTahapan) {
         setIsOpenEditTahapan(false);
         setIdPelaksanaan('');
         setNamaRenaksi('');
         setIdRenaksi('');
         setBulan(null);
      } else {
         setIsOpenEditTahapan(true);
         setIdPelaksanaan(id);
         setNamaRenaksi(nama);
         setIdRenaksi(renaksi_id)
         setBulan(bulan);
      }
   }

   const hapusRenaksi = async (id: any) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      try {
         const response = await fetch(`${API_URL}/rencana_aksi/delete/rencanaaksi/${id}`, {
            method: "DELETE",
            headers: {
               Authorization: `${token}`,
               'Content-Type': 'application/json',
            },
         })
         if (!response.ok) {
            alert("cant fetch data")
         }
         setRenaksi(Renaksi.filter((data) => (data.id !== id)))
         AlertNotification("Berhasil", "Tahapan Rencana Aksi Berhasil Dihapus", "success", 1000);
         setFetchTrigger((prev) => !prev);
      } catch (err) {
         AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
      }
   };

   if (Loading) {
      return (
         <>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
               <div className="flex flex-wrap justify-between items-center">
                  <h1 className="font-bold">Rencana Aksi</h1>
               </div>
            </div>
            <div className="mt-3 rounded-t-xl border px-5 py-3">
               <LoadingSync />
            </div>
         </>
      );
   }

   return (
      <>
         {/* rencana aksi */}
         <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
            <div className="flex flex-wrap justify-between items-center">
               <h1 className="font-bold">Rencana Aksi</h1>
               <div className="flex flex-wrap">
                  <ButtonSky className="m-1" onClick={handleModalNewRenaksi}>
                     <TbCirclePlus className="mr-1"/>
                     Tambah Tahapan
                  </ButtonSky>
               </div>
            </div>
            <div className="overflow-auto mt-3 rounded-t-xl border">
               <table className='w-full'>
                  <thead>
                     <tr>
                        <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                        <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Tahapan kerja</td>
                        <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px] text-center">Aksi</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">1</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">2</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">3</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">4</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">5</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">6</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">7</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">8</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">9</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">10</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">11</td>
                        <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] text-center">12</td>
                        <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[20px] text-center text-white bg-emerald-500">Total</td>
                        <td rowSpan={2} className="border-b px-6 py-3 min-w-[200px]">Keterangan</td>
                     </tr>
                     <tr className="bg-emerald-500 text-white">
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                        <td colSpan={3} className="border-r border-b px-6 py-1 text-xs min-w-[20px] max-h-[20px] text-center">Total</td>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {DataNull ? (
                        <tr>
                           <td className="px-6 py-3" colSpan={5}>
                              Data Kosong / Belum Ditambahkan
                           </td>
                        </tr>
                     ) : (
                        Renaksi.map((data, index) => (
                           <tr key={data.id}>
                              <td className="border-r border-b px-6 py-4">{index + 1}</td>
                              <td className="border-r border-b px-6 py-4">{data.nama_rencana_aksi || "-"}</td>
                              <td className="border-r border-b px-6 py-4">
                                 <div className="flex flex-col justify-center items-center gap-2">
                                    <ButtonSkyBorder className="w-full flex items-center gap-1" onClick={() => handleModalEditRenaksi(data.id)}>
                                       <TbPencil />
                                       Edit
                                    </ButtonSkyBorder>
                                    <ButtonRedBorder
                                       className="w-full flex items-center gap-1"
                                       onClick={() => {
                                          AlertQuestion("Hapus?", "Hapus Tahapan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                             if (result.isConfirmed) {
                                                hapusRenaksi(data.id);
                                             }
                                          });
                                       }}
                                    >
                                       <TbTrash />
                                       Hapus
                                    </ButtonRedBorder>
                                 </div>
                              </td>
                              {/* BOBOT PELAKSANAAN */}
                              {data.pelaksanaan.map((p: Pelaksanaan, index: number) => (
                                 <td colSpan={3} key={p.id && p.id.trim() !== "" ? p.id : index} className="border-r border-b px-6 py-4">
                                    <button
                                       className="py-1 px-2 rounded-full hover:bg-emerald-300 hover:text-white cursor-pointer"
                                       onClick={() => {
                                          if (p.bobot === 0 || p.bobot === null) {
                                             handleModalNewTahapan(data.nama_rencana_aksi, p.bulan, data.id);
                                          } else {
                                             handleModalEditTahapan(p.id, data.nama_rencana_aksi, p.bulan, data.id);
                                          }
                                       }}
                                    >
                                       {p.bobot === 0 ? "+" : p.bobot}
                                    </button>
                                 </td>
                              ))}
                              {/* TOTAL TAHAPAN */}
                              <td className="border-r border-b px-6 py-4 text-white bg-emerald-500 text-center">
                                 {data.jumlah_bobot}
                              </td>
                              {/* KETERANGAN */}
                              <td colSpan={3} className="border-r border-b px-6 py-4">
                                 -
                              </td>
                           </tr>
                        ))
                     )}
                     {/* TOTAL BULAN */}
                     <tr className="bg-emerald-500 text-white">
                        <td colSpan={3} className="border-r border-y px-6 py-1">
                           Total
                        </td>
                        {TotalPerBulan.map((total: TotalPerBulan) => (
                           <td key={total.bulan} colSpan={3} className="border-r border-y px-6 py-1 text-center">
                              {total.total_bobot}
                           </td>
                        ))}
                        <td colSpan={DataNull ? 40 : 0} className={`border-r border-y px-6 py-1 text-center ${TotalAll === 100 ? 'bg-emerald-500' : 'bg-red-500'}`}>
                           {TotalAll}
                        </td>
                     </tr>
                  </tbody>
               </table>
               {/* MODAL RENAKSI TAMBAH DATA */}
               <ModalRenaksi
                  metode="baru"
                  rekin_id={id}
                  isOpen={isOpenNewRenaksi}
                  onClose={handleModalNewRenaksi}
                  onSuccess={() => setFetchTrigger((prev) => !prev)}
               />
               {/* MODAL RENAKSI EDIT DATA */}
               <ModalRenaksi
                  metode="lama"
                  id={IdRenaksi}
                  isOpen={isOpenEditRenaksi}
                  onClose={() => handleModalEditRenaksi('')}
                  onSuccess={() => setFetchTrigger((prev) => !prev)}
               />
               {/* MODAL TAHAPAN TAMBAH DATA */}
               <ModalTahapan
                  metode="baru"
                  renaksi_id={IdRenaksi}
                  nama_renaksi={NamaRenaksi}
                  isOpen={isOpenNewTahapan}
                  bulan={Bulan}
                  total_bobot={TotalAll}
                  onClose={() => handleModalNewTahapan('', null, '')}
                  onSuccess={() => setFetchTrigger((prev) => !prev)}
               />
               {/* MODAL TAHAPAN EDIT DATA */}
               <ModalTahapan
                  metode="lama"
                  renaksi_id={IdRenaksi}
                  id={IdPelaksanaan}
                  nama_renaksi={NamaRenaksi}
                  isOpen={isOpenEditTahapan}
                  bulan={Bulan}
                  total_bobot={TotalAll}
                  onClose={() => handleModalEditTahapan('', '', null, '')}
                  onSuccess={() => setFetchTrigger((prev) => !prev)}
               />
            </div>
            <div className="flex flex-wrap gap-1">
               <h1 className="my-2">waktu yang dibutuhkan : </h1>
               <h1 className="my-2 font-bold text-emerald-500">{TotalWaktu} Bulan</h1>
            </div>
         </div>
      </>
   )
}

export default Renaksi;