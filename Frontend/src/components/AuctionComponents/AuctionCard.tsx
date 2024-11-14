
type Prop = {
    obj: MACard
}

interface MACard {
    user_id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    startingPrice: number;
    img_id: number;
    id: number;
    bids: Array<any>;
  }
const AuctionCard = ({ obj }: Prop) => {
    console.log(obj)
  return (
    <div>AuctionCard</div>
  )
}

export default AuctionCard