// Sanity Client Configuration for Vanilla JavaScript
class SanityClient {
  constructor(config) {
    this.projectId = config.projectId
    this.dataset = config.dataset
    this.apiVersion = config.apiVersion || "2023-05-03"
    this.useCdn = config.useCdn !== false
    this.baseUrl = `https://${this.projectId}.${this.useCdn ? "apicdn" : "api"}.sanity.io/v${this.apiVersion}/data/query/${this.dataset}`
  }

  // Build GROQ query URL
  buildUrl(query, params = {}) {
    const url = new URL(this.baseUrl)
    url.searchParams.set("query", query)

    // Add parameters
    Object.keys(params).forEach((key) => {
      url.searchParams.set(`$${key}`, JSON.stringify(params[key]))
    })

    return url.toString()
  }

  // Fetch data from Sanity
  async fetch(query, params = {}) {
    try {
      const url = this.buildUrl(query, params)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      console.error("Sanity fetch error:", error)
      throw error
    }
  }

  // Get image URL from Sanity asset reference
  imageUrl(source) {
    if (!source || !source.asset) return ""

    const ref = source.asset._ref
    const [, id, dimensions, format] = ref.split("-")

    return `https://cdn.sanity.io/images/${this.projectId}/${this.dataset}/${id}-${dimensions}.${format}`
  }

  // Get optimized image URL with parameters
  imageUrlBuilder(source, options = {}) {
    const baseUrl = this.imageUrl(source)
    if (!baseUrl) return ""

    const params = new URLSearchParams()

    if (options.width) params.set("w", options.width)
    if (options.height) params.set("h", options.height)
    if (options.quality) params.set("q", options.quality)
    if (options.format) params.set("fm", options.format)
    if (options.fit) params.set("fit", options.fit)

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
  }
}

// Portfolio service for handling portfolio-related queries
class PortfolioService {
  constructor(sanityClient) {
    this.client = sanityClient
  }

  // Get all portfolio projects
  async getAllProjects(limit = 12, offset = 0) {
    const query = `
      *[_type == "portfolio"] | order(_createdAt desc) [${offset}...${offset + limit}] {
        _id,
        title,
        slug,
        description,
        image,
        link,
        _createdAt
      }
    `
    return await this.client.fetch(query)
  }

  // Get a single portfolio project by slug
  async getProjectBySlug(slug) {
    const query = `
      *[_type == "portfolio" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        image,
        link,
        _createdAt
      }
    `
    return await this.client.fetch(query, { slug })
  }

  // Get featured projects (first 6)
  async getFeaturedProjects(limit = 6) {
    const query = `
      *[_type == "portfolio"] | order(_createdAt desc) [0...${limit}] {
        _id,
        title,
        slug,
        description,
        image,
        link,
        _createdAt
      }
    `
    return await this.client.fetch(query)
  }
}

// Initialize Sanity client
// Replace with your actual Sanity project details
const sanityClient = new SanityClient({
  projectId: "your-project-id", // Replace with your Sanity project ID
  dataset: "production", // Replace with your dataset name
  apiVersion: "2023-05-03",
  useCdn: true,
})

// Export for use in other scripts
window.sanityClient = sanityClient
window.PortfolioService = PortfolioService
