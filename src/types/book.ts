export type NoteColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink';

export type Note = {
  id: string;
  text: string;
  page: number;
  color?: NoteColor; // Opcional para compatibilidade com notas antigas
  createdAt: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  totalPages: number;
  currentPage: number;
  status: 'to-read' | 'reading' | 'completed';
  genre?: string;
  publicationYear?: number;
  review?: string;
  rating?: number;
  notes?: Note[];
  lastUpdated: string;
};
