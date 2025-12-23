export interface Book {
  id: number;
  name: string;
  type: string; // MIME type, e.g., "application/epub+zip", "application/pdf", "text/plain"
  data: Blob;
  size: number; // in bytes
  added: Date;
}
