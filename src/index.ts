#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// HARPA API configuration
const HARPA_API_KEY = process.env.HARPA_API_KEY;
const HARPA_API_URL = "https://api.harpa.ai/api/v1/grid";

if (!HARPA_API_KEY) {
  console.error("HARPA_API_KEY environment variable is required");
  process.exit(1);
}

// HARPA API client
async function callHarpaAPI(payload: any): Promise<any> {
  const response = await fetch(HARPA_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HARPA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HARPA API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Create MCP server
const server = new Server(
  {
    name: "harpacast-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
const tools: Tool[] = [
  {
    name: "scrape_page",
    description: "Scrape content from a web page. Can extract full page content or specific elements using CSS/XPath selectors.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the page to scrape",
        },
        selectors: {
          type: "array",
          description: "Optional array of selectors to extract specific elements",
          items: {
            type: "object",
            properties: {
              selector: {
                type: "string",
                description: "CSS or XPath selector",
              },
              selectorType: {
                type: "string",
                enum: ["css", "xpath"],
                description: "Type of selector (default: css)",
              },
              label: {
                type: "string",
                description: "Label for the extracted data",
              },
              take: {
                type: "string",
                enum: ["text", "html", "attribute"],
                description: "What to extract (default: text)",
              },
            },
            required: ["selector", "label"],
          },
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds (default: 30000)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "search_web",
    description: "Perform a web search using HARPA's search engine. Returns search results with titles, URLs, and snippets.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds (default: 30000)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "run_ai_command",
    description: "Execute a predefined HARPA AI command on a web page or with custom inputs. Commands include summarize, extract, translate, etc.",
    inputSchema: {
      type: "object",
      properties: {
        command_name: {
          type: "string",
          description: "Name of the HARPA AI command to run (e.g., 'summarize-page', 'extract-data')",
        },
        url: {
          type: "string",
          description: "Optional URL to run the command on",
        },
        inputs: {
          type: "array",
          description: "Optional array of input parameters for the command",
          items: {
            type: "string",
          },
        },
        connection: {
          type: "string",
          description: "Optional AI model connection to use",
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds (default: 60000)",
        },
      },
      required: ["command_name"],
    },
  },
  {
    name: "run_ai_prompt",
    description: "Execute a custom AI prompt with optional context from a web page. Use this for flexible AI-powered analysis and generation.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The AI prompt to execute",
        },
        url: {
          type: "string",
          description: "Optional URL to provide context for the prompt",
        },
        connection: {
          type: "string",
          description: "Optional AI model connection to use",
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds (default: 60000)",
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "scrape_multiple_elements",
    description: "Extract multiple specific elements from a web page using CSS or XPath selectors. Useful for structured data extraction.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the page to scrape",
        },
        elements: {
          type: "array",
          description: "Array of elements to extract",
          items: {
            type: "object",
            properties: {
              selector: {
                type: "string",
                description: "CSS or XPath selector",
              },
              selectorType: {
                type: "string",
                enum: ["css", "xpath"],
                description: "Type of selector (default: css)",
              },
              label: {
                type: "string",
                description: "Label for the extracted data",
              },
              take: {
                type: "string",
                enum: ["text", "html", "attribute"],
                description: "What to extract (default: text)",
              },
              at: {
                type: "string",
                description: "Index of element to extract (e.g., '0', 'all')",
              },
            },
            required: ["selector", "label"],
          },
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds (default: 30000)",
        },
      },
      required: ["url", "elements"],
    },
  },
];

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "scrape_page": {
        const { url, selectors, timeout } = args as {
          url: string;
          selectors?: Array<{
            selector: string;
            selectorType?: string;
            label: string;
            take?: string;
          }>;
          timeout?: number;
        };

        const payload: any = {
          action: "scrape",
          url,
          timeout: timeout || 30000,
        };

        if (selectors && selectors.length > 0) {
          payload.grab = selectors.map((s) => ({
            selector: s.selector,
            selectorType: s.selectorType || "css",
            label: s.label,
            take: s.take || "text",
          }));
        }

        const result = await callHarpaAPI(payload);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "search_web": {
        const { query, timeout } = args as {
          query: string;
          timeout?: number;
        };

        const payload = {
          action: "serp",
          query,
          timeout: timeout || 30000,
        };

        const result = await callHarpaAPI(payload);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "run_ai_command": {
        const { command_name, url, inputs, connection, timeout } = args as {
          command_name: string;
          url?: string;
          inputs?: string[];
          connection?: string;
          timeout?: number;
        };

        const payload: any = {
          action: "command",
          name: command_name,
          timeout: timeout || 60000,
        };

        if (url) payload.url = url;
        if (inputs) payload.inputs = inputs;
        if (connection) payload.connection = connection;

        const result = await callHarpaAPI(payload);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "run_ai_prompt": {
        const { prompt, url, connection, timeout } = args as {
          prompt: string;
          url?: string;
          connection?: string;
          timeout?: number;
        };

        const payload: any = {
          action: "prompt",
          prompt,
          timeout: timeout || 60000,
        };

        if (url) payload.url = url;
        if (connection) payload.connection = connection;

        const result = await callHarpaAPI(payload);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "scrape_multiple_elements": {
        const { url, elements, timeout } = args as {
          url: string;
          elements: Array<{
            selector: string;
            selectorType?: string;
            label: string;
            take?: string;
            at?: string;
          }>;
          timeout?: number;
        };

        const payload = {
          action: "scrape",
          url,
          grab: elements.map((e) => ({
            selector: e.selector,
            selectorType: e.selectorType || "css",
            label: e.label,
            take: e.take || "text",
            ...(e.at && { at: e.at }),
          })),
          timeout: timeout || 30000,
        };

        const result = await callHarpaAPI(payload);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("HarpaCast MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
