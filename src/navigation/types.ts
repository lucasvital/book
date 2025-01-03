import { Book } from '../types/book';

export type RootStackParamList = {
  Home: undefined;
  BookDetails: { book: Book };
  AddBook: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
