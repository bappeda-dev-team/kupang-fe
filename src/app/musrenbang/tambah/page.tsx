import { FiHome } from "react-icons/fi";
import { FormMusrenbang } from "@/components/pages/usulan/musrenbang/FormMusrenbang";

const TambahMusrenbang = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Musrenbang</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormMusrenbang />
        </>
    )
}

export default TambahMusrenbang;