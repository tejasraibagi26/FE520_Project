import { MouseEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tickers } from "../../Data/Tickers";
import "./index.css";

const Search = () => {
  const [searchResults, setSearchResults] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allTickers, setAllTickers] = useState<any>(tickers);
  const navigator = useNavigate();
  console.log(allTickers);

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
    if (event.target.value === "") {
      setAllTickers(tickers);
      setSearchResults([]);
    }
    if (event.target.value !== "") {
      const newTickers = allTickers.filter((ticker: any) => {
        return ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchResults(newTickers);
    } else {
      setSearchResults([]);
    }
  };

  const viewTicker: MouseEventHandler<HTMLDivElement> = (ticker: any) => {
    console.log(ticker);
    navigator(`/stock/${ticker.symbol}`);
  };
  return (
    <section id="search">
      <div className="container-top">
        <form className="sticky">
          <div className="form-group">
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              placeholder="Search"
            />
          </div>
        </form>
        <div className="search-results">
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((ticker: any) => {
                return (
                  <div
                    className="ticker"
                    onClick={() => {
                      viewTicker(ticker);
                    }}
                    key={ticker.Symbol}
                  >
                    <p>{ticker.symbol}</p>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {allTickers.map((ticker: any) => {
                return (
                  <div
                    className="ticker"
                    key={ticker.Symbol}
                    onClick={() => {
                      viewTicker(ticker);
                    }}
                  >
                    <p>{ticker.symbol}</p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Search;
