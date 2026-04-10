'use client'

import { ButtonSky, ButtonGreen, ButtonRed } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useState, useEffect } from "react";
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
  kode_opd: string;
  nama_opd: string;
  status: string;
}

const Table = () => {
  const [musrenbang, setMusrenbang] = useState<Usulan[]>([]);
  const [ModalNew, setModalNew] = useState<boolean>(false);
  const [TriggerFetch, setTriggerFetch] = useState<boolean>(false);
  const [ModalEdit, setModalEdit] = useState<boolean>(false);
  const [IdEdit, setIdEdit] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [DataNull, setDataNull] = useState<boolean>(false);
  const [SelectedOpd, setSelectedOpd] = useState<{ value: string; label?: string } | null>(null);
  const token = getToken();

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
      setMusrenbang([]);
      setDataNull(false);
      setErrorMessage(null);
      setLoading(false);
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const fetchMusrenbang = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`${API_URL}/musrenbangs/opd/${SelectedOpd.value}`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Gagal memuat data musrenbang");
        }
        const payload = await response.json();
        let rows: Usulan[] = [];
        if (Array.isArray(payload)) {
          rows = payload;
        } else if (Array.isArray(payload.data)) {
          rows = payload.data;
        }
        setMusrenbang(rows);
        setDataNull(rows.length === 0);
      } catch (err) {
        console.error(err);
        setMusrenbang([]);
        setDataNull(true);
        setErrorMessage("Periksa koneksi atau pilih OPD lain, lalu klik Aktifkan");
      } finally {
        setLoading(false);
      }
    };
    fetchMusrenbang();
  }, [SelectedOpd, token, TriggerFetch]);

  const hapusMusrenbang = async (id: any) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${API_URL}/musrenbangs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        alert("cant fetch data");
      }
      setMusrenbang((prev) => prev.filter((data) => data.id !== id));
      AlertNotification("Berhasil", "Data Musrenbang Berhasil Dihapus", "success", 1000);
    } catch (err) {
      AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
    }
  };

  const handleModalNew = () => {
    setModalNew((prev) => !prev);
  };
  const handleModalEdit = (id: string) => {
    setModalEdit(true);
    setIdEdit(id);
  };
  const handleModalEditClose = () => {
    setModalEdit(false);
    setIdEdit("");
  };

  if (!SelectedOpd) {
    return (
      <div className="mt-3 rounded-xl shadow-lg border">
        <OpdNull />
        <div className="flex justify-center uppercase text-sm text-gray-600 pb-5">
          Pilih OPD di header dan klik “Aktifkan” untuk menampilkan data musrenbang.
        </div>
      </div>
    );
  }

  if (Loading) {
    return (
      <div className="border p-5 rounded-xl shadow-xl">
        <LoadingClip />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="border p-5 rounded-xl shadow-xl">
        <h1 className="text-red-500 mx-5 py-5">{errorMessage}</h1>
      </div>
    );
  }

  return (
    <>
      <ButtonSky onClick={handleModalNew}>tambah musrenbang</ButtonSky>
      <ModalAddUsulan
        metode="baru"
        jenis="musrenbang"
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
              <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode OPD</th>
              <th className="border-r border-b px-6 py-3 min-w-[200px]">Status</th>
              <th className="border-l border-b px-6 py-3 min-w-[200px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {DataNull ? (
              <tr>
                <td className="px-6 py-3 uppercase" colSpan={7}>
                  Data Kosong / Belum Ditambahkan
                </td>
              </tr>
            ) : (
              musrenbang.map((data, index) => (
                <tr key={data.id}>
                  <td className="border-r border-b px-6 py-4">{index + 1}</td>
                  <td className="border-r border-b px-6 py-4">{data.usulan || "-"}</td>
                  <td className="border-r border-b px-6 py-4">{data.alamat || "-"}</td>
                  <td className="border-r border-b px-6 py-4">{data.uraian || "-"}</td>
                  <td className="border-r border-b px-6 py-4 text-center">{data.kode_opd || "-"}</td>
                  <td className="border-r border-b px-6 py-4">{data.status || "-"}</td>
                  <td className="border-r border-b px-6 py-4">
                    <div className="flex flex-col jutify-center items-center gap-2">
                      <ButtonGreen className="w-full" onClick={() => handleModalEdit(data.id)}>
                        Edit
                      </ButtonGreen>
                      <ModalAddUsulan
                        jenis="musrenbang"
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
                          AlertQuestion("Hapus?", "Hapus Usulan Musrenbang yang dipilih?", "question", "Hapus", "Batal").then(
                            (result) => {
                              if (result.isConfirmed) {
                                hapusMusrenbang(data.id);
                              }
                            }
                          );
                        }}
                      >
                        Hapus
                      </ButtonRed>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
