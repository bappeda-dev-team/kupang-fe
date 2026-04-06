import { FiHome } from "react-icons/fi";
import { FormEditProgram } from "@/components/pages/datamaster/masterprogramkegiatan/program/FormProgram";

const editProgram = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Program</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditProgram />
        </>
    )
}

export default editProgram;