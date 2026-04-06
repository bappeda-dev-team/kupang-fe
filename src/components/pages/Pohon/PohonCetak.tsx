import React, { useEffect, useState } from 'react';
import { TbCheck, TbCircleLetterXFilled, TbHourglass } from 'react-icons/tb';
import { getToken } from '@/components/lib/Cookie';
import { TablePohonLaporan, Pagu, ProgramKegiatan } from '@/components/lib/Pohon/Cascading/PohonLaporan';

interface pohon {
    jenis: 'cascading' | 'non_cascading' | 'laporan';
    tema: any;
    closeTrigger: () => void;
}

export const PohonCetak: React.FC<pohon> = ({ jenis, tema, closeTrigger }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);

    return (
        <li key={tema.id}>
            <>
                <div
                    className={`tf-nc tf flex flex-col w-[600px] rounded-lg
                            ${tema.jenis_pohon === "Strategic" && 'bg-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'bg-blue-500'}
                            ${tema.jenis_pohon === "Operational" && 'bg-green-500'}
                            ${tema.jenis_pohon === "Operational N" && 'bg-white'}
                            ${(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'bg-yellow-700'}
                        `}
                >
                    {/* HEADER */}
                    <div
                        className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                                ${(tema.jenis_pohon === "Tematik" || tema.jenis_pohon === "Sub Tematik" || tema.jenis_pohon === "Sub Sub Tematik" || tema.jenis_pohon === "Super Sub Tematik") && "border-black"}
                                ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                ${(tema.jenis_pohon === "Strategic" || tema.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-700'}
                                ${(tema.jenis_pohon === "Tactical" || tema.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                ${(tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                            `}
                    >
                        {tema.jenis_pohon === 'Operational N' ?
                            <h1>Operational {tema.level_pohon - 6}  </h1>
                            :
                            <h1>{tema.jenis_pohon}</h1>
                        }
                    </div>
                    {/* BODY */}
                    <div className="flex flex-col justify-center my-3">
                        {jenis === 'cascading' ?
                            <TableCetakCascading
                                item={tema}
                            />
                            : jenis === 'laporan' ?
                                <>
                                    <TablePohonLaporan
                                        item={tema}
                                        tipe="cetak"
                                    />
                                    <div className="mt-3">
                                        <Pagu 
                                            jenis={tema.jenis_pohon} 
                                            anggaran={tema.total_anggaran || tema.pagu_anggaran}
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <ProgramKegiatan jenis={tema.jenis_pohon} tipe="cetak" />
                                    </div>
                                </>
                                :
                                <TableCetakPohon
                                    item={tema}
                                />
                        }
                    </div>
                </div>
            </>
            <ul>
                {childPohons.map((dahan: any, indexChild: number) => (
                    <React.Fragment key={indexChild}>
                        <PohonCetak
                            jenis={jenis === 'cascading' ? "cascading" : jenis === 'non_cascading' ? "non_cascading" : "laporan"}
                            tema={dahan}
                            closeTrigger={closeTrigger}
                        />
                    </React.Fragment>
                ))}
            </ul>
        </li>
    )
}

export const TableCetakPohon = (props: any) => {
    const id = props.item.id;
    const nama_pohon = props.item.nama_pohon;
    const tema = props.item.tema;
    const keterangan = props.item.keterangan;
    const opd = props.item.perangkat_daerah?.nama_opd;
    const nama_opd = props.item.nama_opd;
    const jenis = props.item.jenis_pohon;
    const indikator = props.item.indikator;
    const status = props.item.status;

    const [OpdAsal, setOpdAsal] = useState<string | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchOpdAsal = async () => {
            try {
                setProses(true);
                const response = await fetch(`${API_URL}/crosscutting_opd/opd-from/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error('kesalahan ketika fetch data opd asal');
                }
                const data = await response.json();
                if (data.code === 500) {
                    setOpdAsal(null);
                } else {
                    setOpdAsal(data.data.nama_opd);
                    // console.log(data.data.nama_opd);
                }
            } catch (err) {
                console.error(err, "gagal fetch data opd asal");
            } finally {
                setProses(false);
            }
        }
        fetchOpdAsal();
    }, [token, id]);

    return (
        <div className='flex flex-col w-full'>
            <table className='w-full'>
                <tbody>
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            {(jenis === 'Tematik') && 'Tematik'}
                            {(jenis === 'Sub Tematik') && 'Sub Tematik'}
                            {(jenis === 'Sub Sub Tematik') && 'Sub Sub Tematik'}
                            {(jenis === 'Super Sub Tematik') && 'Super Sub Tematik'}
                            {(jenis === 'Strategic' || jenis === 'Strategic Pemda' || jenis === 'Strategic Crosscutting') && 'Strategic'}
                            {(jenis === 'Tactical' || jenis === 'Tactical Pemda' || jenis === 'Tactical Crosscutting') && 'Tactical'}
                            {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === 'Operational Crosscutting') && 'Operational'}
                            {(jenis === 'Operational N' || jenis === 'Operational N Crosscutting') && 'Operational N'}
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            {
                                tema ? tema :
                                    nama_pohon ? nama_pohon
                                        : "-"
                            }
                        </td>
                    </tr>
                    {indikator ?
                        indikator.length > 1 ?
                            indikator.map((data: any, index: number) => (
                                <>
                                    <tr key={data.id_indikator}>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                                    `}
                                        >
                                            Indikator {index + 1}
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                        ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                                    `}
                                        >
                                            {data.nama_indikator ? data.nama_indikator : "-"}
                                        </td>
                                    </tr>
                                    {data.targets ?
                                        data.targets.map((data: any) => (
                                            <tr key={data.id_target}>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                                ${jenis === "Strategic" && "border-red-700"}
                                                                ${jenis === "Tactical" && "border-blue-500"}
                                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                            `}
                                                >
                                                    Target/Satuan {index + 1}
                                                </td>
                                                <td
                                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                                ${jenis === "Strategic" && "border-red-700"}
                                                                ${jenis === "Tactical" && "border-blue-500"}
                                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                            `}
                                                >
                                                    {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td
                                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                                ${jenis === "Strategic" && "border-red-700"}
                                                                ${jenis === "Tactical" && "border-blue-500"}
                                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                            `}
                                            >
                                                Target/Satuan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                                ${jenis === "Strategic" && "border-red-700"}
                                                                ${jenis === "Tactical" && "border-blue-500"}
                                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                            `}
                                            >
                                                -
                                            </td>
                                        </tr>
                                    }
                                </>
                            ))
                            :
                            indikator.map((data: any) => (
                                <>
                                    <tr key={data.id_indikator}>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                                    `}
                                        >
                                            Indikator
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                        ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                                    `}
                                        >
                                            {data.nama_indikator ? data.nama_indikator : "-"}
                                        </td>
                                    </tr>
                                    {data.targets ?
                                        data.targets.map((data: any) => (
                                            <tr key={data.id_target}>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                                ${jenis === "Strategic" && "border-red-700"}
                                                                ${jenis === "Tactical" && "border-blue-500"}
                                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                            `}
                                                >
                                                    Target/Satuan
                                                </td>
                                                <td
                                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                                ${jenis === "Strategic" && "border-red-700"}
                                                                ${jenis === "Tactical" && "border-blue-500"}
                                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                            `}
                                                >
                                                    {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td
                                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                                ${jenis === "Strategic" && "border-red-700"}
                                                                ${jenis === "Tactical" && "border-blue-500"}
                                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                            `}
                                            >
                                                Target/Satuan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                                ${jenis === "Strategic" && "border-red-700"}
                                                                ${jenis === "Tactical" && "border-blue-500"}
                                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                            `}
                                            >
                                                -
                                            </td>
                                        </tr>
                                    }
                                </>
                            ))
                        :
                        <>
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                >
                                    Indikator
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                >
                                    -
                                </td>
                            </tr>
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                            `}
                                >
                                    Target/Satuan
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                            `}
                                >
                                    -
                                </td>
                            </tr>
                        </>
                    }
                    {opd &&
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 bg-white text-start
                                            ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                        `}
                            >
                                Perangkat Daerah
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                        `}
                            >
                                {opd ? opd : "-"}
                            </td>
                        </tr>
                    }
                    {nama_opd &&
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 bg-white text-start
                                            ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                        `}
                            >
                                Perangkat Daerah
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                        `}
                            >
                                {nama_opd ? nama_opd : "-"}
                            </td>
                        </tr>
                    }
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-bl-lg
                                        ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                    `}
                        >
                            Keterangan
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                                        ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                    `}
                        >
                            {keterangan ? keterangan : "-"}
                        </td>
                    </tr>
                    {status &&
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                            ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                                        `}
                            >
                                Status
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                                            ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "border-black"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                                        `}
                            >
                                {status === 'menunggu_disetujui' ? (
                                    <div className="flex items-center">
                                        Pending
                                        <TbHourglass />
                                    </div>
                                ) : status === 'crosscutting_disetujui_existing' ? (
                                    <div className="flex items-center text-green-500">
                                        Pilihan Crosscutting
                                        <TbCheck />
                                    </div>
                                ) : status === 'disetujui' ? (
                                    <div className="flex items-center text-green-500">
                                        Disetujui
                                        <TbCheck />
                                    </div>
                                ) : status === 'ditolak' ? (
                                    <div className="flex items-center text-red-500">
                                        Ditolak
                                        <TbCircleLetterXFilled />
                                    </div>
                                ) : (
                                    <span>{status || "-"}</span>
                                )}
                            </td>
                        </tr>
                    }
                    {(status === "crosscutting_disetujui" || status === "crosscutting_disetujui_existing") &&
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 text-start rounded-l-lg ${status === 'crosscutting_disetujui' && 'border-yellow-700'} bg-slate-200
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        `}
                            >
                                OPD Asal
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 text-start rounded-r-lg ${status === 'crosscutting_disetujui' && 'border-yellow-700'} bg-slate-200
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        `}
                            >
                                {Proses ? "Loading.." : OpdAsal ? OpdAsal : "-"}
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}
export const TableCetakCascading = (props: any) => {
    const id = props.item.id;
    const tema = props.item.nama_pohon;
    const jenis = props.item.jenis_pohon;
    const pelaksana = props.item.pelaksana;

    return (
        <div className='flex flex-col w-full'>
            <table className='w-full'>
                <tbody>
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            {(jenis === 'Tematik') && 'Tematik'}
                            {(jenis === 'Sub Tematik') && 'Sub Tematik'}
                            {(jenis === 'Sub Sub Tematik') && 'Sub Sub Tematik'}
                            {(jenis === 'Super Sub Tematik') && 'Super Sub Tematik'}
                            {(jenis === 'Strategic' || jenis === 'Strategic Pemda' || jenis === 'Strategic Crosscutting') && 'Strategic'}
                            {(jenis === 'Tactical' || jenis === 'Tactical Pemda' || jenis === 'Tactical Crosscutting') && 'Tactical'}
                            {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === 'Operational Crosscutting') && 'Operational'}
                            {(jenis === 'Operational N' || jenis === 'Operational N Crosscutting') && 'Operational N'}
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            {tema ? tema : "-"}
                        </td>
                    </tr>
                </tbody>
            </table>
            <table className='mt-2'>
                <tbody >
                    {pelaksana ?
                        pelaksana.length > 1 ?
                            pelaksana.map((item: any, index: number) => (
                                <tr key={item.id_pelaksana}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                                `}
                                    >
                                        Pelaksana {index + 1}
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                                `}
                                    >
                                        {item.nama_pegawai}
                                    </td>
                                </tr>
                            ))
                            :
                            pelaksana.map((data: any) => (
                                <tr key={data.id_pelaksana}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
                                                `}
                                    >
                                        Pelaksana
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"} 
                                                `}
                                    >
                                        {data.nama_pegawai}
                                    </td>
                                </tr>
                            ))
                        :
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
                                        `}
                            >
                                Pelaksana
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}  
                                        `}
                            >
                                -
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}