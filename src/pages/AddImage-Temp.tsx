import { useState } from "react";
import { reducers } from '../module_bindings';
import { useSpacetimeDB, useReducer } from 'spacetimedb/react';
import { Timestamp } from "spacetimedb";

export default function AddImageTemp() {
  const [info, setInfo] = useState<{
    name: string;
    mimetype: string;
    size: number;
    data: Uint8Array;
    previewUrl: string;
  } | null>(null);

  const conn = useSpacetimeDB();
  const { isActive: connected } = conn;
  const addReducer = useReducer(reducers.addImage);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    setInfo({
      name: file.name,
      mimetype: file.type,
      size: file.size,
      data,
      previewUrl: URL.createObjectURL(file),
    });
  };
  const addToDB = async () => {
    if (!connected) { return }
    const uploadedAt: Timestamp = Timestamp.now();
    addReducer({ creator: "Test", data: info!.data, mimetype: info!.mimetype, uploadedAt })
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {info && (
        <div>
          <h3>Image Info</h3>

          <p>
            <strong>Name:</strong> {info.name}
          </p>

          <p>
            <strong>MIME Type:</strong> {info.mimetype}
          </p>

          <p>
            <strong>Size:</strong> {info.size} bytes
          </p>

          <p>
            <strong>Bytes:</strong>
          </p>

          <pre style={{ maxWidth: 300, overflow: "scroll", }}>
            {Array.from(info.data.slice(0)).join(" ")}
          </pre>

          <img
            src={info.previewUrl}
            alt="Preview"
            style={{ maxWidth: 300 }}
          />
          <br />
          {/*disabled is as a backup, because you can never be too careful with databases #overthinking*/}
          <button onClick={addToDB} disabled={info == null}>Add To DB</button>
        </div>
      )}
    </div>
  );
}
