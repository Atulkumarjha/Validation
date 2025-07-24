// Utility functions for IP address and geolocation

export function getClientIpAddress(request: Request): string {
  // Try to get IP from various headers (for different deployment scenarios)
  const headers = request.headers;
  
  // Check common headers used by proxies and load balancers
  const xForwardedFor = headers.get('x-forwarded-for');
  const xRealIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
  const fastlyClientIp = headers.get('fastly-client-ip'); // Fastly
  const xVercelForwardedFor = headers.get('x-vercel-forwarded-for'); // Vercel
  
  // Return the first valid IP found
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    const firstIp = ips[0];
    if (firstIp && firstIp !== '::1' && firstIp !== '127.0.0.1') {
      return firstIp;
    }
  }
  
  if (xRealIp && xRealIp !== '::1' && xRealIp !== '127.0.0.1') {
    return xRealIp;
  }
  
  if (cfConnectingIp && cfConnectingIp !== '::1' && cfConnectingIp !== '127.0.0.1') {
    return cfConnectingIp;
  }
  
  if (fastlyClientIp && fastlyClientIp !== '::1' && fastlyClientIp !== '127.0.0.1') {
    return fastlyClientIp;
  }
  
  if (xVercelForwardedFor && xVercelForwardedFor !== '::1' && xVercelForwardedFor !== '127.0.0.1') {
    return xVercelForwardedFor;
  }
  
  // Fallback for development
  return '127.0.0.1';
}

export async function getCountryFromIp(ipAddress: string): Promise<{ country: string; countryCode: string } | null> {
  try {
    // For localhost/development, return a default country
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
      return { country: 'India', countryCode: 'IN' }; // Default for development
    }

    // Use ip-api.com for geolocation (free tier allows 1000 requests/month)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.country) {
      return {
        country: data.country,
        countryCode: data.countryCode || 'Unknown'
      };
    }

    // Fallback to a more reliable service if first one fails
    const backupController = new AbortController();
    const backupTimeoutId = setTimeout(() => backupController.abort(), 5000);

    const backupResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      method: 'GET',
      signal: backupController.signal,
    });

    clearTimeout(backupTimeoutId);

    if (backupResponse.ok) {
      const backupData = await backupResponse.json();
      if (backupData.country_name) {
        return {
          country: backupData.country_name,
          countryCode: backupData.country_code || 'Unknown'
        };
      }
    }

    // Final fallback
    return { country: 'Unknown', countryCode: 'Unknown' };

  } catch (error) {
    console.error('Error getting country from IP:', error);
    // Return a default country on error
    return { country: 'India', countryCode: 'IN' };
  }
}

export function getCountryFlag(countryCode: string): string {
  // Convert country code to flag emoji
  const flagMap: Record<string, string> = {
    'IN': '🇮🇳', // India
    'US': '🇺🇸', // United States
    'GB': '🇬🇧', // United Kingdom
    'CA': '🇨🇦', // Canada
    'AU': '🇦🇺', // Australia
    'DE': '🇩🇪', // Germany
    'FR': '🇫🇷', // France
    'JP': '🇯🇵', // Japan
    'CN': '🇨🇳', // China
    'BR': '🇧🇷', // Brazil
    'RU': '🇷🇺', // Russia
    'KR': '🇰🇷', // South Korea
    'IT': '🇮🇹', // Italy
    'ES': '🇪🇸', // Spain
    'MX': '🇲🇽', // Mexico
    'NL': '🇳🇱', // Netherlands
    'SE': '🇸🇪', // Sweden
    'NO': '🇳🇴', // Norway
    'DK': '🇩🇰', // Denmark
    'FI': '🇫🇮', // Finland
    'SG': '🇸🇬', // Singapore
    'MY': '🇲🇾', // Malaysia
    'TH': '🇹🇭', // Thailand
    'PH': '🇵🇭', // Philippines
    'ID': '🇮🇩', // Indonesia
    'VN': '🇻🇳', // Vietnam
    'BD': '🇧🇩', // Bangladesh
    'PK': '🇵🇰', // Pakistan
    'LK': '🇱🇰', // Sri Lanka
    'NP': '🇳🇵', // Nepal
    'AE': '🇦🇪', // United Arab Emirates
    'SA': '🇸🇦', // Saudi Arabia
    'IL': '🇮🇱', // Israel
    'TR': '🇹🇷', // Turkey
    'EG': '🇪🇬', // Egypt
    'ZA': '🇿🇦', // South Africa
    'NG': '🇳🇬', // Nigeria
    'KE': '🇰🇪', // Kenya
    'GH': '🇬🇭', // Ghana
    'AR': '🇦🇷', // Argentina
    'CL': '🇨🇱', // Chile
    'CO': '🇨🇴', // Colombia
    'PE': '🇵🇪', // Peru
    'VE': '🇻🇪', // Venezuela
  };

  return flagMap[countryCode] || '🌍'; // Default to world emoji
}
