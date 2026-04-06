import { FiHome } from "react-icons/fi";
import { FormTematikKab } from "@/components/pages/tematikkota/FormTematikKab";

const TambahTematikKab = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Kabupaten</p>
                <p className="mr-1">/ Tematik Kabupaten</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormTematikKab />
        </>
    )
}

export default TambahTematikKab;