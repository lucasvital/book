export interface Note {
  id: string;
  bookId: string;
  page: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  highlight?: string;
}
