import { FiHome } from "react-icons/fi";
import { FormMasterLembaga } from "@/components/pages/datamaster/masterlembaga/FormMasterLembaga";

const tambahLembaga = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Lembaga</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormMasterLembaga />
        </>
    )
}

export default tambahLembaga;