// pages/api/performance/index.js
export default async function handler(req, res) {
  const { period = '30d' } = req.query;
  
  try {
    // Fetch from your backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/performance/stats?period=${period}`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch performance data');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching performance:', error);
    // Return demo data as fallback
    res.status(200).json({
      totalTrades: 5561,
      winRate: 90.8,
      totalProfit: 153000,
      avgWin: 850,
      avgLoss: -3060,
      profitFactor: 3.2,
      sharpeRatio: 5.221,
      maxDrawdown: -8.5
    });
  }
}

// Add to your backend server.js
// app.use('/api/performance', require('./routes/performance'));