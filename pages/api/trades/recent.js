// pages/api/trades/recent.js - Next.js API route
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch from your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trades');
    }

    const trades = await response.json();
    
    // Filter for recent published trades only
    const recentTrades = trades
      .filter(trade => trade.signal && trade.signal.published)
      .slice(0, 6)
      .map(trade => ({
        id: trade.id,
        symbol: trade.symbol,
        direction: trade.direction,
        entry_price: trade.entry_price,
        exit_price: trade.exit_price,
        size: trade.size,
        pnl: trade.pnl,
        status: trade.status,
        opened_at: trade.opened_at,
        closed_at: trade.closed_at,
        signal_title: trade.signal?.title
      }));

    res.status(200).json(recentTrades);
  } catch (error) {
    console.error('Error fetching recent trades:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
}



