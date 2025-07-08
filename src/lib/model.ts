export type Option = {
  label: string;
  value: string;
};

export const Models: Option[] = [
  {
    label: "OpenAI | GPT-4o",
    value: "openai/gpt-4o",
  },
  {
    label: "OpenAI | GPT-3.5-Turbo-0613",
    value: "openai/gpt-3.5-turbo-0613",
  },
  {
    label: "MistralAI | Devstral Small (Free)",
    value: "mistralai/devstral-small:free",
  },
];
