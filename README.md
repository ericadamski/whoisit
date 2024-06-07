# whoisit

`whoisit` is a small (~30kb gzipped) TypeScript WHOIS client for Node.js.

## Installation

```
$ npm i whoisit
```

#### Usage

```typescript
import { lookup } from "whoisit";

console.log(await lookup("google.com"));
```

## Contributing

Contributions are welcome.

#### Original CoffeeScript Source

Many thanks to the author of: https://github.com/FurqanSoftware/node-whois for the original source of this project.
