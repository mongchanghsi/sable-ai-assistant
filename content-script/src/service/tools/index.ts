import { ToolsName } from "./schema";

export const checkArgsExistWithinPromptV2 = (
  toolName: string,
  prompt: string,
  args: any
) => {
  const p = prompt.toLowerCase();

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

  const roughlyContains = (text: string, value?: string): boolean => {
    if (!value) return false;
    const normVal = normalize(value);
    const pattern = normVal
      .split(/\s+/)
      .map((word) => `(?=.*\\b${escapeRegex(word)}\\b)`)
      .join("");
    const regex = new RegExp(`${pattern}`, "i");
    return regex.test(p);
  };

  switch (toolName) {
    case ToolsName.CREATE_TASK:
      return (
        roughlyContains(p, args.description) &&
        roughlyContains(p, args.deadline)
      );
    default:
      return false;
  }
};

export function checkArgsExistWithinPrompt(
  toolName: string,
  prompt: string,
  args: any
): boolean {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const stem = (word: string) => {
    // Basic stemmer: remove -ing, -ed, -s (for simple verbs/nouns)
    return word.replace(/(ing|ed|s)$/, "");
  };

  const toStemmedSet = (str: string): Set<string> =>
    new Set(normalize(str).split(" ").map(stem).filter(Boolean));

  const matchRatio = (target: Set<string>, source: Set<string>) => {
    if (target.size === 0) return false;
    let matchCount = 0;
    target.forEach((word) => {
      if (source.has(word)) matchCount++;
    });
    return matchCount / target.size >= 0.8;
  };

  const promptWords = toStemmedSet(prompt);

  switch (toolName) {
    case ToolsName.CREATE_TASK:
      const descWords = toStemmedSet(args.description ?? "");
      const dateWords = toStemmedSet(args.deadline ?? "");

      const descMatch = matchRatio(descWords, promptWords);
      const dateMatch = matchRatio(dateWords, promptWords);

      return descMatch && dateMatch;
    default:
      return false;
  }
}

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const executeToolCall = async (toolName: string, args: any) => {
  let result;
  const argsObject = JSON.parse(args);
  console.log("Args", argsObject);

  try {
    switch (toolName) {
      case ToolsName.CREATE_TASK:
        console.log("Attempting to create task with" + args);
        try {
          if (
            argsObject.hasOwnProperty("deadline") &&
            argsObject.hasOwnProperty("description")
          ) {
            result = `Created task for ${argsObject["description"]} by ${argsObject["deadline"]}`;
          } else {
            result =
              "Insufficient information to create task. Please provide description and deadline for the task.";
          }
        } catch (error) {
        } finally {
          break;
        }
      default:
        console.log("No tooling found");
        result = "No callback function found for this tool";
    }
  } catch (error) {
    console.log("Something went wrong with execute tool call");
    result = "Something went wrong with executing tool";
  }

  return { toolName, result };
};
