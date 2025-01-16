export interface IBlog {
  id: string;
  title: string;
  description: string[];
  thumbnails?: string[];
}

export interface Blog {
  title: string;
  description: string[];
  thumbnails?: string[];
}

export interface IBlogResponse {
  code: number;
  message: string;
}
