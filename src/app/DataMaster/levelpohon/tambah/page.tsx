import { FiHome } from "react-icons/fi";
import { FormLevelPohon } from "@/components/pages/datamaster/levelpohon/FormLevelPohon";

const tambahJabatan = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Level Pohon</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormLevelPohon />
        </>
    )
}

export default tambahJabatan;