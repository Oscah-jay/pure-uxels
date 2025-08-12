// sanity-client.js
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: "j5s1dfn3", 
  dataset: "production",     
  apiVersion: "2025-08-12",     
  useCdn: true                  
});

const builder = imageUrlBuilder(client);

export const sanityClient = {
  // Fetch data
  fetch: async (query, params = {}) => {
    try {
      return await client.fetch(query, params);
    } catch (err) {
      console.error("Error fetching data from Sanity:", err);
      return [];
    }
  },

  // Build image URL safely
  imageUrl: (source) => {
    if (!source) {
      console.warn("imageUrl called with undefined or null source");
      return ""; // return an empty string instead of breaking
    }

    try {
      return builder.image(source).url();
    } catch (err) {
      console.error("Error building image URL:", err);
      return "";
    }
  }
};
