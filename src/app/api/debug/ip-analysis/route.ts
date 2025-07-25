import { NextRequest, NextResponse } from 'next/server';
import { getClientIpAddress, getCountryFromIp } from '@/lib/geolocation';

export async function GET(request: NextRequest) {
  // Extract IP address using our function
  const extractedIp = getClientIpAddress(request);
  
  // Get all headers for analysis
  const headers = {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'fastly-client-ip': request.headers.get('fastly-client-ip'),
    'x-vercel-forwarded-for': request.headers.get('x-vercel-forwarded-for'),
  };

  // Get country information
  const countryData = await getCountryFromIp(extractedIp);

  // Determine if this is real or mock data
  const isLocalhost = extractedIp === '127.0.0.1' || extractedIp === '::1';
  const isPrivate = extractedIp.startsWith('192.168.') || extractedIp.startsWith('10.');
  const isMockData = isLocalhost || isPrivate;

  return NextResponse.json({
    analysis: {
      extractedIp,
      headers,
      country: countryData?.country || 'Unknown',
      countryCode: countryData?.countryCode || 'Unknown',
      dataType: isMockData ? 'MOCK/DEVELOPMENT' : 'REAL/PRODUCTION',
      isRealUserIp: !isMockData,
      explanation: isMockData 
        ? 'Using mock data because IP is localhost/private network'
        : 'Using real geolocation API lookup for public IP'
    },
    rawRequest: {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
    }
  });
}
