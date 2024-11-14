export type RegisterResponse = {
  message: string;
  status: boolean;
};

export type UserData = {
  email: string;
  id: number;
  name: string;
};

export type RealStateMessage = {
  message: string;
};
enum RealStateStatus {
  VENTAS = "VENTAS",
  ALQUILER = "ALQUILER",
  SUBASTA = "SUBASTA",
}

export type RealState = {
  id: number;
  name: string;
  description: string;
  direction: string;
  phone: string;
  email: string;
  rlst_url?: string;
  price: number;
  status: RealStateStatus;
  amenitie: Amenitie;
  amenitieId: number;
  images: RealStateImages[];
  user: User;
  user_id: number;
  auction?: Auction;
};

export type Amenitie = {
  id: number;
  wc: number;
  dimension: number;
  parking: number;
  rooms: number;
  gardens: number;
  realStates: RealState[];
};

export type RealStateImages = {
  id: number;
  img_url: string;
  realState: RealState;
  real_state_id: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  realStates: RealState[];
  bids: Bid[];
};

export type Auction = {
  id: number;
  startingPrice: number;
  startDate: Date;
  endDate: Date;
  bids: Bid[];
  realState: RealState;
  real_state_id: number;
};

export type Bid = {
  id: number;
  amount: number;
  timestamp: Date;
  user: User;
  user_id: number;
  auction: Auction;
  auction_id: number;
};
