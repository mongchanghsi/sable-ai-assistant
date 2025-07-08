import OpenAI from "openai";

export enum ToolsName {
  CREATE_TASK = "create_task",
}

/**
 * Add more functions here for tools
 */
export const ToolsSchema: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: ToolsName.CREATE_TASK,
      description: "Create a new task",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "Description or the title of the task",
          },
          deadline: {
            type: "string",
            description:
              "Deadline for the task to be completed by. Always in ISO 8601 datetime format",
          },
        },
        required: ["description"],
      },
    },
  },
];
