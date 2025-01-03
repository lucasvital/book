import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

const api = axios.create({
  baseURL: BASE_URL,
});

export interface GoogleBookResponse {
  items?: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      categories?: string[];
      publishedDate?: string;
      pageCount?: number;
      imageLinks?: {
        thumbnail: string;
        smallThumbnail?: string;
      };
      description?: string;
    };
  }>;
  totalItems: number;
  kind: string;
}

export const searchBooks = async (query: string) => {
  try {
    console.log('Searching for:', query);
    const response = await api.get<GoogleBookResponse>('', {
      params: {
        q: query,
        maxResults: 20,
        printType: 'books',
      },
    });

    console.log('API Response:', JSON.stringify(response.data.items?.[0]?.volumeInfo, null, 2));

    if (!response.data.items) {
      console.log('No items found');
      return [];
    }

    return response.data.items.map((item) => {
      const volumeInfo = item.volumeInfo;
      return {
        id: item.id,
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors?.[0] || 'Unknown Author',
        genre: volumeInfo.categories?.[0] || 'Unknown Genre',
        publicationYear: volumeInfo.publishedDate 
          ? parseInt(volumeInfo.publishedDate.split('-')[0]) 
          : 0,
        coverImage: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
        totalPages: volumeInfo.pageCount || 0,
        currentPage: 0,
        status: 'to-read' as const,
        notes: [],
        lastUpdated: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};
