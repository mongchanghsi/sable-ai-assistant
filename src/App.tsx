import { useState, useEffect } from "react";
import { Models } from "./lib/model";
import Textarea from "./components/Shared/Textarea";
import Dropdown from "./components/Shared/Dropdown";
import "./main.css";

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
    <div className="container">
      <div className="form-group">
        <label className="label">API Key:</label>
        <Textarea value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      </div>

      <div className="form-group">
        <label className="label">Model:</label>
        <Dropdown
          options={Models}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>

      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default App;
