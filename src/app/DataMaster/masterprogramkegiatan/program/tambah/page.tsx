import { FiHome } from "react-icons/fi";
import { FormProgram } from "@/components/pages/datamaster/masterprogramkegiatan/program/FormProgram";

const tambahProgram = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Program</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormProgram />
        </>
    )
}

export default tambahProgram;