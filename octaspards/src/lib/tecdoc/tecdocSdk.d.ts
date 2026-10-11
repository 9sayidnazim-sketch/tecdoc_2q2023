export class TecDocSDK {
  apiKey: string;
  providerId: number;
  country: string;
  lang: string;
  mode: string;
  pegasusEndpoint: string;
  timeoutMs: number;

  constructor(options?: Record<string, any>);
  configure(newConfig?: Record<string, any>): this;
  getManufacturers(params?: Record<string, any>): Promise<any>;
  getModelSeries(params?: Record<string, any>): Promise<any>;
  getVehicleDetails(params?: Record<string, any>): Promise<any>;
  searchArticles(params?: Record<string, any>): Promise<any>;
  getArticleCrossReferences(params?: Record<string, any>): Promise<any>;
  getArticleBOM(params?: Record<string, any>): Promise<any>;
  getAssemblyTree(params?: Record<string, any>): Promise<any>;
  decodeVin(params?: Record<string, any>): Promise<any>;
  pegasusCall(method: string, params?: Record<string, any>): Promise<any>;
  generateCodeSnippet(options?: Record<string, any>): string;
  [key: string]: any;
}

export const tecdoc: TecDocSDK;
export const TecDocClient: typeof TecDocSDK;
export default TecDocSDK;
