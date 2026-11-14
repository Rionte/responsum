import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAskAssignmentQuestion } from "./tools/askAssignmentQuestion";
import { registerGetCurrentAssignment } from "./tools/getCurrentAssignment";
import { registerListAssignments } from "./tools/listAssignments";
import { registerReviewCode } from "./tools/reviewCode";

const server = new McpServer({ name: "responsum", version: "0.1.0" });

registerGetCurrentAssignment(server);
registerListAssignments(server);
registerAskAssignmentQuestion(server);
registerReviewCode(server);

await server.connect(new StdioServerTransport());

// stderr only: stdout is the MCP protocol channel
console.error("Responsum MCP server running on stdio");
