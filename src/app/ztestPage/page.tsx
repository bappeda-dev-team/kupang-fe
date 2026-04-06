"use client"

import React, { useState, useEffect } from "react"

const test = () => {

//   const [ArrayGabungan, setArrayGabungan] = useState<any[]>([]);

//   const Array1 = [
//     { "id": 1, "nama": "myko", "umur": 20 },
//     { "id": 2, "nama": "akbar", "umur": 30 },
//     { "id": 3, "nama": "Yonta", "umur": 25 }
//   ]

//   const Array2 = [
//     { "id": 1, "hoby": "Music" },
//     { "id": 2, "hoby": "Video" },
//     { "id": 4, "hoby": "Gaming" }
//   ]

//   useEffect(() => {
//     if (Array1 && Array2) {
//       // const dataGabungan = GabungDataCara1(Array1, Array2);
//       const dataGabungan = GabungDataCara2(Array1, Array2);
//       setArrayGabungan(dataGabungan);
//     }
//   }, []);

  return (
    <>
       {/* <p>contoh penggabungan array</p>
       <table>
         <thead>
           <tr>
             <th className="border px-3 py-2">no</th>
             <th className="border px-3 py-2">nama</th>
             <th className="border px-3 py-2">umur</th>
             <th className="border px-3 py-2">hoby</th>
           </tr>
         </thead>
         <tbody>
           {ArrayGabungan.map((item: any, index: number) => (
             <tr key={item.id}>
               <td className="border px-3 py-2">{index + 1}</td>
               <td className="border px-3 py-2">{item.nama}</td>
               <td className="border px-3 py-2">{item.umur}</td>
               <td className="border px-3 py-2">{item.hoby || "-"}</td>
             </tr>
           ))}
         </tbody>
       </table> */}
    </>
  )
}

export default test;

// // penggabungan data dimana hanya array1 & array2 yang memiliki id yang sama
// function GabungDataCara1(array1: any, array2: any) {
//   const hasil: any = [];
//   array1.forEach((item1: any) => {
//     const array2Penggabung = array2.find(((item2: any) =>
//       item2.id === item1.id
//     ));
//     if (array2Penggabung) {
//       hasil.push({
//         id: item1.id,
//         nama: item1.nama,
//         umur: item1.umur,
//         hoby: array2Penggabung.hoby
//       });
//     } else {
//       hasil.push({
//         id: item1.id,
//         nama: item1.nama,
//         umur: item1.umur,
//         hoby: "tidak memiliki hoby"
//       });
//     }
//   });
//   return hasil;
// }

// //penggabungan data dimana array1 & array2 yang beda id tetap masuk dalam gabungan data
// function GabungDataCara2(array1: any, array2: any) {
//   const Array2Map = new Map(array2.map((item2baru: any) => [item2baru.id, item2baru]));
//   const Hasil = array1.map((item1: any) => {
//     const ArrayGabungan = Array2Map.get(item1.id);
//     return {...item1, ...(ArrayGabungan ?? {})}
//   });
  
//   array2.forEach((item2: any) => {
//     const gabungan = Hasil.some((item: any) => item.id === item2.id);
//     if(!gabungan){
//       Hasil.push({
//         id: item2.id,
//         nama: "-",
//         umur: 0,
//         hoby: item2.hoby
//       });
//     }
//   });
//   return Hasil;
// }

