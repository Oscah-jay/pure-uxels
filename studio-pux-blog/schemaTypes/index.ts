import { SchemaTypeDefinition } from "sanity"
import post from "./post"
import author from "./author"
import category from "./category"
import blockContent from "./blockContent"
import { portfolio } from './portfolio'

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  category,
  blockContent,
  portfolio,
]
