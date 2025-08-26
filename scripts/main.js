// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Portfolio Preview Loading
    async function loadFeaturedProjects() {
      const featuredProjectsGrid = document.getElementById("featured-projects-grid")
  
      if (!featuredProjectsGrid) return
  
      try {
        // Import portfolio service dynamically
        const { portfolioService } = await import("./portfolio-service.js")
  
        // Get featured projects
        const featuredProjects = await portfolioService.getFeaturedProjects(3)
  
        if (featuredProjects.length === 0) {
          // If no featured projects, get latest 3 projects
          const latestProjects = await portfolioService.getProjects({ limit: 3 })
          renderFeaturedProjects(latestProjects, featuredProjectsGrid)
        } else {
          renderFeaturedProjects(featuredProjects, featuredProjectsGrid)
        }
      } catch (error) {
        console.error("Error loading featured projects:", error)
        // Show fallback content
        featuredProjectsGrid.innerHTML = `
              <div class="portfolio-error">
                  <p>Unable to load featured projects at the moment.</p>
                  <a href="./portfolio.html" class="btn secondary">View Portfolio</a>
              </div>
          `
      }
    }
  
    function renderFeaturedProjects(projects, container) {
      if (projects.length === 0) {
        container.innerHTML = `
              <div class="portfolio-empty">
                  <p>No featured projects available.</p>
                  <a href="./portfolio.html" class="btn secondary">View All Projects</a>
              </div>
          `
        return
      }
  
      container.innerHTML = projects
        .map((project) => {
          const imageUrl = buildImageUrl(project.featuredImage, { width: 400, height: 300, quality: 85 })
          const technologies = project.technologies?.slice(0, 3) || []
          const techTags = technologies.map((tech) => `<span class="portfolio-tech-tag">${tech}</span>`).join("")
          const projectDate = formatProjectDate(project.projectDate)
  
          return `
              <article class="portfolio-preview-card reveal" data-project-slug="${project.slug?.current}">
                  <div class="portfolio-preview-image">
                      <img src="${imageUrl || "/placeholder.svg?height=300&width=400"}" 
                           alt="${project.title}" 
                           loading="lazy">
                      <div class="portfolio-preview-overlay">
                          <button class="view-project-btn">
                              <i class="fas fa-eye"></i>
                              View Project
                          </button>
                      </div>
                  </div>
                  <div class="portfolio-preview-content">
                      <div class="portfolio-preview-meta">
                          <span class="portfolio-preview-category">${project.category?.title || "Project"}</span>
                          <span class="portfolio-preview-date">${projectDate}</span>
                      </div>
                      <h3>${project.title}</h3>
                      <p>${project.description}</p>
                      ${
                        technologies.length > 0
                          ? `
                          <div class="portfolio-preview-technologies">
                              ${techTags}
                          </div>
                      `
                          : ""
                      }
                  </div>
              </article>
          `
        })
        .join("")
  
      // Add click events to portfolio cards
      const portfolioCards = container.querySelectorAll(".portfolio-preview-card")
      portfolioCards.forEach((card) => {
        card.addEventListener("click", () => {
          const projectSlug = card.getAttribute("data-project-slug")
          if (projectSlug) {
            window.location.href = `./portfolio.html#${projectSlug}`
          } else {
            window.location.href = "./portfolio.html"
          }
        })
      })
    }
  
    // Helper functions for portfolio
    function buildImageUrl(imageAsset, options = {}) {
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
  
    function formatProjectDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    }
  
    // Load featured projects on homepage
    if (document.querySelector(".portfolio-preview")) {
      loadFeaturedProjects()
    }
  })
  