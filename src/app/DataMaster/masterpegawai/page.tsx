import Table from "@/components/pages/datamaster/masterpegawai/Table";
import { FiHome } from "react-icons/fi";

const masterpegawai = () => {
    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Pegawai</p>
            </div>
            <Table />
        </>
    )
}

export default masterpegawai;