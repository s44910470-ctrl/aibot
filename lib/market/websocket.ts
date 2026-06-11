type PriceUpdate = {
  symbol: string;
  price: number;
  timestamp: number;
};

export class BinanceSocketManager {
  private socket: WebSocket | null = null;
  private reconnectTimer: number | null = null;

  connect(symbols: string[], onPrice: (data: PriceUpdate) => void) {
    const streams = symbols.map((s) => `${s.toLowerCase()}@trade`).join('/');
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      const trade = payload?.data;

      if (!trade) return;

      onPrice({
        symbol: trade.s,
        price: Number(trade.p),
        timestamp: trade.T,
      });
    };

    this.socket.onclose = () => {
      this.reconnectTimer = window.setTimeout(() => {
        this.connect(symbols, onPrice);
      }, 3000);
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.socket?.close();
    this.socket = null;
  }
}
