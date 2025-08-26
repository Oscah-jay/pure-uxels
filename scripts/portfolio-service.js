// Portfolio Service - Handles all portfolio-related API calls to Sanity
import { sanityClient } from "./sanity-client.js"

class PortfolioService {
  constructor() {
    this.client = sanityClient
  }

  // Get all portfolio projects with optional filtering
  async getProjects(options = {}) {
    const { category = null, featured = null, limit = null, status = "completed" } = options

    let query = `*[_type == "portfolioProject" && status == "${status}"]`

    // Add category filter
    if (category) {
      query += ` && category->slug.current == "${category}"`
    }

    // Add featured filter
    if (featured !== null) {
      query += ` && featured == ${featured}`
    }

    query += ` | order(order asc, projectDate desc)`

    // Add limit
    if (limit) {
      query += `[0...${limit}]`
    }

    query += `{
      _id,
      title,
      slug,
      description,
      featuredImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt
      },
      category->{
        title,
        slug,
        color
      },
      technologies,
      projectUrl,
      githubUrl,
      client,
      projectDate,
      status,
      featured,
      order
    }`

    try {
      const projects = await this.client.fetch(query)
      return projects
    } catch (error) {
      console.error("Error fetching portfolio projects:", error)
      throw error
    }
  }

  // Get a single project by slug
  async getProjectBySlug(slug) {
    const query = `*[_type == "portfolioProject" && slug.current == "${slug}"][0]{
      _id,
      title,
      slug,
      description,
      content,
      featuredImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt
      },
      gallery[]{
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt
      },
      category->{
        title,
        slug,
        color
      },
      technologies,
      projectUrl,
      githubUrl,
      client,
      projectDate,
      status,
      featured,
      publishedAt
    }`

    try {
      const project = await this.client.fetch(query)
      return project
    } catch (error) {
      console.error("Error fetching project:", error)
      throw error
    }
  }

  // Get all portfolio categories
  async getCategories() {
    const query = `*[_type == "portfolioCategory"] | order(title asc){
      _id,
      title,
      slug,
      description,
      color
    }`

    try {
      const categories = await this.client.fetch(query)
      return categories
    } catch (error) {
      console.error("Error fetching portfolio categories:", error)
      throw error
    }
  }

  // Get featured projects for homepage
  async getFeaturedProjects(limit = 3) {
    return this.getProjects({ featured: true, limit })
  }

  // Get projects by category
  async getProjectsByCategory(categorySlug) {
    return this.getProjects({ category: categorySlug })
  }

  // Get related projects (same category, excluding current project)
  async getRelatedProjects(currentProjectId, categorySlug, limit = 3) {
    const query = `*[_type == "portfolioProject" && _id != "${currentProjectId}" && category->slug.current == "${categorySlug}" && status == "completed"] | order(projectDate desc)[0...${limit}]{
      _id,
      title,
      slug,
      description,
      featuredImage{
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt
      },
      category->{
        title,
        slug,
        color
      },
      projectDate
    }`

    try {
      const projects = await this.client.fetch(query)
      return projects
    } catch (error) {
      console.error("Error fetching related projects:", error)
      throw error
    }
  }

  // Helper method to build image URL with transformations
  buildImageUrl(imageAsset, options = {}) {
    if (!imageAsset?.asset?.url) return null

    const { width, height, quality = 80, format = "webp" } = options
    let url = imageAsset.asset.url

    const params = []
    if (width) params.push(`w=${width}`)
    if (height) params.push(`h=${height}`)
    params.push(`q=${quality}`)
    params.push(`fm=${format}`)

    if (params.length > 0) {
      url += `?${params.join("&")}`
    }

    return url
  }

  // Helper method to format project date
  formatProjectDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }
}

// Export singleton instance
export const portfolioService = new PortfolioService()
