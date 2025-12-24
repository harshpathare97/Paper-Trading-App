import pandas as pd
import yfinance as yf
from datetime import datetime
from models import Portfolio, History

SMA_44_PERIOD = 44
SUPPORT_THRESHOLD = 0.01

def is_market_open_today():
    today = datetime.today()
    # Check if today is a weekend (Saturday = 5, Sunday = 6)
    return today.weekday() < 5  # Return True if Monday to Friday

def get_nifty50_stocks():
    url = "https://archives.nseindia.com/content/indices/ind_nifty50list.csv"
    df = pd.read_csv(url)
    return df["Symbol"].tolist()

def check_sma_44_condition(stock):
    stock_data = stock.history(period="60d")

    if len(stock_data) < SMA_44_PERIOD:
        return None, None, 0, 0, 0, 0

    sma_val = stock_data["Close"].rolling(window=SMA_44_PERIOD).mean().iloc[-1]

    latest_data = stock_data.iloc[-1]  
    latest_open = latest_data["Open"]
    latest_high = latest_data["High"]
    latest_low = latest_data["Low"]
    latest_close = latest_data["Close"]

    is_green = latest_close > latest_open
    is_red = latest_close < latest_open

    low_on_sma = abs(latest_low - sma_val) / sma_val <= SUPPORT_THRESHOLD
    high_on_sma = abs(latest_high - sma_val) / sma_val <= SUPPORT_THRESHOLD

    if is_green and low_on_sma:
        close = latest_close
        entry = latest_high
        stop_loss = latest_low
        risk = entry - stop_loss
        target = entry + 2 * risk
        return "BUY", "green", close, entry, stop_loss, target

    if is_red and high_on_sma:
        close = latest_close
        entry = latest_low
        stop_loss = latest_high
        risk = stop_loss - entry
        target = entry - 2 * risk
        return "SELL", "red", close, entry, stop_loss, target

    return None, None, latest_close, 0, 0, 0

def update_trade_status():
    open_trades = Portfolio.objects() 

    for trade in open_trades:
        stock = yf.Ticker(f"{trade.symbol}.NS")
        latest_close = stock.history(period="1d")["Close"].iloc[-1]
        latest_close = round(float(latest_close), 2)
        profit_loss = None

        if trade.signal == 'BUY':
            if latest_close >= trade.target:
                profit_loss = trade.target - trade.entry  # Profit
            elif latest_close <= trade.stop_loss:
                profit_loss = trade.stop_loss - trade.entry  # Loss (negative)
        elif trade.signal == 'SELL': 
            if latest_close <= trade.target:
                profit_loss = trade.entry - trade.target  # Profit
            elif latest_close >= trade.stop_loss:
                profit_loss = trade.entry - trade.stop_loss  # Loss (negative)
            
        if profit_loss is not None:
            closed_trade = History(
                symbol=trade.symbol,
                signal=trade.signal,
                entry=trade.entry,
                exit=latest_close,
                profit_loss=round(float(profit_loss), 2),
                link=trade.link
            )
            closed_trade.save()
            trade.delete()
        else:
            if latest_close > trade.close:
                trade.candle = "green"
            elif latest_close < trade.close:
                trade.candle = "red"

            trade.close = latest_close
            trade.save()

def run_scan():
    # update_trade_status()

    if not is_market_open_today():
        return
        
    stocks = get_nifty50_stocks()
    excluded_stocks = [s.symbol for s in Portfolio.objects().only("symbol")]

    stocks_to_scan = [s for s in stocks if s not in excluded_stocks]

    for ticker in stocks_to_scan:
        stock = yf.Ticker(f"{ticker}.NS")
        signal, candle, close, entry, sl, tp = check_sma_44_condition(stock)

        if signal:
            tradingview_link = f"https://www.tradingview.com/chart/?symbol=NSE:{ticker}"
            record = Portfolio(
                symbol=ticker,
                signal=signal,
                candle=candle,
                close=round(float(close), 2),
                entry=round(float(entry), 2),
                stop_loss=round(float(sl), 2),
                target=round(float(tp), 2),
                link=tradingview_link
            )
            record.save()