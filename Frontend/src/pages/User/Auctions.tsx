import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MyAuctionCard from "../../components/AuctionComponents/MyAuctionCard";

export default function Auctions() {
  const[subastas, setSubastas] = useState<any[]>([]);
  
  const data = async() => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auction`;
      const response = await axios.get(url);
      const auctions = response.data;
      setSubastas(auctions)
    } catch (error) {
      toast.error("Hubo un Error al traer estas vainas")
    }
  }

  useEffect(() => {
    data();
  }, [])

 
  

  return( 
    <div> 
      <h2 className="text-center text-4xl text-black font-semibold">Subastas</h2>
      <div className="grid grid-cols-3 gap-2 my-4 mx-auto w-11/12">
        {subastas.map((subasta: any, key: number) => (
          <MyAuctionCard {...subasta} key={key}/>
        ))}
      </div>
    </div>
  );
}
