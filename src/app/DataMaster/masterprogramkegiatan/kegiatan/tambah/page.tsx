import { FiHome } from "react-icons/fi";
import { FormKegiatan } from "@/components/pages/datamaster/masterprogramkegiatan/kegiatan/FormKegiatan";

const editBidangUrusan = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Kegiatan</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormKegiatan />
        </>
    )
}

export default editBidangUrusan;