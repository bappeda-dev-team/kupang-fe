import type { PkOpdResponse } from "./pk-opd-types";
import type { RekinOption } from "./page"

const LEVEL_LABEL: Record<number, string> = {
    4: "Strategic",
    5: "Tactical",
    6: "Operational",
    7: "Operational N",
}

function translateLevel(level: number): string {
    return LEVEL_LABEL[level] ?? "-"
}

type TablePkProps = {
    data: PkOpdResponse
    search: string
    onSelectAtasan: (args: {
        nipBawahan: string
    }) => void
    onSelectPk: (args: {
        pk: any
        levelPk: number
    }) => void
    onPreviewPk: (nipBawahan: string) => void
    roleUser: string[]
    getCandidates: (pk: any, levelPk: number) => RekinOption[]
}

export const TablePk = ({
    data,
    search,
    onSelectAtasan,
    onSelectPk,
    onPreviewPk,
    roleUser,
    getCandidates
}: TablePkProps) => {
    let rowNo = 1;
    return (
        <table className="w-full border border-slate-300">
            <thead>
                <tr className="bg-blue-600 text-white text-sm">
                    <th rowSpan={2} className="border p-3 w-[60px]">
                        No
                    </th>
                    <th rowSpan={2} className="border p-3">
                        Level
                    </th>
                    <th rowSpan={2} className="border p-3">
                        Nama ASN
                    </th>
                    <th colSpan={2} className="border p-3">
                        Perjanjian Kinerja
                    </th>
                    <th rowSpan={2} className="border p-3">
                        Nama Atasan
                    </th>
                    <th rowSpan={2} className="border p-3">
                        Aksi
                    </th>
                </tr>
                <tr className="bg-blue-600 text-white text-sm">
                    <th className="border p-3">Rencana Kinerja</th>
                    <th className="border p-3">Rencana Kinerja Atasan</th>
                </tr>
            </thead>
            <tbody>
                {data.pk_item.length > 0 ? (
                    data.pk_item.map((level) =>
                        level.pegawais
                            .filter((pegawai) =>
                                pegawai.nama_pegawai
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                            )
                            .map((pegawai) => {
                                const pks = pegawai.pks.length > 0 ? pegawai.pks : [null]
                                const totalPk = pks.length

                                const PkLengkap =
                                    pegawai.pks.length > 0 &&
                                    pegawai.pks.every((item) =>
                                        item.nip_atasan?.trim() !== ""
                                    )

                                return pks.map((pk, idx) => (
                                    <tr
                                        key={`${pegawai.nip}-${pk?.id_rekin_pemilik_pk || idx}`}
                                    >
                                        {/* NO */}
                                        {idx === 0 && (
                                            <td
                                                rowSpan={totalPk}
                                                className="border p-3 text-center align-top font-semibold"
                                            >
                                                {rowNo++}
                                            </td>
                                        )}

                                        {/* LEVEL */}
                                        {idx === 0 && (
                                            <td
                                                rowSpan={totalPk}
                                                className="border p-3 text-center align-top w-[100px]"
                                            >
                                                {translateLevel(level.level_pk)}
                                            </td>
                                        )}

                                        {/* NAMA ASN */}
                                        {idx === 0 && (
                                            <td
                                                rowSpan={totalPk}
                                                className="border p-3 align-top text-base w-[200px]"
                                            >
                                                <div className="pb-3 mb-3 gap-5 flex flex-col">
                                                    <p className="text-base text-slate-800">
                                                        {pegawai.nama_pegawai}
                                                    </p>

                                                    <p className="text-sm text-slate-600">
                                                        {pegawai.nip}
                                                    </p>
                                                </div>
                                            </td>
                                        )}

                                        {/* REKIN PEMILIK */}
                                        <td className="border w-[400px]">
                                            <p className="px-3 py-5 text-sm font-light">
                                                {pk?.rekin_pemilik_pk || "-"}
                                            </p>
                                        </td>

                                        {/* REKIN ATASAN */}
                                        {/* REKIN ATASAN */}
                                        <td className="border p-3 w-[400px]">
                                            <div className="flex flex-col gap-4">
                                                {pk?.rekin_atasan && (
                                                    <div className="pb-3 mb-3 border-b border-blue-700 gap-5 flex flex-col">
                                                        <p className="text-base text-slate-800">
                                                            {pk.rekin_atasan}
                                                        </p>

                                                        <p className="text-sm text-slate-600">
                                                            ({pk.nama_atasan || "-"} - {pk.nip_atasan || "-"})
                                                        </p>
                                                    </div>
                                                )}

                                                {pk && (() => {
                                                    const candidates = getCandidates(pk, level.level_pk)
                                                    const isReviewer = roleUser.some((r: string) => r === "reviewer")

                                                    if (isReviewer) {
                                                        return (
                                                            <p className="text-xs text-gray-400 text-center">
                                                                Reviewer tidak dapat mengubah hubungan rekin
                                                            </p>
                                                        )
                                                    }

                                                    if (candidates.length === 0) {
                                                        let kalimatError = 'Tidak ada rencana kinerja atasan yang dapat dihubungkan, cek laporan cascading opd'
                                                        if (level.level_pk === 4) {
                                                            kalimatError = 'Tidak dapat menghubungkan, sasaran pemda belum disusun'
                                                        }
                                                        return (
                                                            <p className="text-xs text-red-400 text-center">
                                                                {kalimatError}
                                                            </p>
                                                        )
                                                    }

                                                    return (
                                                        <HubungkanButton
                                                            isLinked={pk.id !== ""}
                                                            onClick={() => {
                                                                onSelectPk({
                                                                    pk,
                                                                    levelPk: level.level_pk,
                                                                })
                                                            }}
                                                        />
                                                    )
                                                })()}
                                            </div>
                                        </td>

                                        {/* NAMA ATASAN TERPILIH */}
                                        {idx === 0 && (
                                            <td
                                                rowSpan={totalPk}
                                                className="border p-3 w-[200px]"
                                            >
                                                <div className="flex flex-col gap-4 text-center">
                                                    {!!pegawai.nip_atasan && (
                                                        <div className="pb-3 mb-3 border-b border-blue-700 gap-5 flex flex-col">
                                                            <p className="font-medium text-slate-800">
                                                                {pegawai.nama_atasan}
                                                            </p>
                                                            <p className="font-medium text-slate-800">
                                                                {pegawai.nip_atasan}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {!PkLengkap ? (
                                                        <p className="text-xs text-red-400">
                                                            Hubungkan Semua Rekin dahulu
                                                        </p>
                                                    ) : (
                                                        !roleUser.some((r: string) =>
                                                            ["reviewer"].includes(r)
                                                        ) && (
                                                            <HubungkanAtasanButton
                                                                isLinked={!!pegawai.nip_atasan}
                                                                onClick={() => {
                                                                    onSelectAtasan({
                                                                        nipBawahan: pegawai.nip,
                                                                    })
                                                                }}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                        )}

                                        {/* AKSI */}
                                        {idx === 0 && (
                                            <td
                                                rowSpan={totalPk}
                                                className="border p-3 text-center w-[150px]"
                                            >
                                                {!!pegawai.nip_atasan && (
                                                    <button
                                                        className="button px-4 py-2 rounded border border-black bg-green-300 hover:bg-green-600 text-black"
                                                        onClick={() => onPreviewPk(pegawai.nip)}
                                                    >
                                                        Cetak PK
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            })
                    )
                ) : (
                    <tr>
                        <td colSpan={7} className="p-3">
                            data perjanjian kinerja pegawai kosong di {data.tahun || ""}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}


type hubungkanButtonProps = {
    isLinked: boolean
    onClick: () => void
}

const HubungkanButton = ({
    isLinked,
    onClick
}: hubungkanButtonProps) => {
    return (
        <button
            className={`py-1 rounded w-3/4 self-center ${isLinked
                ? "border border-blue-500 text-blue-500 hover:bg-blue-50"
                : "bg-blue-500 hover:bg-blue-600 text-white "
                }`}
            onClick={onClick}
        >
            {isLinked ? "Ubah" : "Hubungkan Rekin"}
        </button>
    );
}

const HubungkanAtasanButton = ({
    isLinked,
    onClick
}: hubungkanButtonProps) => {
    return (
        <button
            className="px-3 py-1 w-3/4 self-center rounded border border-yellow-500 hover:bg-yellow-600 text-black"
            onClick={onClick}
        >
            {isLinked ? "Ubah Atasan" : "Pilih Atasan"}
        </button>
    );
}
