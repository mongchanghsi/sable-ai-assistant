import { useState, useEffect } from "react";
import { Models } from "./lib/model";
import Textarea from "./components/Shared/Textarea";
import Dropdown from "./components/Shared/Dropdown";

function App() {
  const [apiKey, setApiKey] = useState<string>("");
  const [model, setModel] = useState<string>(Models[1].value);

  useEffect(() => {
    chrome.storage.local.get(["sableApiKey", "sableModel"], (data) => {
      if (data.sableApiKey) setApiKey(data.sableApiKey);
      if (data.sableModel) setModel(data.sableModel);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({ sableApiKey: apiKey, sableModel: model }, () => {
      // alert("Settings saved!");
    });
  };

  return (
    <div className="w-[300px] p-4 flex flex-col gap-4 bg-[#ffffff]">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-black">API Key:</label>
        <Textarea value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-black">Model:</label>
        <Dropdown
          options={Models}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>

      <button
        className="w-full bg-blue rounded-xl p-2 bg-gray-700 text-white"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}

export default App;
