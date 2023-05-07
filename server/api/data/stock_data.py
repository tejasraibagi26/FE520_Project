import yfinance as yf


def get_stock_yf(stock_name):
    stock = yf.Ticker(stock_name)

    current_price = stock.info["regularMarketOpen"]
    previous_close = stock.info["regularMarketPreviousClose"]
    low = stock.info["regularMarketDayLow"]
    high = stock.info["regularMarketDayHigh"]
    return {
        "current_price": current_price,
        "previous_close": previous_close,
        "low": low,
        "high": high,
        "ticker": stock_name,
    }
