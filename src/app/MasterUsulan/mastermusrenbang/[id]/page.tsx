'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiHome } from "react-icons/fi";
import { LoadingClip } from "@/components/global/Loading";
import { OpdNull } from "@/components/global/OpdTahunNull";
import { getOpdTahun, getToken } from "@/components/lib/Cookie";

type MusrenbangPerOpd = {
  id: number;
  usulan: string;
  alamat: string;
  uraian: string;
  tahun: string;
  kode_opd: string;
  nama_opd: string;
  status: string;
};

const MasterMusrenbangDetail = () => {
  const params = useParams();
  const token = getToken();
  const [musrenbang, setMusrenbang] = useState<MusrenbangPerOpd[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dataEmpty, setDataEmpty] = useState<boolean>(false);
  const [selectedOpd, setSelectedOpd] = useState<{ code: string; label: string } | null>(null);

  useEffect(() => {
    const { opd } = getOpdTahun();
    if (opd?.value) {
      setSelectedOpd({
        code: opd.value,
        label: opd.label ?? opd.value,
      });
    } else {
      setSelectedOpd(null);
    }
  }, []);

  useEffect(() => {
    if (!selectedOpd) {
      setMusrenbang([]);
      setDataEmpty(false);
      setError(null);
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setDataEmpty(false);
      try {
        const response = await fetch(`${API_URL}/musrenbangs/opd/${selectedOpd.code}`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Tidak dapat memuat data musrenbang");
        }
        const data: MusrenbangPerOpd[] = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          setMusrenbang([]);
          setDataEmpty(true);
        } else {
          setMusrenbang(data);
          setDataEmpty(false);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat usulan; periksa koneksi atau pilih OPD lain");
        setMusrenbang([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOpd, token]);

  const activeCode = selectedOpd ? `${selectedOpd.code} (${selectedOpd.label})` : params.id;

  if (!selectedOpd) {
    return (
      <div className="mt-3 rounded-xl shadow-lg border">
        <OpdNull />
        <div className="flex justify-center uppercase text-sm text-gray-600 pb-5">
          Pilih OPD di header, lalu klik “Aktifkan” untuk menampilkan data musrenbang.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <a href="/" className="mr-1">
          <FiHome />
        </a>
        <p className="mr-1">/ Perencanaan OPD</p>
        <p className="mr-1">/ Master Usulan Musrenbang</p>
      </div>
      <div className="mt-3 rounded-xl shadow-lg border">
        <div className="flex flex-col gap-2 border-b px-5 py-5">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h1 className="uppercase font-bold text-lg">Master Usulan Musrenbang</h1>
              <p className="text-sm text-gray-500">{`OPD aktif: ${activeCode}`}</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="border p-5">
            <LoadingClip />
          </div>
        )}

        {error && (
          <div className="border p-5">
            <h1 className="text-red-500">{error}</h1>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-auto m-2 rounded-t-xl border">
            <table className="w-full">
              <thead>
                <tr className="bg-[#99CEF5] text-white">
                  <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                  <th className="border-r border-b px-6 py-3 min-w-[150px]">Usulan</th>
                  <th className="border-r border-b px-6 py-3 min-w-[200px]">Uraian</th>
                  <th className="border-r border-b px-6 py-3 min-w-[150px]">Alamat</th>
                  <th className="border-r border-b px-6 py-3 min-w-[120px]">Tahun</th>
                  <th className="border-r border-b px-6 py-3 min-w-[180px]">OPD</th>
                  <th className="border-r border-b px-6 py-3 min-w-[120px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {dataEmpty ? (
                  <tr>
                    <td className="px-6 py-3 uppercase text-center" colSpan={7}>
                      Data kosong / belum ada usulan
                    </td>
                  </tr>
                ) : (
                  musrenbang.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                      <td className="border-r border-b px-6 py-4">{item.usulan || "-"}</td>
                      <td className="border-r border-b px-6 py-4">{item.uraian || "-"}</td>
                      <td className="border-r border-b px-6 py-4">{item.alamat || "-"}</td>
                      <td className="border-r border-b px-6 py-4 text-center">{item.tahun || "-"}</td>
                      <td className="border-r border-b px-6 py-4">
                        {item.kode_opd ? `${item.nama_opd || ""} (${item.kode_opd})` : "-"}
                      </td>
                      <td className="border-r border-b px-6 py-4 text-center">{item.status || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MasterMusrenbangDetail;
