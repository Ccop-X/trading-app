export async function fetchStockData(symbol: string): Promise<{ last_close?: number; bid_price?: number; ask_price?: number; volume?: number; historical_prices?: { t: string; c: number }[]; error?: string }> {
    try {
        console.log("Fetching stock data for:", symbol);
        const response = await fetch(`http://127.0.0.1:8000/api/stock/${symbol}`);
        console.log("Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        // Ensure historical_prices is always an array
        if (!data.historical_prices) {
            data.historical_prices = [];
        }

        return data;
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return { error: "Failed to fetch stock data" };
    }
}
