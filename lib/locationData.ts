// Major cities worldwide for autocomplete
export const MAJOR_CITIES = [
  // Europe
  { name: "London, UK", size: "major" },
  { name: "Paris, France", size: "major" },
  { name: "Berlin, Germany", size: "major" },
  { name: "Amsterdam, Netherlands", size: "major" },
  { name: "Barcelona, Spain", size: "major" },
  { name: "Madrid, Spain", size: "major" },
  { name: "Milan, Italy", size: "major" },
  { name: "Rome, Italy", size: "major" },
  { name: "Vienna, Austria", size: "major" },
  { name: "Prague, Czech Republic", size: "major" },
  { name: "Warsaw, Poland", size: "major" },
  { name: "Budapest, Hungary", size: "major" },
  { name: "Lisbon, Portugal", size: "major" },
  { name: "Stockholm, Sweden", size: "major" },
  { name: "Copenhagen, Denmark", size: "major" },
  { name: "Dublin, Ireland", size: "major" },
  { name: "Athens, Greece", size: "major" },
  { name: "Istanbul, Turkey", size: "major" },
  { name: "Moscow, Russia", size: "major" },
  { name: "St. Petersburg, Russia", size: "major" },
  { name: "Zagreb, Croatia", size: "major" },
  { name: "Belgrade, Serbia", size: "major" },
  { name: "Ljubljana, Slovenia", size: "minor" },
  { name: "Bucharest, Romania", size: "major" },
  { name: "Sofia, Bulgaria", size: "major" },

  // North America
  { name: "New York, USA", size: "major" },
  { name: "Los Angeles, USA", size: "major" },
  { name: "Chicago, USA", size: "major" },
  { name: "San Francisco, USA", size: "major" },
  { name: "Miami, USA", size: "major" },
  { name: "Seattle, USA", size: "major" },
  { name: "Boston, USA", size: "major" },
  { name: "Toronto, Canada", size: "major" },
  { name: "Vancouver, Canada", size: "major" },
  { name: "Mexico City, Mexico", size: "major" },

  // South America
  { name: "São Paulo, Brazil", size: "major" },
  { name: "Rio de Janeiro, Brazil", size: "major" },
  { name: "Buenos Aires, Argentina", size: "major" },
  { name: "Bogotá, Colombia", size: "major" },
  { name: "Lima, Peru", size: "major" },
  { name: "Santiago, Chile", size: "major" },

  // Asia
  { name: "Tokyo, Japan", size: "major" },
  { name: "Singapore, Singapore", size: "major" },
  { name: "Hong Kong", size: "major" },
  { name: "Shanghai, China", size: "major" },
  { name: "Beijing, China", size: "major" },
  { name: "Seoul, South Korea", size: "major" },
  { name: "Bangkok, Thailand", size: "major" },
  { name: "Mumbai, India", size: "major" },
  { name: "New Delhi, India", size: "major" },
  { name: "Bangalore, India", size: "major" },
  { name: "Jakarta, Indonesia", size: "major" },
  { name: "Manila, Philippines", size: "major" },
  { name: "Hanoi, Vietnam", size: "major" },
  { name: "Ho Chi Minh City, Vietnam", size: "major" },
  { name: "Dubai, UAE", size: "major" },
  { name: "Tel Aviv, Israel", size: "major" },
  { name: "Kuala Lumpur, Malaysia", size: "major" },
  { name: "Taipei, Taiwan", size: "major" },

  // Australia & Oceania
  { name: "Sydney, Australia", size: "major" },
  { name: "Melbourne, Australia", size: "major" },
  { name: "Auckland, New Zealand", size: "major" },

  // Africa
  { name: "Cairo, Egypt", size: "major" },
  { name: "Lagos, Nigeria", size: "major" },
  { name: "Johannesburg, South Africa", size: "major" },
  { name: "Nairobi, Kenya", size: "major" },
];

export function getMatchingCities(input: string): typeof MAJOR_CITIES {
  if (!input.trim()) return [];
  const lowerInput = input.toLowerCase();
  return MAJOR_CITIES.filter((city) => city.name.toLowerCase().includes(lowerInput)).slice(0, 10);
}

export function isMajorCity(cityName: string): boolean {
  return MAJOR_CITIES.some((city) => city.name.toLowerCase() === cityName.toLowerCase() && city.size === "major");
}
