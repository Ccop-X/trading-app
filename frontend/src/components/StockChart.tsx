import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  date: string;
  price: number;
}

interface StockChartProps {
  data: ChartData[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#00C805" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
