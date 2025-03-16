import React from 'react';

interface NewsItem {
  title: string;
  source: string;
  url: string;
  date: string;
}

interface NewsCardProps {
  news: NewsItem[];
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
    <h3 className="text-lg font-semibold">Latest News</h3>
    {news.map((item, index) => (
      <div key={index} className="border-b pb-2 last:border-b-0">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-green-500">
          {item.title}
        </a>
        <p className="text-sm text-gray-400">{item.source} • {item.date}</p>
      </div>
    ))}
  </div>
);

export default NewsCard;
