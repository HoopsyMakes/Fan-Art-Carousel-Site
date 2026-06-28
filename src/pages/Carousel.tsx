import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { tables } from "../module_bindings";
import { useTable } from "spacetimedb/react";
import "./Carousel.css"

function imageDataToArrayBuffer(data: Uint8Array | ArrayLike<number>): ArrayBuffer {
  const bytes = data instanceof Uint8Array ? data : Uint8Array.from(data);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export default function Carousel() {
  const params = useParams();
  const creatorParam = params.creator ?? "";

  const [index, setIndex] = useState<number>(0)

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

  const imagesRef = useRef(images);
  useEffect(() => { imagesRef.current = images; }, [images]);
  useEffect(() => {
    const interval = setInterval(() => {
      const currentImages = imagesRef.current;
      if (currentImages.length > 0) {
        setIndex((prev) => (prev + 1) % currentImages.length);
      }
    }, 5000);
    return () => clearInterval(interval);

  }, []);

  if (!isReady) {
    return <p>Loading images...</p>;
  }

  if (imageUrls.length === 0) {
    return <p>No images found for {creatorParam}.</p>;
  }

  return (
    <div>
      <img
        key={imageUrls[index].id}
        src={imageUrls[index]?.url}
        alt={`${creatorParam} fan art`}
        style={{ maxWidth: 300 }}
        className="image"
      />
    </div>
  );
}
