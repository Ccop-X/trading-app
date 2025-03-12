"use client";
import React, { useState, useEffect } from "react";
import { fetchStockData } from "./fetchStockData";

export default function Home() {
    const [symbol, setSymbol] = useState<string>("SPY");
    const [stockData, setStockData] = useState<{ last_close?: number; error?: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getStockData() {
            setLoading(true);
            console.log("Fetching data for:", symbol);
            const data = await fetchStockData(symbol);
            console.log("Fetched Data:", data);
            setStockData(data);
            setLoading(false);
        }
        getStockData();
    }, [symbol]);

    return (
        <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ color: "#007bff" }}>🚀 Trading App</h1>
            <p>Enter a stock symbol to get the latest closing price:</p>

            <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol (e.g., SPY)"
                style={{ padding: "10px", fontSize: "16px", marginBottom: "20px" }}
            />

            {loading ? (
                <p>Loading...</p>
            ) : stockData && stockData.last_close !== undefined ? (
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {symbol} Last Close: ${stockData.last_close.toFixed(2)}
                </p>
            ) : (
                <p style={{ color: "red" }}>⚠️ No data available or API request failed.</p>
            )}
        </div>
    );
}
