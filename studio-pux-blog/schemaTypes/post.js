
// schemas/post.js
export default {
    name: "post",
    title: "Blog Post",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "title",
          maxLength: 96,
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: "excerpt",
        title: "Excerpt",
        type: "text",
        rows: 3,
        description: "Brief description of the post (used in listings and SEO)",
      },
      {
        name: "mainImage",
        title: "Main Image",
        type: "image",
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: "alt",
            type: "string",
            title: "Alternative Text",
            description: "Important for SEO and accessibility.",
            validation: (Rule) => Rule.required(),
          },
        ],
      },
      {
        name: "categories",
        title: "Categories",
        type: "array",
        of: [{ type: "reference", to: { type: "category" } }],
      },
      {
        name: "publishedAt",
        title: "Published at",
        type: "datetime",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "author",
        title: "Author",
        type: "reference",
        to: { type: "author" },
      },
      {
        name: "featured",
        title: "Featured Post",
        type: "boolean",
        description: "Mark this post as featured to show it prominently",
      },
      {
        name: "body",
        title: "Body",
        type: "blockContent",
      },
      {
        name: "seo",
        title: "SEO",
        type: "object",
        fields: [
          {
            name: "metaTitle",
            title: "Meta Title",
            type: "string",
            description: "Title for search engines (leave empty to use post title)",
          },
          {
            name: "metaDescription",
            title: "Meta Description",
            type: "text",
            rows: 3,
            description: "Description for search engines (leave empty to use excerpt)",
          },
          {
            name: "ogImage",
            title: "Social Share Image",
            type: "image",
            description: "Image for social media sharing (leave empty to use main image)",
          },
        ],
      },
    ],
    preview: {
      select: {
        title: "title",
        author: "author.name",
        media: "mainImage",
        publishedAt: "publishedAt",
      },
      prepare(selection) {
        const { author, publishedAt } = selection
        return Object.assign({}, selection, {
          subtitle: author && publishedAt ? `by ${author} on ${new Date(publishedAt).toLocaleDateString()}` : "",
        })
      },
    },
  }
  
  // schemas/author.js
  export const author = {
    name: "author",
    title: "Author",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Name",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "name",
          maxLength: 96,
        },
      },
      {
        name: "title",
        title: "Job Title",
        type: "string",
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        options: {
          hotspot: true,
        },
      },
      {
        name: "bio",
        title: "Bio",
        type: "array",
        of: [
          {
            title: "Block",
            type: "block",
            styles: [{ title: "Normal", value: "normal" }],
            lists: [],
          },
        ],
      },
    ],
    preview: {
      select: {
        title: "name",
        media: "image",
      },
    },
  }
  
  // schemas/category.js
  export const category = {
    name: "category",
    title: "Category",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "title",
          maxLength: 96,
        },
      },
      {
        name: "description",
        title: "Description",
        type: "text",
      },
    ],
  }
  
  // schemas/blockContent.js
  export const blockContent = {
    title: "Block Content",
    name: "blockContent",
    type: "array",
    of: [
      {
        title: "Block",
        type: "block",
        styles: [
          { title: "Normal", value: "normal" },
          { title: "H1", value: "h1" },
          { title: "H2", value: "h2" },
          { title: "H3", value: "h3" },
          { title: "H4", value: "h4" },
          { title: "Quote", value: "blockquote" },
        ],
        lists: [{ title: "Bullet", value: "bullet" }],
        marks: {
          decorators: [
            { title: "Strong", value: "strong" },
            { title: "Emphasis", value: "em" },
            { title: "Code", value: "code" },
          ],
          annotations: [
            {
              title: "URL",
              name: "link",
              type: "object",
              fields: [
                {
                  title: "URL",
                  name: "href",
                  type: "url",
                },
              ],
            },
          ],
        },
      },
      {
        type: "image",
        options: { hotspot: true },
        fields: [
          {
            name: "alt",
            type: "string",
            title: "Alternative Text",
          },
        ],
      },
    ],
  }
  
  // schemas/index.js - Main schema export
  import post from "./post"
  import { author } from "./author"
  import { category } from "./category"
  import { blockContent } from "./blockContent"
  
  export const schemaTypes = [post, author, category, blockContent]
  