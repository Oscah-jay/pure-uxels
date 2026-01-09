export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short tagline that appears on overlay",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Branding", value: "branding" },
          { title: "Web Design", value: "web-design" },
          { title: "Product Design", value: "product-design" },
          { title: "Motion Design", value: "motion-design" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    {
      name: "client",
      title: "Client Name",
      type: "string",
    },
    {
      name: "year",
      title: "Year",
      type: "string",
    },
    {
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "string" }],
      description: "List of services provided for this project",
    },
    {
      name: "description",
      title: "Project Description",
      type: "text",
      rows: 4,
      description: "Overview of the project",
    },
    {
      name: "challenge",
      title: "The Challenge",
      type: "text",
      rows: 4,
      description: "What problem did this project solve?",
    },
    {
      name: "solution",
      title: "Our Solution",
      type: "text",
      rows: 4,
      description: "How did you solve the challenge?",
    },
    {
      name: "results",
      title: "Results",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "number",
              title: "Number",
              type: "string",
              description: 'E.g., "300%", "150K+", "25"',
            },
            {
              name: "label",
              title: "Label",
              type: "string",
              description: 'E.g., "Increase in Engagement"',
            },
          ],
        },
      ],
    },
    {
      name: "testimonial",
      title: "Client Testimonial",
      type: "object",
      fields: [
        {
          name: "quote",
          title: "Testimonial Quote",
          type: "text",
          rows: 3,
          description: "The testimonial quote from the client",
        },
        {
          name: "clientName",
          title: "Client Name",
          type: "string",
        },
        {
          name: "clientTitle",
          title: "Client Title/Position",
          type: "string",
          description: 'E.g., "Chief Commercial Officer"',
        },
        {
          name: "clientCompany",
          title: "Client Company",
          type: "string",
        },
        {
          name: "clientAvatar",
          title: "Client Avatar",
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
          name: "rating",
          title: "Client Satisfaction Rating",
          type: "number",
          options: {
            list: [
              { title: "5/5 Stars", value: 5 },
              { title: "4/5 Stars", value: 4 },
              { title: "3/5 Stars", value: 3 },
              { title: "2/5 Stars", value: 2 },
              { title: "1/5 Star", value: 1 },
            ],
          },
          description: "Client satisfaction rating (1-5 stars)",
        },
      ],
    },
    {
      name: "gallery",
      title: "Image Gallery",
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
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which project appears in portfolio grid",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "mainImage",
    },
  },
};
