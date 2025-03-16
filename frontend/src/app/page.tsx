"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchStockData } from "@/lib/fetchStockData";
import RealTimeStock from "@/components/RealTimeStock";
import "@/app/globals.css"; // Make sure Tailwind + custom styles are imported

// Dynamically import the chart component
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TradingDashboard() {
  const [symbol, setSymbol] = useState("SPY");
  const [stockData, setStockData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // UI Toggles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dark Mode Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Fetch Stock Data
  useEffect(() => {
    let isMounted = true;
    async function getStockData() {
      setLoading(true);
      const data = await fetchStockData(symbol);
      if (isMounted) {
        setStockData(data || {});
        setHistoricalData(data.historical_prices || []);
        setLoading(false);
      }
    }
    getStockData();
    return () => {
      isMounted = false;
    };
  }, [symbol]);

  return (
    <div className="
      min-h-screen flex flex-col 
      bg-gradient-to-r from-[#fdf8f5] to-[#f5f1eb] 
      dark:from-[#3c403b] dark:to-[#323431]
      text-gray-800 dark:text-gray-100
      font-sans transition-colors duration-300
    ">
      {/* Header */}
      <header className="
        flex justify-between items-center p-4
        bg-[#646f5b] dark:bg-[#4a4e48] text-white shadow-md
      ">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="
              bg-[#5c6a55] dark:bg-[#5c6a55] hover:bg-[#747f6c] 
              px-3 py-2 rounded
            "
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="
              bg-[#5c6a55] hover:bg-[#747f6c]
              px-3 py-2 rounded md:hidden
            "
          >
            {isSidebarOpen ? "Close Menu" : "Open Menu"}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            p-6 w-64
            bg-[#7b8671] dark:bg-[#585f55] text-white
            fixed inset-y-0 left-0 z-40 transform
            transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:translate-x-0
          `}
        >
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav>
            <ul>
              {["SPY", "AAPL", "TSLA", "GOOG"].map((sym) => (
                <li key={sym} className="mb-2">
                  <button
                    onClick={() => setSymbol(sym)}
                    className="w-full text-left hover:underline"
                  >
                    {sym}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8">
            <RealTimeStock symbol={symbol} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 ml-0 md:ml-64">
          {loading ? (
            <p className="text-lg animate-pulse">Loading data...</p>
          ) : stockData ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{symbol} Stock Data</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="
                    bg-[#7b8671] dark:bg-[#585f55] 
                    hover:bg-[#8e9b81] px-4 py-2 rounded
                  "
                >
                  More Details
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Last Price:</span>
                  <span>
                    ${stockData.last_close ? stockData.last_close.toFixed(2) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Bid Price:</span>
                  <span>
                    ${stockData.bid_price ? stockData.bid_price.toFixed(2) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ask Price:</span>
                  <span>
                    ${stockData.ask_price ? stockData.ask_price.toFixed(2) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Volume:</span>
                  <span>
                    {stockData.volume ? stockData.volume.toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>

              {/* Chart Section */}
              <div className="mb-6">
                {historicalData.length > 0 ? (
                  <Chart
                    options={{
                      chart: { id: "stock-chart", toolbar: { show: true } },
                      xaxis: {
                        categories: historicalData.map((bar) =>
                          new Date(bar.t).toLocaleDateString()
                        ),
                        labels: { rotate: -45 },
                      },
                      yaxis: [
                        {
                          title: { text: "Price ($)" },
                          min: Math.min(...historicalData.map((bar) => bar.c)) * 0.98,
                          max: Math.max(...historicalData.map((bar) => bar.c)) * 1.02,
                        },
                        {
                          opposite: true,
                          title: { text: "Volume" },
                          min: 0,
                          max: Math.max(...historicalData.map((bar) => bar.v)) * 1.2,
                        },
                      ],
                      tooltip: { enabled: true },
                      grid: { show: true },
                    }}
                    series={[
                      {
                        name: `${symbol} Price`,
                        data: historicalData.map((bar) => bar.c || 0),
                        type: "line",
                      },
                      {
                        name: `${symbol} Volume`,
                        data: historicalData.map((bar) => bar.v || 0),
                        type: "bar",
                      },
                    ]}
                    width="100%"
                    height={300}
                  />
                ) : (
                  <p className="text-gray-500">No historical data available.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-red-500">No data available.</p>
          )}
        </main>
      </div>

      {/* Modal for More Details */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">{symbol} Detailed Information</h3>
            <p className="mb-4">
              Additional charts, news, and analysis could go here. 
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="
                bg-red-500 hover:bg-red-400 
                dark:bg-red-700 dark:hover:bg-red-600
                px-4 py-2 rounded
              "
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="
        bg-[#646f5b] dark:bg-[#4a4e48] 
        text-white p-4 text-center
      ">
        <p className="text-sm">© 2025 My Trading App. All rights reserved.</p>
      </footer>
    </div>
  );
}
