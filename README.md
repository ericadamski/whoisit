# whoisit

`whoisit` is a small (~30kb gzipped) TypeScript WHOIS client for Node.js.

## Installation

```
$ npm i whoisit
```

#### Usage

- Get the raw WHOIS details

  ```typescript
  import { lookup } from "whoisit";

  console.log(await lookup("google.com"));
  ```

- Get location information for an IP address

  ```typescript
  import { getIpLocationInfo } from "whoisit";

  console.log(await getIpLocationInfo("19.34.45.123")); // { address: 'P.O. Box 2053, RM E-1121', city: 'Dearborn', region: 'MI', postalCode: '48121-2053', country: 'US' }
  ```

## Contributing

Contributions are welcome.

#### Original CoffeeScript Source

Many thanks to the author of: https://github.com/FurqanSoftware/node-whois for the original source of this project.
