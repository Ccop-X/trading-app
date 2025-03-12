export async function fetchStockData(symbol: string): Promise<{ last_close?: number; error?: string }> {
    try {
        console.log("Fetching stock data for:", symbol);
        const response = await fetch(`http://localhost:8000/api/stock/${symbol}`);
        console.log("Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return { error: "Failed to fetch stock data" };
    }
}
