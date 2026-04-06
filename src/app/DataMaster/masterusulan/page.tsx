'use client'

import { ButtonSkyBorder, ButtonSky } from "@/components/global/Button";
import { FiHome } from "react-icons/fi";
import TableMusrenbang from "@/components/pages/masterusulan/musrenbang/Table";
import TableInisiatif from "@/components/pages/masterusulan/inisiatif/Table";
import TablePokir from "@/components/pages/masterusulan/pokir/Table";
import TableMandatori from "@/components/pages/masterusulan/mandatori/Table";
import { useState } from "react";
import { TbPlus } from "react-icons/tb";

const MasterUsulan = () => {

    const [JenisUsulan, setJenisUsulan] = useState<string>('');

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Usulan</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-end">
                        <h1 className="uppercase font-bold">Daftar Usulan {JenisUsulan}</h1>
                    </div>
                    <div className="flex gap-2">
                        <ButtonSkyBorder 
                            onClick={() => setJenisUsulan('musrenbang')}
                            className={`flex items-center justify-center ${JenisUsulan === 'musrenbang' && 'bg-blue-500 text-white'}`}
                        >
                            Musrenbang
                        </ButtonSkyBorder>
                        <ButtonSkyBorder 
                            onClick={() => setJenisUsulan('pokok pikiran')}
                            className={`flex items-center justify-center ${JenisUsulan === 'pokok pikiran' && 'bg-blue-500 text-white'}`}
                        >
                            Pokok Pikiran
                        </ButtonSkyBorder>
                        <ButtonSkyBorder 
                            onClick={() => setJenisUsulan('inisiatif')}
                            className={`flex items-center justify-center ${JenisUsulan === 'inisiatif' && 'bg-blue-500 text-white'}`}
                        >
                            Inisiatif
                        </ButtonSkyBorder>
                        <ButtonSkyBorder 
                            onClick={() => setJenisUsulan('mandatori')}
                            className={`flex items-center justify-center ${JenisUsulan === 'mandatori' && 'bg-blue-500 text-white'}`}
                        >
                            Mandatori
                        </ButtonSkyBorder>
                    </div>
                </div>
                <div className="p-5">
                    {JenisUsulan === "musrenbang" ?
                        <>
                            <TableMusrenbang />
                        </>
                    : JenisUsulan === "pokok pikiran" ? 
                        <>
                            <TablePokir />
                        </>
                    : JenisUsulan === "inisiatif" ? 
                        <>
                            <TableInisiatif />
                        </>
                    : JenisUsulan === "mandatori" ?
                        <>
                            <TableMandatori />
                        </> 
                    :
                        <h1>pilih jenis usulan</h1>
                    }
                </div>
                {/* <Table /> */}
            </div>
        </>
    )
}

export default MasterUsulan;