# Sable AI Assistant

Give AI some tasks and they will help you to call the specific backend services and perform actions on them

### How to use

1. Perform `npm run build`
2. Go to Chrome Extension and import the `dist` folder
3. Within the Extension Pop up, add in your OpenRouter API Key and select the model
4. Ensure that your OpenRouter has sufficient credits if you want to use ChatGPT model

### Connect your own backend functionality

1. Add in your tool_calls schema in `content-script/src/service/tools/schema.ts`
2. Add in your backend calls in `executeToolCall` function under `content-script/src/service/tools/index.ts`

### Challenges

Since this is an injected script and especially that this project was initially built from Tailwind, it may not work as well as expected when loaded in various pages. In the future, it will be best to change the styling into pure CSS to avoid clashing or the rem definition or classnames

### References

This code base was forked from [Boilerplate](https://github.com/yosevu/react-content-script)
