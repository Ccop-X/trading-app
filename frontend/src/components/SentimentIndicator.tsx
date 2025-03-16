import React from 'react';

interface SentimentIndicatorProps {
  sentiment: number;  // positive = bullish, negative = bearish
}

const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({ sentiment }) => {
  const isPositive = sentiment >= 0;

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-100 text-red-500'}`}>
      <span>{isPositive ? '👍' : '👎'}</span>
      <span>{isPositive ? 'Bullish' : 'Bearish'}</span>
      <span className="font-semibold">{Math.abs(sentiment)}%</span>
    </div>
  );
};

export default SentimentIndicator;
