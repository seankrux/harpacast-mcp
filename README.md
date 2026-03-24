<div align="center">

  <h1>HarpaCast MCP</h1>

  <p><strong>The fastest way to bring real browser intelligence into your AI workflows</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MCP-1.0-8B5CF6?style=for-the-badge" alt="MCP" />
  </p>

</div>

---

HarpaCast MCP bridges [HARPA AI](https://harpa.ai/) with any MCP-compatible client, exposing browser automation, web scraping, and AI-powered analysis as first-class tools in Raycast, Claude Desktop, Cursor, and beyond. Stop copy-pasting between browser tabs and AI assistants — let your AI read, search, and reason over the live web directly.

<br>

## Why HarpaCast?

Most AI tools are cut off from the live web. HarpaCast changes that by wiring HARPA AI's battle-tested browser engine directly into the MCP ecosystem, so any compatible client gains real browsing capability without writing a line of Playwright or Puppeteer.

> **Live web, not stale training data** — Scrape and search the actual internet at query time, not from a cached snapshot

> **One integration, every client** — Configure once, use from Raycast, Claude Desktop, Cursor, or any MCP host

> **Structured extraction out of the box** — CSS and XPath selectors return clean, labeled data instead of raw HTML soup

> **HARPA's AI commands, exposed as tools** — Summarize, translate, extract, and more without leaving your AI workflow

> **No browser automation boilerplate** — No Selenium setup, no headless Chrome config, no proxy wrangling

<br>

## Features

| Tool | Description |
|------|-------------|
| `scrape_page` | Extract full-page content or targeted elements via CSS / XPath selectors |
| `search_web` | Perform web searches through HARPA's search engine |
| `run_ai_command` | Execute built-in HARPA commands — summarize, extract, translate, and more |
| `run_ai_prompt` | Run custom AI prompts with optional web-page context |
| `scrape_multiple_elements` | Batch-extract structured data from any page |

<br>

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | >= 18 |
| HARPA API key | [Get one here](https://harpa.ai/) |
| MCP client | Raycast, Claude Desktop, Cursor, or any MCP-compatible host |

<br>

## Quick Start

### 1. Clone and build

```bash
git clone https://github.com/seankrux/harpacast-mcp.git
cd harpacast-mcp
npm install
npm run build
```

### 2. Locate the server binary

```bash
echo "$(pwd)/build/index.js"
```

Copy the output path for the next step.

### 3. Configure your MCP client

<details>
<summary><strong>Raycast</strong></summary>

Open **Raycast Settings** `Cmd + ,` ▸ **Extensions** ▸ **MCP Servers** ▸ **Add Server**, then paste:

```json
{
  "mcpServers": {
    "harpa": {
      "command": "node",
      "args": ["/absolute/path/to/harpacast-mcp/build/index.js"],
      "env": {
        "HARPA_API_KEY": "your-harpa-api-key"
      }
    }
  }
}
```

Restart Raycast after saving.
</details>

<details>
<summary><strong>Claude Desktop</strong></summary>

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "harpa": {
      "command": "node",
      "args": ["/absolute/path/to/harpacast-mcp/build/index.js"],
      "env": {
        "HARPA_API_KEY": "your-harpa-api-key"
      }
    }
  }
}
```

Restart Claude Desktop after saving.
</details>

<details>
<summary><strong>Cursor / Other MCP hosts</strong></summary>

Use the same JSON structure above, adapting it to your client's MCP configuration format. The server communicates over **stdio**.
</details>

<br>

## Tool Reference

### `scrape_page`

Extract content from a web page. Supports full-page scraping or targeted element extraction.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | Yes | Target URL |
| `selectors` | `array` | No | CSS/XPath selectors with labels |
| `timeout` | `number` | No | Timeout in ms (default: 30 000) |

```json
{
  "url": "https://example.com",
  "selectors": [
    { "selector": "h1", "label": "title", "take": "text" },
    { "selector": ".content", "label": "body", "take": "html" }
  ]
}
```

### `search_web`

Perform a web search and receive structured results.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | `string` | Yes | Search query |
| `timeout` | `number` | No | Timeout in ms (default: 30 000) |

### `run_ai_command`

Execute a predefined HARPA AI command on a page or with custom inputs.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `command_name` | `string` | Yes | Command identifier (e.g. `summarize-page`) |
| `url` | `string` | No | Target URL |
| `inputs` | `string[]` | No | Additional input parameters |
| `connection` | `string` | No | AI model connection override |
| `timeout` | `number` | No | Timeout in ms (default: 60 000) |

### `run_ai_prompt`

Run a custom AI prompt with optional web-page context.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | `string` | Yes | The prompt to execute |
| `url` | `string` | No | URL for context |
| `connection` | `string` | No | AI model connection override |
| `timeout` | `number` | No | Timeout in ms (default: 60 000) |

### `scrape_multiple_elements`

Batch-extract multiple elements from a single page.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | Yes | Target URL |
| `elements` | `array` | Yes | Elements to extract (selector, label, take, at) |
| `timeout` | `number` | No | Timeout in ms (default: 30 000) |

```json
{
  "url": "https://news.ycombinator.com",
  "elements": [
    { "selector": ".titleline > a", "label": "titles", "at": "all" },
    { "selector": ".score", "label": "scores", "at": "all" }
  ]
}
```

<br>

## Verification

Test the server locally before connecting a client:

```bash
export HARPA_API_KEY="your-harpa-api-key"
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node build/index.js
```

A successful response returns a JSON object listing all five tools.

<br>

## Troubleshooting

| Symptom | Resolution |
|---------|------------|
| `command not found: node` | Install Node.js >= 18 from [nodejs.org](https://nodejs.org/) |
| `Cannot find module` | Run `npm install && npm run build` |
| `HARPA_API_KEY environment variable is required` | Ensure the `env` block is present in your MCP client config |
| `HARPA API error: 401` | Regenerate your API key in the HARPA Chrome extension ▸ Automate tab |
| Path not recognized by client | Use an **absolute** path (e.g. `/Users/you/harpacast-mcp/build/index.js`) |

<br>

## Project Structure

```
harpacast-mcp/
  src/
    index.ts          -- MCP server entry point
  build/              -- Compiled output (generated)
  package.json
  tsconfig.json
  .gitignore
```

<br>

## Contributing

Contributions are welcome. Here is the recommended workflow:

1. **Fork** the repository and create a feature branch: `feat/your-feature-name`
2. **Install dependencies** with `npm install` and confirm `npm run build` passes before making changes
3. **Implement** your change, keeping commits focused and using [Conventional Commits](https://www.conventionalcommits.org/) style (`feat:`, `fix:`, `docs:`, etc.)
4. **Test** your change locally using the verification command above
5. **Open a pull request** against `main` with a clear description of what changed and why

### Good first contributions

- Additional MCP tool wrappers for HARPA commands not yet exposed
- Improved error messages and validation
- Example prompts and usage recipes in the docs
- Automated tests using the MCP test harness

Please open an issue before starting significant work so we can discuss the approach first.

<br>

## Roadmap

> Items are not guaranteed or time-bound.

- [ ] `navigate_and_interact` tool for click/form-fill automation
- [ ] Streaming support for long-running AI commands
- [ ] `npx`-based zero-install startup (no clone required)
- [ ] Published npm package for easier version management
- [ ] Configuration schema validation with helpful error output
- [ ] Example gallery: research workflows, price monitors, content pipelines

Have an idea? [Open an issue](https://github.com/seankrux/harpacast-mcp/issues) to discuss it.

<br>

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a full history of releases and changes.

> No formal releases yet — the project is in active early development. Breaking changes will be noted in commit messages until v1.0.

<br>

## Resources

> [HARPA GRID API Reference](https://harpa.ai/grid/grid-rest-api-reference)

> [Model Context Protocol Specification](https://modelcontextprotocol.io/)

> [Raycast MCP Documentation](https://developers.raycast.com/)

<br>

<div align="center">
  <sub>Built by <a href="https://www.seanguillermo.com"><strong>Sean G</strong></a></sub>
</div>
