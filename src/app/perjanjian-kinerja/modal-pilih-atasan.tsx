import { useState, useMemo } from "react";
import Select from 'react-select';

// MODAL
export type AtasanOption = {
  nama: string
  nip: string
}

export type SelectAtasanOption = {
  value: string
  label: string
  meta: AtasanOption
}

export type ModalPilihAtasanProps = {
  open: boolean
  onClose: () => void
  onSubmit: (nipAtasan: string) => void
  atasanList: AtasanOption[]
}

export const ModalPilihAtasan = ({
  open,
  onClose,
  onSubmit,
  atasanList,
}: ModalPilihAtasanProps) => {
  const [selected, setSelected] = useState<SelectAtasanOption | null>(null)

  const options: SelectAtasanOption[] = useMemo(
    () =>
      atasanList.map((r) => ({
        value: r.nip,
        label: `${r.nama} | ${r.nip}`,
        meta: r,
      })),
    [atasanList]
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-[500px] p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          Pilih Atasan
        </h2>

        <Select
          options={options}
          value={selected}
          onChange={(opt) => setSelected(opt)}
          placeholder="Cari nama / NIP ..."
          isClearable
          isSearchable
          className="mb-4"
        />
        {/* PREVIEW */}
        {selected && (
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Atasan Terpilih: </h3>
            <div className="border rounded p-3 bg-slate-50 text-sm mb-5">
              <p className="font-semibold">{selected.meta.nama}</p>
              <p className="text-slate-600">{selected.meta.nip}</p>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Batal
          </button>
          <button
            // TODO: add submitting here
            disabled={!selected}
            onClick={() => selected && onSubmit(selected.value)}
            className={`px-4 py-2 rounded text-white ${selected
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}
