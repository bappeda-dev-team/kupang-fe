import { FiHome } from "react-icons/fi";
import { FormUserOpd } from "@/components/pages/useropd/FormUserOpd";

const tambahUserOpd = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ User OPD</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormUserOpd />
        </>
    )
}

export default tambahUserOpd;