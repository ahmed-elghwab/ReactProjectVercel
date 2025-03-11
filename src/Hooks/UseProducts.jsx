import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useProducts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
      return response.data.data; // Assuming the data is nested under `data.data`
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry failed requests twice
  });

  return { data, isLoading, isError, error };
}