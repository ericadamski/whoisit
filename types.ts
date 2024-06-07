export interface Server {
  host: string;
  port?: number;
  punycode?: boolean;
  query?: string;
}

export interface Proxy {
  ipaddress: string;
  port: number;
  type?: number;
}

export interface LookupOptions {
  follow?: number;
  timeout?: number;
  server?: Server;
  proxy?: Proxy;
  encoding?: BufferEncoding;
  punycode?: boolean;
  bind?: string;
  verbose?: boolean;
}

export interface LookupResult {
  server: string;
  data: string;
}

interface WithServer {
  serverUrl: URL;
  serverConfig: Server;
}

interface WithProxy {
  proxyUrl: URL;
  proxyConfig?: Proxy;
}

export interface LookupConfig extends WithServer, Partial<WithProxy> {
  addr: string;
  options?: LookupOptions;
}

export interface LookupConfigWithProxy
  extends Omit<LookupConfig, keyof WithProxy>,
    WithProxy {}
