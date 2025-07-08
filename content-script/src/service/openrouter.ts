import OpenAI from "openai";
import { ToolsSchema } from "./tools/schema";
import { executeToolCall } from "./tools";

// Check other models from https://openrouter.ai/api/v1/models
enum MODELS {
  OPENAI_GPT4O = "openai/gpt-4o",
  OPENAI_GPT35 = "openai/gpt-3.5-turbo-0613",
  MISTRAL_FREE = "mistralai/devstral-small:free",
}

type OpenRouterResponse = {
  id: string;
  provider: string;
  model: string;
  object: string;
  created: number;
  choices: {
    logprobs: any;
    finish_reason: string;
    native_finish_reason: string;
    index: number;
    message: {
      role: string;
      content: string;
      refusal: any;
      reasoning: any;
    };
  }[];
  system_fingerprint: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details: {
      cached_tokens: number;
    };
    completion_tokens_details: {
      reasoning_tokens: number;
    };
  };
};

const removeLatestUserAndEverythingAfter = (
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] => {
  // To clean up the context in the event that the LLM generate trashy response that the OpenRouter is unable to take in as input
  let lastUserIndex = -1;

  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      lastUserIndex = i;
      break;
    }
  }
  if (lastUserIndex === -1) return messages;
  return messages.slice(0, lastUserIndex);
};

class OpenRouter {
  private selectedModel = MODELS.OPENAI_GPT35;
  private apiKey: string = "";
  private context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  constructor({ apiKey, model }: { apiKey: string; model: string }) {
    this.selectedModel = model as MODELS;
    this.apiKey = apiKey;
  }

  private getOpenAIObject() {
    return new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: this.apiKey,
      defaultHeaders: {
        "HTTP-Referer": "",
        "X-Title": "Sable Assistant",
      },
      dangerouslyAllowBrowser: true,
    });
  }

  async getResponse(prompt: string): Promise<string> {
    const maxFollowupRounds = 3;
    let roundsCompleted = 0;
    let currentResponse;
    let shouldContinue = true;

    try {
      this.context =
        this.context.length === 0
          ? [
              {
                role: "system",
                content:
                  "You are a helpful assistant. If the user’s request lacks key information needed to execute a tool, do not guess. Instead, ask the user for clarification first. Current system time is " +
                  Date(),
              },
              { role: "user", content: prompt },
            ]
          : [...this.context, { role: "user", content: prompt }];
      const firstResponse =
        await this.getOpenAIObject().chat.completions.create({
          model: this.selectedModel,
          messages: this.context,
          tools: ToolsSchema,
          tool_choice: "auto",
        });
      console.log("First Response", firstResponse);
      currentResponse = firstResponse;
      const allToolsResult = [];

      while (shouldContinue && roundsCompleted < maxFollowupRounds) {
        if (currentResponse.hasOwnProperty("error")) {
          console.log("Response has error", currentResponse);
          throw new Error("Response has error");
        }

        const assistantMessage = currentResponse.choices[0].message;

        // Break loop if there are no tools required
        if (
          !assistantMessage.tool_calls ||
          assistantMessage.tool_calls.length === 0
        ) {
          shouldContinue = false;
          break;
        }

        console.log(
          `In Round ${roundsCompleted + 1} | Processing ${JSON.stringify(assistantMessage.tool_calls)} tools`
        );

        const toolsResult = assistantMessage.tool_calls.map(async (tc) => {
          // const ok = checkArgsExistWithinPrompt(
          //   tc.function.name,
          //   prompt,
          //   JSON.parse(tc.function.arguments)
          // );
          // console.log("checkArgsExistWithinPrompt", ok);

          // if (
          //   !checkArgsExistWithinPrompt(
          //     tc.function.name,
          //     prompt,
          //     JSON.parse(tc.function.arguments)
          //   )
          // ) {
          //   console.log("Arguments doesn't exist");
          //   return {
          //     tool_call_id: tc.id,
          //     tool_name: tc.function.name,
          //     toolResponse: {
          //       toolName: tc.function.name,
          //       output:
          //         "Insufficient information to create task. Please provide description and deadline for the task.",
          //     },
          //   };
          // }

          const toolResponse = await executeToolCall(
            tc.function.name,
            tc.function.arguments
          );
          return {
            tool_call_id: tc.id,
            tool_name: tc.function.name,
            toolResponse,
          };
        });

        const awaitedToolsResult = await Promise.all(toolsResult);
        allToolsResult.push(...awaitedToolsResult);
        console.log("toolsResult", awaitedToolsResult);
        this.context.push({
          role: assistantMessage.role,
          content:
            assistantMessage.content === "" ? null : assistantMessage.content,
          tool_calls: assistantMessage.tool_calls,
        });

        const toolResponseMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
          awaitedToolsResult.map((tr) => {
            return {
              role: "tool",
              tool_call_id: tr.tool_call_id,
              // name: tr.tool_name,
              content: tr.toolResponse.result ?? "",
            };
          });

        this.context.push(...toolResponseMessages);

        // Follow up request if max follow up is not used up
        if (roundsCompleted < maxFollowupRounds - 1) {
          const followUpResponse =
            await this.getOpenAIObject().chat.completions.create({
              model: this.selectedModel,
              messages: this.context,
              tools: ToolsSchema,
            });
          currentResponse = followUpResponse;
          roundsCompleted++;
        } else {
          const finalResponse =
            await this.getOpenAIObject().chat.completions.create({
              model: this.selectedModel,
              messages: this.context,
            });
          currentResponse = finalResponse;
          shouldContinue = false;
        }
      }

      // Add in the final currentResponse that is not captured in the loop
      const finalAdditionResponse = currentResponse.choices[0].message;
      this.context.push({
        role: finalAdditionResponse.role,
        content:
          finalAdditionResponse.content === ""
            ? null
            : finalAdditionResponse.content,
        tool_calls: finalAdditionResponse.tool_calls,
      });

      return (
        currentResponse.choices[0].message.content ??
        "Something went wrong. Please try again."
      );
    } catch (error) {
      console.log(error);
      this.context = removeLatestUserAndEverythingAfter(this.context);
      return "Something went wrong. Please try again.";
    }
  }
}

export default OpenRouter;
