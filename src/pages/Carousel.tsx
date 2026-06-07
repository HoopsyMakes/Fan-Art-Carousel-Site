import { useParams } from "react-router"
import { tables } from '../module_bindings';
import { useSpacetimeDB } from 'spacetimedb/react';
import { useState } from "react";
export default function Carousel() {
  const [bytes, setBytes] = useState(new Uint8Array())
  const [mimes, setMimes] = useState({})
  const params = useParams()
  const conn = useSpacetimeDB()
  const [url, setUrl] = useState<string>();
  const creatorParam: string = params.creator ?? ""
  conn.getConnection()?.subscriptionBuilder().onApplied(() => {
    let mimeArray = []
    for (const image of conn.getConnection()!.db.images.iter()) {
      console.log(image.data);
      mimeArray.push(image.mimetype)
    }
    setMimes(mimeArray)
  }).subscribe(
    tables.image.where(img => img.creator.eq(creatorParam))
  )
  const blob = new Blob([bytes], mimes)
  const objectUrl = URL.createObjectURL(blob);
  setUrl(objectUrl);
  return (
    <img src={url}>{ }</img>
  )
}

