export const AUTODOC_CATEGORIES: any[];
export const AUTODOC_ARTICLES: any[];

export class AutodocService {
  constructor(options?: Record<string, any>);
  getNews(options?: Record<string, any>): Promise<any>;
  getNewsItem(id: number | string): Promise<any>;
  searchNews(query: string, options?: Record<string, any>): Promise<any>;
}

export const autodocService: AutodocService;
export default autodocService;
