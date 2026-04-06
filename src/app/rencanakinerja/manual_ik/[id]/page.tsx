import FormManualIk from "@/components/pages/rencanakinerja/ManualIk/FormManualIk";
import { FiHome } from "react-icons/fi";

const manual_ik = () => {
    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Rencana Kinerja</p>
                <p className="mr-1">/ Manual Indikator Kinerja</p>
            </div>
            <div className="flex flex-col justify-center items-center mt-5">
                <div className="px-5 py-3 border-t-2 border-x-2 border-black rounded-t-xl shadow-md font-bold uppercase">
                    Manual Indikator Kinerja
                </div>
                <FormManualIk />
            </div>
        </>
    )
}

export default manual_ik;