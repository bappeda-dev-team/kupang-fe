import { FiHome } from "react-icons/fi";
import { FormSubTematikKab } from "@/components/pages/subtematik/FormSubTematikKab";

const TambahSubTematikKab = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Kabupaten</p>
                <p className="mr-1">/ Sub Tematik Kabupaten</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormSubTematikKab />
        </>
    )
}

export default TambahSubTematikKab;