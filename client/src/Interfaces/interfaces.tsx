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

export type IWatchlist = {
  stock_name: string;
  added_time: string;
};

export type IBalance = {
  amount: number;
  type: string;
};
