export type CitationFormat = {
  uid: string;
  internal: boolean;
  title: string;
  authors: string[];
  url: string;
  date: Date;
  thumbnail?: string;
  journal?: string;
};
