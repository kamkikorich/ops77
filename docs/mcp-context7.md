# MCP Context7

## Tujuan
Context7 ialah MCP server yang membekalkan dokumentasi kod yang terkini kepada agent/IDE yang menyokong MCP.

## Persediaan (dalam repo ini)
1. Letak API key dalam fail `.env` (rujuk `.env.example`)
2. Jalankan:

```bash
npm run mcp:context7
```

Jika anda mahu semak command yang akan dijalankan tanpa start server:

```bash
npm run mcp:context7 -- --print
```

## Konfigurasi MCP client
Repo ini sediakan contoh konfigurasi:

- `mcp.context7.example.json`

Salin kandungan fail itu ke lokasi konfigurasi MCP client/IDE anda dan gantikan `YOUR_CONTEXT7_API_KEY`.

