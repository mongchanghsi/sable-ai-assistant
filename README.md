# Sable AI Assistant

Give AI some tasks and they will help you to call the specific backend services and perform actions on them

## How to use

1. Perform `npm run build`
2. Go to Chrome Extension and import the `dist` folder
3. Within the Extension Pop up, add in your OpenRouter API Key and select the model
4. Ensure that your OpenRouter has sufficient credits if you want to use ChatGPT model (at the moment only ChatGPT models support toot_calls)

## Connect your own backend functionality

1. Add in your tool_calls schema in `content-script/src/service/tools/schema.ts`
2. Add in your backend calls in `executeToolCall` function under `content-script/src/service/tools/index.ts`

## Challenges

### Styles

Initially for the boilerplate, it was configured using Tailwind. However, when the HTML is injected in various browsers, there was a conflict between how the classes were defined in Tailwind compared to the current viewing site. Hence, Tailwind was removed from the project and replaced with simple css.

### LLM Understanding

This project is my first attempt working with LLMs. The challenge was getting the LLM to not assume any parameters and always clarify with the user on any missing parameters before calling the tools.

## References

This code base was cloned from [Boilerplate](https://github.com/yosevu/react-content-script)
