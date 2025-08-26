// Portfolio Project Schema
export const portfolioProject = {
    name: "portfolioProject",
    title: "Portfolio Project",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Project Title",
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
        name: "description",
        title: "Short Description",
        type: "text",
        rows: 3,
        validation: (Rule) => Rule.required().max(200),
      },
      {
        name: "content",
        title: "Project Details",
        type: "array",
        of: [
          {
            type: "block",
          },
          {
            type: "image",
            options: {
              hotspot: true,
            },
          },
        ],
      },
      {
        name: "featuredImage",
        title: "Featured Image",
        type: "image",
        options: {
          hotspot: true,
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: "gallery",
        title: "Project Gallery",
        type: "array",
        of: [
          {
            type: "image",
            options: {
              hotspot: true,
            },
          },
        ],
      },
      {
        name: "category",
        title: "Category",
        type: "reference",
        to: [{ type: "portfolioCategory" }],
        validation: (Rule) => Rule.required(),
      },
      {
        name: "technologies",
        title: "Technologies Used",
        type: "array",
        of: [{ type: "string" }],
        options: {
          layout: "tags",
        },
      },
      {
        name: "projectUrl",
        title: "Project URL",
        type: "url",
      },
      {
        name: "githubUrl",
        title: "GitHub URL",
        type: "url",
      },
      {
        name: "client",
        title: "Client Name",
        type: "string",
      },
      {
        name: "projectDate",
        title: "Project Date",
        type: "date",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "status",
        title: "Project Status",
        type: "string",
        options: {
          list: [
            { title: "Completed", value: "completed" },
            { title: "In Progress", value: "in-progress" },
            { title: "On Hold", value: "on-hold" },
          ],
        },
        initialValue: "completed",
      },
      {
        name: "featured",
        title: "Featured Project",
        type: "boolean",
        description: "Show this project prominently on the homepage",
        initialValue: false,
      },
      {
        name: "order",
        title: "Display Order",
        type: "number",
        description: "Lower numbers appear first",
      },
      {
        name: "publishedAt",
        title: "Published At",
        type: "datetime",
        initialValue: () => new Date().toISOString(),
      },
    ],
    preview: {
      select: {
        title: "title",
        media: "featuredImage",
        category: "category.title",
        status: "status",
      },
      prepare(selection) {
        const { title, media, category, status } = selection
        return {
          title: title,
          subtitle: `${category} - ${status}`,
          media: media,
        }
      },
    },
    orderings: [
      {
        title: "Display Order",
        name: "orderAsc",
        by: [{ field: "order", direction: "asc" }],
      },
      {
        title: "Date, New",
        name: "dateDesc",
        by: [{ field: "projectDate", direction: "desc" }],
      },
    ],
  }
  
  // Portfolio Category Schema
  export const portfolioCategory = {
    name: "portfolioCategory",
    title: "Portfolio Category",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Category Title",
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
        name: "description",
        title: "Description",
        type: "text",
        rows: 3,
      },
      {
        name: "color",
        title: "Category Color",
        type: "string",
        options: {
          list: [
            { title: "Blue", value: "#1E3A8A" },
            { title: "Red", value: "#DC2626" },
            { title: "Green", value: "#059669" },
            { title: "Purple", value: "#7C3AED" },
            { title: "Orange", value: "#EA580C" },
            { title: "Pink", value: "#DB2777" },
          ],
        },
        initialValue: "#1E3A8A",
      },
    ],
    preview: {
      select: {
        title: "title",
        description: "description",
      },
    },
  }
  
  export default [portfolioProject, portfolioCategory]