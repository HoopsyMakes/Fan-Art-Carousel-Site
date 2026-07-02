import { useState } from "react";
import { reducers } from "../module_bindings";
import { useSpacetimeDB, useReducer } from "spacetimedb/react";

export default function AddImageTemp() {

  const [dURL, setDURL] = useState<string>("")
  const [previewURL, setPreviewURL] = useState<string>("")

  const conn = useSpacetimeDB();
  const { isActive: connected } = conn;
  const addReducer = useReducer(reducers.addDurl);

  const addDURLToDB = () => {
    if (!connected || dURL !== "" || dURL !== undefined) return;
    addReducer({
      creator: "Test",
      url: dURL,
    });
  }

  return (
    <div>
      <label>Discord URL:</label>
      <input type="text" onChange={(e) => { setDURL(e.target.value) }} value={dURL}></input>
      <button onClick={() => setPreviewURL(dURL)}>Preview Image</button>
      {previewURL !== "" && previewURL !== undefined && (
        <div>
          <h3>Image Info</h3>

          <img src={previewURL} alt="Preview" style={{ maxWidth: 800 }} />

          <br />

          <button onClick={addDURLToDB} disabled={previewURL == "" || previewURL == undefined || !connected}>
            Add To DB
          </button>
        </div>
      )}
    </div>
  );
}
