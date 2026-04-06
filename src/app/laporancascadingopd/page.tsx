'use client'

// import Maintenance from "@/components/global/Maintenance";
import Cascading from "@/components/pages/Pohon/Cascading/Cascading";
import { useEffect, useState } from "react";
import { getOpdTahun, getUser } from "@/components/lib/Cookie";


const LaporanCascadingOpd = () => {
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    
    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
    }, []);

    return(
        <>
            <Cascading 
                jenis="laporan"
                tahun={Tahun?.value}
                user={User?.roles}
                nama_opd={(User?.roles == 'super_admin' || User?.roles == 'reviewer') ? SelectedOpd?.label : ''}
                kode_opd={(User?.roles == 'super_admin' || User?.roles == 'reviewer') ? SelectedOpd?.value : User?.kode_opd}
            />
        </>
    )
}

export default LaporanCascadingOpd;