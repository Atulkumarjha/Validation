## IP Address Allocation & Country Mapping System

### **Global IP Address Management**

The internet uses a hierarchical system for IP address allocation:

```
IANA (Internet Assigned Numbers Authority)
    ↓
Regional Internet Registries (RIRs)
    ↓
Internet Service Providers (ISPs)
    ↓
End Users
```

### **Regional Internet Registries (RIRs):**

1. **ARIN** (American Registry for Internet Numbers)
   - Covers: United States, Canada, parts of Caribbean
   - IP Ranges: Many blocks including 8.8.8.0/24 (Google)

2. **RIPE NCC** (Réseaux IP Européens Network Coordination Centre)
   - Covers: Europe, Middle East, Central Asia
   - IP Ranges: 2.0.0.0/8, 5.0.0.0/8, etc.

3. **APNIC** (Asia-Pacific Network Information Centre)
   - Covers: Asia-Pacific region including India, China, Japan
   - IP Ranges: 1.0.0.0/8, 14.0.0.0/8, etc.

4. **LACNIC** (Latin America and Caribbean Network Information Centre)
   - Covers: Latin America and Caribbean
   - IP Ranges: 177.0.0.0/8, 179.0.0.0/8, etc.

5. **AFRINIC** (African Network Information Centre)
   - Covers: Africa
   - IP Ranges: 41.0.0.0/8, 105.0.0.0/8, etc.

### **How Geolocation Databases Work:**

1. **Data Collection:**
   - RIR allocation records (public)
   - ISP registration data
   - BGP routing tables
   - WHOIS database queries
   - Crowdsourced data from users

2. **Data Processing:**
   - Map IP blocks to countries
   - Cross-reference multiple sources
   - Update databases regularly
   - Handle IP reassignments

3. **Commercial Databases:**
   - MaxMind GeoIP2
   - IP2Location
   - ipapi.co
   - ip-api.com (what we use)
