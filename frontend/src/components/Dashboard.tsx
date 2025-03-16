import React from 'react';
import StockChart from './StockChart';
import SentimentIndicator from './SentimentIndicator';
import NewsCard from './NewsCard';

interface ChartData {
  date: string;
  price: number;
}

interface StockData {
  symbol: string;
  price: number;
  isUp: boolean;
  percentChange: number;
  chartData: ChartData[];
}

interface NewsItem {
  title: string;
  source: string;
  url: string;
  date: string;
}

interface DashboardProps {
  stockData: StockData;
  sentiment: number;
  news: NewsItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ stockData, sentiment, news }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 shadow-sm bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Trading App</h1>
        <input
          type="search"
          placeholder="Search Stocks..."
          className="border p-2 rounded-lg w-1/3"
        />
      </header>

      <main className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-semibold">{stockData.symbol}</h2>
              <p className="text-3xl font-bold">${stockData.price}</p>
              <span className={`text-xl font-medium ${stockData.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stockData.isUp ? '▲' : '▼'} {stockData.percentChange}%
              </span>
            </div>
            <SentimentIndicator sentiment={sentiment} />
          </div>
          <StockChart data={stockData.chartData} />
        </div>

        <div className="space-y-4">
          <NewsCard news={news} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
