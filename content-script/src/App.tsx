import { useEffect, useRef, useState } from "react";
import { CROSS_ICON, ENCODE_SVG, SABLE_HEAD_IMAGE, UP_ICON } from "./assets";
import ExpandingTextarea, {
  ExpandingTextareaRef,
} from "./components/Shared/ExpandingTextarea";
import OpenRouter from "./service/openrouter";
import ChatProfile from "./components/ChatProfile";
import { TYPING_DURATION_PER_LETTER, Z_INDEX } from "./lib/constants";
import { Message } from "./lib/types";
import ChatHistory from "./components/ChatHistory";

function App() {
  const [sableConfig, setSableConfig] = useState<{
    apiKey: string;
    model: string;
  }>({
    apiKey: "",
    model: "",
  });

  const [visible, setVisible] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [agentResponding, setAgentResponding] = useState<boolean>(false);
  const openRouterRef = useRef<OpenRouter | null>(null);
  const textareaRef = useRef<ExpandingTextareaRef>(null);

  const handleSubmit = async () => {
    if (!openRouterRef.current) return;

    const prompt = text;
    if (prompt.trim().length === 0) return;
    setChatHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: prompt,
        sender: "self",
        createdDate: Date.now(),
      },
    ]);
    setText("");
    textareaRef.current?.resetHeight();

    let response = "";
    if (sableConfig.apiKey) {
      response = await openRouterRef.current.getResponse(prompt);
    } else {
      response =
        "Please add in your OpenRouter API Key in the Chrome Extension Popup. Ensure that you also have sufficient credits!";
    }

    setChatHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: response,
        sender: "agent",
        createdDate: Date.now(),
      },
    ]);

    setAgentResponding(true);

    setTimeout(
      () => {
        setAgentResponding(false);
      },
      (response.length + 1) * TYPING_DURATION_PER_LETTER
    );
  };

  useEffect(() => {
    // On initial fetch
    chrome.storage.local.get(["sableApiKey", "sableModel"], (result) => {
      setSableConfig({
        apiKey: result.sableApiKey,
        model: result.sableModel,
      });
    });

    const handleStorageChange = (changes: any, area: string) => {
      if (area === "local") {
        setSableConfig((prev) => ({
          ...prev,
          apiKey: changes.sableApiKey?.newValue ?? prev.apiKey,
          model: changes.sableModel?.newValue ?? prev.model,
        }));
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  useEffect(() => {
    if (sableConfig.apiKey) {
      openRouterRef.current = new OpenRouter(sableConfig);
    }
  }, [sableConfig]);

  return (
    <>
      <div
        className="fixed bottom-10 right-10 h-10 w-10 bg-red rounded-full flex items-center justify-center bg-[#f2eae0] cursor-pointer"
        style={{ zIndex: Z_INDEX }}
        onClick={() => setVisible((prevState) => !prevState)}
      >
        <img
          src={ENCODE_SVG(visible ? CROSS_ICON : SABLE_HEAD_IMAGE)}
          alt="Modal Button"
          className="h-6 w-6"
        />
      </div>

      <div
        className="fixed bottom-[88px] right-10 bg-white rounded-xl transition-all duration-500 ease-in-out origin-bottom-right overflow-hidden"
        style={{
          zIndex: Z_INDEX,
          opacity: visible ? 100 : 0,
          width: visible ? "300px" : "0px",
          height: visible ? "450px" : "0px",
        }}
      >
        <div className="relative flex h-full w-full flex-col">
          <ChatProfile status={sableConfig.apiKey ? "working" : "snoozing"} />
          <ChatHistory data={chatHistory} agentResponding={agentResponding} />
          <div className="relative w-full p-2 border-t border-solid border-gray-200">
            <ExpandingTextarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              handleSubmit={handleSubmit}
              placeholder="Throw me a snack"
              icon={
                <button
                  onClick={handleSubmit}
                  className=" h-6 w-6 disabled:bg-gray-200 bg-gray-700 flex items-center justify-center rounded-full"
                  disabled={text.trim().length === 0 || agentResponding}
                >
                  <img
                    src={ENCODE_SVG(UP_ICON)}
                    alt="Send"
                    className="h-4 w-4"
                    style={{ filter: "invert(100%) brightness(1000%)" }}
                  />
                </button>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
