import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export default async function cacheImage(creator: string, url: string) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const extension = path.extname(url) || ".png";

  const filename =
    creator + "_" + crypto.randomUUID() + extension;

  const filepath = path.join(
    "images",
    filename
  );

  fs.writeFileSync(filepath, response.data);

  return filename;
}
