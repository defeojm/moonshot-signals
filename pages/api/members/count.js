// pages/api/members/count.js - Next.js API route
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch from your subscription stats endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscription-stats`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      // Return default count if can't fetch
      return res.status(200).json({ total: 23 });
    }

    const data = await response.json();
    
    res.status(200).json({ 
      total: data.activeCount || 23 
    });
  } catch (error) {
    console.error('Error fetching member count:', error);
    res.status(200).json({ total: 23 });
  }
}