
export interface Book {
  id: number;
  name: string;
  type: string;
  data: Blob;
  size: number;
  added: Date;
}

export interface MockFile {
    id: string;
    name: string;
    mimeType: string;
    url: string;
    size: string; // e.g., "15.3 MB"
}
