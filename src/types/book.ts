export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  coverImage?: string;
  totalPages: number;
  currentPage: number;
  status: 'to-read' | 'reading' | 'completed';
  notes: string[];
  review?: {
    rating: number;
    text: string;
    date: string;
  };
  lastUpdated: string;
}
