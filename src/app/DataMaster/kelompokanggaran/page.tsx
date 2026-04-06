import { FiHome } from "react-icons/fi";
import { TbCirclePlus } from "react-icons/tb";
import { Table } from "./Table";

const masterjabatan = () => {
    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Kelompok Anggaran</p>
            </div>
            <Table />
        </>
    )
}

export default masterjabatan;