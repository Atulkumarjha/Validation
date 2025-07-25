// Test script to demonstrate IP-to-Country mapping
import { getCountryFromIp } from '@/lib/geolocation';

export async function testIpMapping() {
  const testIPs = [
    '8.8.8.8',       // Google DNS (should be US)
    '1.1.1.1',       // Cloudflare (should be US)
    '9.9.9.9',       // Quad9 DNS (should be US)
    '208.67.222.222', // OpenDNS (should be US)
    '117.239.195.1', // Example Indian IP
    '78.46.89.147',  // Example German IP
    '202.88.0.1',    // Example Japanese IP
    '203.80.96.10'   // Example Australian IP
  ];

  console.log('=== IP TO COUNTRY MAPPING TEST ===');
  
  for (const ip of testIPs) {
    try {
      const result = await getCountryFromIp(ip);
      console.log(`${ip} → ${result?.country || 'Unknown'} (${result?.countryCode || 'N/A'})`);
    } catch (error) {
      console.log(`${ip} → Error: ${error}`);
    }
  }
}
