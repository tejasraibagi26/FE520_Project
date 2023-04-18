import json
import urllib.request

import yfinance as yf

TEST_API_KEY = "deprecated"

# Deprecated


def get_stock_data(stock, timeline, time_unit, start_date, end_date):

    if (stock is None or timeline is None or time_unit is None or start_date is None or end_date is None):
        raise ValueError("Missing required parameters")

    if (stock == "" or timeline == "" or time_unit == "" or start_date == "" or end_date == ""):
        raise ValueError("Missing required parameters")

    # f'/stock?stock_name=AAPL&timeline=1&time_unit=day&start_date=2023-01-09&end_date=2023-01-09'

    URL = f'https://api.polygon.io/v2/aggs/ticker/{stock}/range/{timeline}/{time_unit}/{start_date}/{end_date}?adjusted=true&sort=asc&limit=120&apiKey={TEST_API_KEY}'

    with urllib.request.urlopen(URL) as url:
        data = json.loads(url.read().decode())
        return data


def get_stock_yf(stock_name):
    stock = yf.Ticker(stock_name)

    current_price = stock.info['regularMarketOpen']
    previous_close = stock.info['regularMarketPreviousClose']
    low = stock.info['regularMarketDayLow']
    high = stock.info['regularMarketDayHigh']
    return {
        'current_price': current_price,
        'previous_close': previous_close,
        'low': low,
        'high': high,
        'ticker': stock_name
    }

# Deprecated


def get_all_tickers():
    all_tickers = yf.Tickers('^GSPC').tickers
    print(all_tickers['^GSPC'].info)
    return all_tickers['^GSPC'].info
