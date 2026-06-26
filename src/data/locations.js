// World location data used for registration & search filters.
// Each city carries an approximate lat/lng used for map embeds & distance sorting.
export const COUNTRIES = [
  {
    code: 'NG',
    name: 'Nigeria',
    regions: [
      { name: 'Lagos', cities: [
        { name: 'Lagos Island', lat: 6.4541, lng: 3.3947 },
        { name: 'Ikeja', lat: 6.6018, lng: 3.3515 },
        { name: 'Lekki', lat: 6.4698, lng: 3.5852 },
      ]},
      { name: 'Edo', cities: [
        { name: 'Benin City', lat: 6.3350, lng: 5.6037 },
        { name: 'Auchi', lat: 7.0667, lng: 6.2667 },
      ]},
      { name: 'Abuja (FCT)', cities: [
        { name: 'Garki', lat: 9.0333, lng: 7.4833 },
        { name: 'Wuse', lat: 9.0667, lng: 7.4833 },
      ]},
      { name: 'Rivers', cities: [
        { name: 'Port Harcourt', lat: 4.8156, lng: 7.0498 },
      ]},
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    regions: [
      { name: 'Greater London', cities: [
        { name: 'Peckham', lat: 51.4720, lng: -0.0697 },
        { name: 'Brixton', lat: 51.4613, lng: -0.1156 },
        { name: 'East London', lat: 51.5450, lng: -0.0553 },
      ]},
      { name: 'West Midlands', cities: [
        { name: 'Birmingham', lat: 52.4862, lng: -1.8904 },
      ]},
      { name: 'Greater Manchester', cities: [
        { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
      ]},
    ],
  },
  {
    code: 'US',
    name: 'United States',
    regions: [
      { name: 'New York', cities: [
        { name: 'Brooklyn', lat: 40.6782, lng: -73.9442 },
        { name: 'Harlem', lat: 40.8116, lng: -73.9465 },
      ]},
      { name: 'Texas', cities: [
        { name: 'Houston', lat: 29.7604, lng: -95.3698 },
        { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
      ]},
      { name: 'Georgia', cities: [
        { name: 'Atlanta', lat: 33.7490, lng: -84.3880 },
      ]},
      { name: 'California', cities: [
        { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
      ]},
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    regions: [
      { name: 'Ontario', cities: [
        { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
      ]},
      { name: 'Alberta', cities: [
        { name: 'Calgary', lat: 51.0447, lng: -114.0719 },
      ]},
    ],
  },
  {
    code: 'GH',
    name: 'Ghana',
    regions: [
      { name: 'Greater Accra', cities: [
        { name: 'Accra', lat: 5.6037, lng: -0.1870 },
      ]},
      { name: 'Ashanti', cities: [
        { name: 'Kumasi', lat: 6.6885, lng: -1.6244 },
      ]},
    ],
  },
  {
    code: 'ZA',
    name: 'South Africa',
    regions: [
      { name: 'Gauteng', cities: [
        { name: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
      ]},
      { name: 'Western Cape', cities: [
        { name: 'Cape Town', lat: -33.9249, lng: 18.4241 },
      ]},
    ],
  },
];

export function findCity(countryCode, regionName, cityName) {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  const region = country?.regions.find((r) => r.name === regionName);
  return region?.cities.find((c) => c.name === cityName);
}
