import { SchemaTypeDefinition } from "sanity"
import post from "./post"
import author from "./author"
import category from "./category"
import blockContent from "./blockContent"

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  category,
  blockContent,
]
