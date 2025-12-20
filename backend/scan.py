import pandas as pd
import yfinance as yf
from datetime import datetime
from models import Portfolio, History

SMA_44_PERIOD = 44
SUPPORT_THRESHOLD = 0.01

# Check if market is open today
def is_market_open_today():
    today = datetime.today()
    # Check if today is a weekend (Saturday = 5, Sunday = 6)
    return today.weekday() < 5  # Return True if Monday to Friday

# Fetch Nifty50 stocks
def get_nifty50_stocks():
    url = "https://archives.nseindia.com/content/indices/ind_nifty50list.csv"
    df = pd.read_csv(url)
    return df["Symbol"].tolist()

# Check SMA 44 condition
def check_sma_44_condition(stock):
    stock_data = stock.history(period="60d", interval="1d")

    if len(stock_data) < SMA_44_PERIOD:
        return None, 0, 0, 0

    close = stock_data["Close"]
    open_ = stock_data["Open"]
    high = stock_data["High"]
    low = stock_data["Low"]

    sma_44 = close.rolling(window=SMA_44_PERIOD).mean()
    sma_val = sma_44.iloc[-1]

    latest_close = close.iloc[-1]
    latest_open = open_.iloc[-1]
    latest_high = high.iloc[-1]
    latest_low = low.iloc[-1]

    is_green = latest_close > latest_open
    is_red = latest_close < latest_open

    low_on_sma = abs(latest_low - sma_val) / sma_val <= SUPPORT_THRESHOLD
    high_on_sma = abs(latest_high - sma_val) / sma_val <= SUPPORT_THRESHOLD

    if is_green and low_on_sma:
        entry = latest_high
        stop_loss = latest_low
        risk = entry - stop_loss
        take_profit = entry + 2 * risk
        return "BUY", entry, stop_loss, take_profit

    if is_red and high_on_sma:
        entry = latest_low
        stop_loss = latest_high
        risk = stop_loss - entry
        take_profit = entry - 2 * risk
        return "SELL", entry, stop_loss, take_profit

    return None, latest_close, 0, 0

def update_trade_status():
    open_trades = Portfolio.objects()  # Fetch all active trades

    for trade in open_trades:
        stock = yf.Ticker(f"{trade.symbol}.NS")
        latest_close = stock.history(period="1d")["Close"].iloc[-1]
        latest_close = round(float(latest_close), 2)
        profit_loss = 0

        if trade.signal_type == 'BUY':
            if latest_close >= trade.take_profit:
                profit_loss = trade.take_profit - trade.entry  # Profit
            elif latest_close <= trade.stop_loss:
                profit_loss = trade.stop_loss - trade.entry  # Loss (negative)
            else:
                continue # Trade still active
        elif trade.signal_type == 'SELL':  # short position
            if latest_close <= trade.take_profit:
                profit_loss = trade.entry - trade.take_profit  # Profit
            elif latest_close >= trade.stop_loss:
                profit_loss = trade.entry - trade.stop_loss  # Loss (negative)
            else:
                continue # Trade still active

        # Save to closed trades table
        closed_trade = History(
            symbol=trade.symbol,
            signal_type=trade.signal_type,
            entry=trade.entry,
            exit=latest_close,
            profit_loss=round(float(profit_loss), 2),
        )
        closed_trade.save()

        # Remove from active trades
        trade.delete()

# Run scan excluding database stocks
def run_scan():
    # Update status of existing trades
    update_trade_status()

    # Skip the scan if today is a weekend
    if not is_market_open_today():
        return
        
    stocks = get_nifty50_stocks()
    excluded_stocks = [s.symbol for s in Portfolio.objects().only("symbol")]

    # Filter out excluded stocks
    stocks_to_scan = [s for s in stocks if s not in excluded_stocks]

    for ticker in stocks_to_scan:
        stock = yf.Ticker(f"{ticker}.NS")
        signal, entry, sl, tp = check_sma_44_condition(stock)

        if signal:
            tradingview_link = f"https://www.tradingview.com/chart/?symbol=NSE:{ticker}"
            record = Portfolio(
                symbol=ticker,
                signal_type=signal,
                entry=round(float(entry), 2),
                stop_loss=round(float(sl), 2),
                take_profit=round(float(tp), 2),
                link=tradingview_link
            )
            record.save()