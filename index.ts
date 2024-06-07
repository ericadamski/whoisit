import ms from "ms";
import * as net from "node:net";
import * as url from "node:url";
import { SocksClient } from "socks";
import { SocksProxyType } from "socks/typings/common/constants";
import SERVERS from "./servers.json";
import {
  LookupConfig,
  LookupConfigWithProxy,
  LookupOptions,
  LookupResult,
  Server,
} from "./types";

type ServerRecord = string | null | Server | { ip: Server };

const FORMATED_SERVERS: Record<string, ServerRecord> = SERVERS;

function cleanParsingErrors(str: string) {
  return str.replace(/^[:\s]+/, "").replace(/^https?[:\/]+/, "") ?? str;
}

function getServerRecord(tld: string): Server | null {
  const value = FORMATED_SERVERS[tld];

  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    return { host: value };
  }

  if ("ip" in value) {
    return value.ip;
  }

  return value;
}

function getServerForAddress(addr: string): Server | null {
  let server: Server | null = null;

  if (addr.includes("@")) {
    throw new Error("lookup: email addresses are not supported");
  }

  if (net.isIP(addr) !== 0) {
    server = getServerRecord("_");
  } else {
    let tld = url.domainToASCII(addr);

    while (true) {
      server = getServerRecord(tld);

      if (tld === "" || server != null) {
        break;
      }

      tld = tld.replace(/^.+?(\.|$)/, "");
    }
  }

  return server;
}

function getProxyUrlFromOptions(maybeProxy: LookupOptions["proxy"]) {
  return maybeProxy == null
    ? null
    : new URL(
        `${maybeProxy.ipaddress}${
          maybeProxy.port == null ? "" : ":" + maybeProxy.port
        }`
      );
}

function lookupViaSocket(
  socket: net.Socket,
  config: LookupConfig
): Promise<string | LookupResult | LookupResult[]> {
  let idn = config.addr;

  if (config.serverConfig.punycode && config.options?.punycode) {
    idn = url.domainToASCII(config.addr);
  }

  if (config.options?.encoding != null) {
    socket.setEncoding(config.options.encoding);
  }

  const query = config.serverConfig.query;

  if (query == null) {
    throw new Error("Bad configuration; Missing query.");
  }

  socket.write(query.replace("$addr", idn));

  return new Promise<string | LookupResult | LookupResult[]>(
    (resolve, reject) => {
      let data = "";

      socket.on("data", (chunk: Buffer) => {
        data += chunk.toString();
      });

      socket.on("timeout", () => {
        socket.destroy();

        reject(new Error("lookup: timeout"));
      });

      socket.on("error", (err: Error) => {
        reject(err);
      });

      socket.on("close", async () => {
        if ((config.options?.follow ?? -Infinity) > 0) {
          const match = data
            .replace(/\r/gm, "")
            .match(
              /(ReferralServer|Registrar Whois|Whois Server|WHOIS Server|Registrar WHOIS Server|refer):[^\S\n]*((?:r?whois|https?):\/\/)?([0-9A-Za-z\.\-_]*)/
            );

          if (match != null && match[3] !== config.serverUrl.hostname) {
            try {
              const parts = await lookup(config.addr, {
                ...(config.options ?? {}),
                follow: (config.options?.follow ?? -Infinity) - 1,
                server: { host: cleanParsingErrors(match[3].trim()) },
              });

              resolve(
                config.options?.verbose
                  ? [
                      {
                        server: config.serverUrl.toString(),
                        data,
                      },
                    ]
                  : parts
              );
            } catch (error) {
              reject(error);
            }
          }
        }

        resolve(
          config.options?.verbose
            ? [
                {
                  server: config.serverUrl.toString(),
                  data,
                },
              ]
            : data
        );
      });
    }
  );
}

async function lookupWithProxy(config: LookupConfigWithProxy) {
  const { options, proxyUrl, serverUrl } = config;
  const proxyType = options?.proxy?.type ?? 5;

  const { socket } = await SocksClient.createConnection({
    proxy: {
      host: proxyUrl.host,
      port: +proxyUrl.port,
      type: proxyType as SocksProxyType,
    },
    destination: {
      host: serverUrl.host,
      port: +serverUrl.port,
    },
    command: "connect",
    timeout: options?.timeout,
  });

  if (options?.timeout != null) {
    socket.setTimeout(options.timeout);
  }

  const result = lookupViaSocket(socket, config);

  socket.resume();

  return result;
}

function lookupWithoutProxy(config: LookupConfig) {
  const { serverUrl, options } = config;

  const sockOpts: net.NetConnectOpts = {
    host: serverUrl.hostname,
    port: +serverUrl.port,
    localAddress: options?.bind,
  };

  const socket = net.connect(sockOpts);

  if (options?.timeout != null) {
    socket.setTimeout(options.timeout);
  }

  return lookupViaSocket(socket, config);
}

export async function lookup(
  addr: string,
  options: LookupOptions = { follow: 2, timeout: ms("1m") }
): Promise<string | LookupResult | LookupResult[]> {
  const server =
    options.server?.host == null ? getServerForAddress(addr) : options.server;

  if (server?.host == null) {
    throw new Error("lookup: no whois server is known for this kind of object");
  }

  const serverUrl = new URL("http://" + server.host);
  const proxyUrl = getProxyUrlFromOptions(options.proxy);

  if (server.query == null) {
    server.query = "$addr\r\n";
  }

  if (serverUrl.port === "") {
    let portNumber = server.port ?? 43;

    if (!Number.isInteger(portNumber)) {
      portNumber = 43;
    }

    serverUrl.port = portNumber.toString();
    server.port = portNumber;
  }

  if (proxyUrl != null) {
    return lookupWithProxy({
      addr,
      serverConfig: server,
      serverUrl,
      proxyConfig: options?.proxy,
      proxyUrl,
      options,
    });
  }

  return lookupWithoutProxy({
    addr,
    serverUrl,
    serverConfig: server,
    options,
  });
}
