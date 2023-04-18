import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IBalance,
  IStock,
  ITransaction,
  IWatchlist,
} from "../../Interfaces/interfaces";
import type { RootState } from "../store";

interface IUserState {
  _id: any;
  username: string;
  email: string;
  balance: number;
  transactions: ITransaction[];
  watchlist: IWatchlist[];
  stocks: IStock[];
}

const initState: IUserState = {
  _id: "",
  username: "",
  email: "",
  balance: 0.0,
  transactions: [],
  watchlist: [],
  stocks: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserState>) => {
      state._id = action.payload._id["$oid"];
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
      state.watchlist = action.payload.watchlist;
      state.stocks = action.payload.stocks;
    },
    clearUser: (state) => {
      state._id = "";
      state.username = "";
      state.email = "";
      state.balance = 0.0;
      state.transactions = [];
      state.watchlist = [];
      state.stocks = [];
    },
    updateWatchlist: (state, action: PayloadAction<IWatchlist>) => {
      state.watchlist.push(action.payload);
    },
    updateBalance: (state, action: PayloadAction<IBalance>) => {
      if (
        action.payload.type !== "deposit" &&
        action.payload.type !== "withdraw"
      ) {
        throw new Error("Invalid balance type");
      }
      if (action.payload.type === "deposit") {
        state.balance += action.payload.amount;
      } else {
        state.balance -= action.payload.amount;
      }
    },
    updateStocks: (state, action: PayloadAction<IStock>) => {
      state.stocks.push(action.payload);
    },
    updateTransactions: (state, action: PayloadAction<ITransaction>) => {
      state.transactions.push(action.payload);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
