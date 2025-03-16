"use client";

import React, { useEffect, useState } from "react";

interface TradeData {
  symbol?: string;
  price?: number;
  timestamp?: string;
  error?: string;
}

export default function RealTimeStock({ symbol }: { symbol: string }) {
  const [tradeData, setTradeData] = useState<TradeData>({});

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/stock/${symbol}`);
  
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTradeData(data);
    };
  
    // Updated error handler:
    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };
  
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  
    return () => {
      ws.close();
    };
  }, [symbol]);  

  return (
    <div style={{ margin: "20px 0" }}>
      <h3>Real-Time Trade Data for {symbol}</h3>
      {tradeData.error ? (
        <p style={{ color: "red" }}>Error: {tradeData.error}</p>
      ) : (
        <div>
          <p>Price: {tradeData.price !== undefined ? tradeData.price : "Loading..."}</p>
          <p>Timestamp: {tradeData.timestamp ?? "Loading..."}</p>
        </div>
      )}
    </div>
  );
}
