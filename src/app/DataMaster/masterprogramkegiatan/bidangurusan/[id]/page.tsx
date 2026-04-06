import { FiHome } from "react-icons/fi";
import { FormEditBidangUrusan } from "@/components/pages/datamaster/masterprogramkegiatan/bidangurusan/FormBidangUrusan";

const editBidangUrusan = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Bidang urusan</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditBidangUrusan />
        </>
    )
}

export default editBidangUrusan;