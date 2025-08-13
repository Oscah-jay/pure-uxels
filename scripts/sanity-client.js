// Sanity Client Configuration for Vanilla JavaScript
class SanityClient {
  constructor(config) {
    this.projectId = config.projectId;
    this.dataset = config.dataset;
    this.apiVersion = config.apiVersion || "2025-08-12";
    this.useCdn = config.useCdn !== false;

    // Base API URL for GROQ queries
    this.baseUrl = `https://${this.projectId}.${this.useCdn ? "apicdn" : "api"}.sanity.io/v${this.apiVersion}/data/query/${this.dataset}`;
  }

  // Build GROQ query URL
  buildUrl(query, params = {}) {
    const url = new URL(this.baseUrl);
    url.searchParams.set("query", query);

    Object.keys(params).forEach((key) => {
      url.searchParams.set(`$${key}`, JSON.stringify(params[key]));
    });

    return url.toString();
  }

  // Fetch data from Sanity
  async fetch(query, params = {}) {
    try {
      const url = this.buildUrl(query, params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Sanity fetch error:", error);
      throw error;
    }
  }

  // Get image URL from either _ref or url
  imageUrl(source) {
    if (!source || !source.asset) return "";

    // ✅ Case 1: Already has a direct URL from GROQ
    if (source.asset.url) {
      return source.asset.url;
    }

    // ✅ Case 2: Has a _ref that needs parsing
    if (source.asset._ref) {
      const parts = source.asset._ref.split("-");
      if (parts.length < 3) return "";

      const id = parts[1];
      const dimensions = parts.length >= 3 ? parts[2] : "";
      const format = parts.length >= 4 ? parts[3] : "jpg";

      return `https://cdn.sanity.io/images/${this.projectId}/${this.dataset}/${id}${dimensions ? `-${dimensions}` : ""}.${format}`;
    }

    return "";
  }

  // Build optimized image URL with parameters
  imageUrlBuilder(source, options = {}) {
    const baseUrl = this.imageUrl(source);
    if (!baseUrl) return "";

    const params = new URLSearchParams();

    if (options.width) params.set("w", options.width);
    if (options.height) params.set("h", options.height);
    if (options.quality) params.set("q", options.quality);
    if (options.format) params.set("fm", options.format);
    if (options.fit) params.set("fit", options.fit);

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  }
}

// Initialize Sanity client
const sanityClient = new SanityClient({
  projectId: "j5s1dfn3",
  dataset: "production",
  apiVersion: "2025-08-12",
  useCdn: true,
});

// Make available globally
window.sanityClient = sanityClient;
