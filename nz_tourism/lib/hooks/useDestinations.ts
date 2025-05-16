import useSWR from 'swr';

export interface Destination {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  highlights: string[];
  bestTimeToVisit: string;
  activities: string[];
  priceRange: string;
  rating: number;
  reviews: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      return null; // Return null for not found instead of throwing
    }
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

export function useDestinations() {
  const { data, error, isLoading } = useSWR<Destination[]>('/api/destinations', fetcher);

  return {
    destinations: data,
    isLoading,
    isError: error
  };
}

export function useDestination(id: string) {
  const { data, error, isLoading } = useSWR<Destination | null>(
    id ? `/api/destinations?id=${id}` : null,
    fetcher
  );

  return {
    destination: data,
    isLoading,
    isError: error,
    notFound: !error && data === null
  };
} 