from mongoengine import Document, StringField, FloatField, DateTimeField
from datetime import datetime

class Portfolio(Document):    
    symbol = StringField(max_length=10, required=True)
    signal_type = StringField(max_length=10, required=True)
    entry = FloatField(required=True)
    stop_loss = FloatField(required=True)
    take_profit = FloatField(required=True)
    link = StringField(max_length=200, required=True)

class History(Document):
    symbol = StringField(required=True)
    signal_type = StringField(required=True)
    entry = FloatField(required=True)
    exit = FloatField(required=True)
    profit_loss = FloatField(required=True)  # Positive for profit, negative for loss
