export type INavProps = {
  isLoggedIn: boolean;
};

export type ILoginPageProps = {
  updateLoggedIn: (value: boolean) => void;
};

export type ITransaction = {
  transaction_id: number;
  stock_name: string;
  quantity: number;
  price: number;
  time: string;
  type: string;
};

export type IStock = {
  price: number;
  stock_name: string;
  time: string;
  type: string;
  quantity: number;
};

export type IStockDashboard = {
  price: number;
  stock_name: string;
  time: string;
  type: string;
  quantity: number;
  average_price: number;
  total_count: number;
  total_price: number;
};

export type IWatchlist = {
  stock_name: string;
  added_time: string;
};

export type IBalance = {
  amount: number;
  type: string;
};

export type ITicker = {
  symbol: string;
  companyName: string;
  industry: string;
  marketCap: number;
};
