import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { tables } from "../module_bindings";
import { useTable } from "spacetimedb/react";

function imageDataToArrayBuffer(data: Uint8Array | ArrayLike<number>): ArrayBuffer {
  const bytes = data instanceof Uint8Array ? data : Uint8Array.from(data);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export default function Carousel() {
  const params = useParams();
  const creatorParam = params.creator ?? "";

  const imageQuery = useMemo(
    () => tables.image.where(image => image.creator.eq(creatorParam)),
    [creatorParam]
  );

  const [images, isReady] = useTable(imageQuery);

  const imageUrls = useMemo(() => {
    return images.map(image => {
      const blob = new Blob(
        [imageDataToArrayBuffer(image.data)],
        { type: image.mimetype || "image/png" }
      );

      return {
        id: image.id.toString(),
        url: URL.createObjectURL(blob),
        mimetype: image.mimetype,
      };
    });
  }, [images]);

  useEffect(() => {
    return () => {
      for (const image of imageUrls) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [imageUrls]);

  if (!isReady) {
    return <p>Loading images...</p>;
  }

  if (imageUrls.length === 0) {
    return <p>No images found for {creatorParam}.</p>;
  }

  return (
    <div>
      {imageUrls.map(image => (
        <img
          key={image.id}
          src={image.url}
          alt={`${creatorParam} fan art`}
          style={{ maxWidth: 300 }}
        />
      ))}
    </div>
  );
}
