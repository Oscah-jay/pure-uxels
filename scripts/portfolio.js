// Portfolio Page JavaScript - Handles dynamic content loading and interactions
import { portfolioService } from "./portfolio-service.js"

class PortfolioPage {
  constructor() {
    this.projects = []
    this.filteredProjects = []
    this.currentFilter = "all"
    this.currentView = "grid"
    this.currentPage = 1
    this.projectsPerPage = 9
    this.currentProject = null
    this.currentProjectIndex = 0

    this.init()
  }

  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.initializeApp())
      } else {
        this.initializeApp()
      }
    } catch (error) {
      console.error("Error initializing portfolio:", error)
      this.showError("Failed to initialize portfolio")
    }
  }

  async initializeApp() {
    this.bindEvents()
    await this.loadProjects()
    await this.loadCategories()
    this.renderProjects()
  }

  bindEvents() {
    // Filter buttons
    const filterBtns = document.querySelectorAll(".filter-btn")
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleFilterChange(e))
    })

    // View toggle buttons
    const viewBtns = document.querySelectorAll(".view-btn")
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleViewChange(e))
    })

    // Load more button
    const loadMoreBtn = document.getElementById("load-more-btn")
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => this.loadMoreProjects())
    }

    // Modal events
    const modal = document.getElementById("project-modal")
    const modalClose = modal?.querySelector(".modal-close")
    const modalOverlay = modal?.querySelector(".modal-overlay")
    const modalPrev = document.getElementById("modal-prev")
    const modalNext = document.getElementById("modal-next")

    if (modalClose) modalClose.addEventListener("click", () => this.closeModal())
    if (modalOverlay) modalOverlay.addEventListener("click", () => this.closeModal())
    if (modalPrev) modalPrev.addEventListener("click", () => this.showPreviousProject())
    if (modalNext) modalNext.addEventListener("click", () => this.showNextProject())

    // Keyboard navigation for modal
    document.addEventListener("keydown", (e) => {
      if (modal?.classList.contains("active")) {
        if (e.key === "Escape") this.closeModal()
        if (e.key === "ArrowLeft") this.showPreviousProject()
        if (e.key === "ArrowRight") this.showNextProject()
      }
    })
  }

  async loadProjects() {
    try {
      this.showLoading(true)
      this.projects = await portfolioService.getProjects()
      this.filteredProjects = [...this.projects]
      this.showLoading(false)
    } catch (error) {
      console.error("Error loading projects:", error)
      this.showError("Failed to load projects. Please try again later.")
      this.showLoading(false)
    }
  }

  async loadCategories() {
    try {
      const categories = await portfolioService.getCategories()
      this.updateFilterButtons(categories)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  updateFilterButtons(categories) {
    const filterContainer = document.querySelector(".filter-container")
    if (!filterContainer) return

    // Keep the "All Projects" button and add category buttons
    const allButton = filterContainer.querySelector('[data-filter="all"]')
    const existingButtons = filterContainer.querySelectorAll(".filter-btn:not([data-filter='all'])")

    // Remove existing category buttons
    existingButtons.forEach((btn) => btn.remove())

    // Add category buttons
    categories.forEach((category) => {
      const button = document.createElement("button")
      button.className = "filter-btn"
      button.setAttribute("data-filter", category.slug.current)
      button.textContent = category.title
      button.addEventListener("click", (e) => this.handleFilterChange(e))
      filterContainer.appendChild(button)
    })
  }

  handleFilterChange(e) {
    const filterValue = e.target.getAttribute("data-filter")

    // Update active button
    document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"))
    e.target.classList.add("active")

    // Filter projects
    this.currentFilter = filterValue
    this.currentPage = 1

    if (filterValue === "all") {
      this.filteredProjects = [...this.projects]
    } else {
      this.filteredProjects = this.projects.filter((project) => project.category?.slug?.current === filterValue)
    }

    this.renderProjects()
  }

  handleViewChange(e) {
    const viewValue = e.target.getAttribute("data-view")

    // Update active button
    document.querySelectorAll(".view-btn").forEach((btn) => btn.classList.remove("active"))
    e.target.classList.add("active")

    // Update view
    this.currentView = viewValue
    const container = document.getElementById("projects-container")
    if (container) {
      container.className = `projects-container ${viewValue}-view`
    }
  }

  renderProjects() {
    const container = document.getElementById("projects-container")
    if (!container) return

    const startIndex = 0
    const endIndex = this.currentPage * this.projectsPerPage
    const projectsToShow = this.filteredProjects.slice(startIndex, endIndex)

    if (projectsToShow.length === 0) {
      container.innerHTML = `
        <div class="no-projects">
          <i class="fas fa-folder-open"></i>
          <h3>No projects found</h3>
          <p>Try selecting a different category or check back later.</p>
        </div>
      `
      this.updateLoadMoreButton(false)
      return
    }

    container.innerHTML = projectsToShow.map((project, index) => this.createProjectCard(project, index)).join("")

    // Update load more button visibility
    const hasMore = endIndex < this.filteredProjects.length
    this.updateLoadMoreButton(hasMore)

    // Add click events to project cards
    this.bindProjectCardEvents()

    // Trigger reveal animations
    this.triggerRevealAnimations()
  }

  createProjectCard(project, index) {
    const imageUrl = portfolioService.buildImageUrl(project.featuredImage, {
      width: 400,
      height: 300,
      quality: 85,
    })

    const technologies = project.technologies?.slice(0, 3) || []
    const techTags = technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")

    return `
      <div class="project-item" data-project-id="${project._id}" data-index="${index}">
        <div class="project-image">
          <img src="${imageUrl || "/placeholder.svg?height=300&width=400"}" 
               alt="${project.title}" 
               loading="lazy">
          <div class="project-overlay">
            <div class="project-category">${project.category?.title || "Uncategorized"}</div>
            <div class="project-title">${project.title}</div>
            <button class="view-project-btn">View Project</button>
          </div>
        </div>
        <div class="project-content">
          <div class="project-category">${project.category?.title || "Uncategorized"}</div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          ${
            technologies.length > 0
              ? `
            <div class="project-technologies">
              ${techTags}
            </div>
          `
              : ""
          }
          <div class="project-links">
            <button class="project-link view-details-btn" data-project-id="${project._id}">
              <i class="fas fa-eye"></i>
              View Details
            </button>
            ${
              project.projectUrl
                ? `
              <a href="${project.projectUrl}" target="_blank" class="project-link secondary">
                <i class="fas fa-external-link-alt"></i>
                Live Site
              </a>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `
  }

  bindProjectCardEvents() {
    // Project card click events
    const projectCards = document.querySelectorAll(".project-item")
    projectCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        // Don't trigger if clicking on links
        if (e.target.closest("a") || e.target.closest(".project-link")) return

        const projectId = card.getAttribute("data-project-id")
        const index = Number.parseInt(card.getAttribute("data-index"))
        this.openProjectModal(projectId, index)
      })
    })

    // View details buttons
    const viewDetailsBtns = document.querySelectorAll(".view-details-btn")
    viewDetailsBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        const projectId = btn.getAttribute("data-project-id")
        const card = btn.closest(".project-item")
        const index = Number.parseInt(card.getAttribute("data-index"))
        this.openProjectModal(projectId, index)
      })
    })
  }

  async openProjectModal(projectId, index) {
    try {
      this.currentProjectIndex = index
      const project = await portfolioService.getProjectBySlug(
        this.filteredProjects.find((p) => p._id === projectId)?.slug?.current,
      )

      if (!project) {
        throw new Error("Project not found")
      }

      this.currentProject = project
      this.renderProjectModal(project)
      this.showModal()
    } catch (error) {
      console.error("Error loading project details:", error)
      this.showError("Failed to load project details")
    }
  }

  renderProjectModal(project) {
    const modalContent = document.getElementById("modal-content")
    if (!modalContent) return

    const imageUrl = portfolioService.buildImageUrl(project.featuredImage, {
      width: 800,
      height: 500,
      quality: 90,
    })

    const galleryImages =
      project.gallery
        ?.map((img) => {
          const imgUrl = portfolioService.buildImageUrl(img, { width: 600, height: 400, quality: 85 })
          return `<img src="${imgUrl}" alt="${project.title}" loading="lazy">`
        })
        .join("") || ""

    const technologies = project.technologies?.map((tech) => `<span class="tech-tag">${tech}</span>`).join("") || ""

    modalContent.innerHTML = `
      <div class="modal-header">
        <div class="modal-category" style="color: ${project.category?.color || "#1E3A8A"}">${project.category?.title || "Uncategorized"}</div>
        <h1 class="modal-title">${project.title}</h1>
        <div class="modal-meta">
          <div class="meta-item">
            <span class="meta-label">Client</span>
            <span class="meta-value">${project.client || "Personal Project"}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Date</span>
            <span class="meta-value">${portfolioService.formatProjectDate(project.projectDate)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Status</span>
            <span class="meta-value">${project.status?.replace("-", " ").toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div class="modal-image">
        <img src="${imageUrl}" alt="${project.title}">
      </div>

      <div class="modal-description">
        <h3>Project Overview</h3>
        <p>${project.description}</p>
      </div>

      ${
        project.content
          ? `
        <div class="modal-content-section">
          <h3>Project Details</h3>
          <div class="rich-content">
            ${this.renderPortableText(project.content)}
          </div>
        </div>
      `
          : ""
      }

      ${
        technologies
          ? `
        <div class="modal-technologies">
          <h3>Technologies Used</h3>
          <div class="tech-tags">
            ${technologies}
          </div>
        </div>
      `
          : ""
      }

      ${
        galleryImages
          ? `
        <div class="modal-gallery">
          <h3>Project Gallery</h3>
          <div class="gallery-grid">
            ${galleryImages}
          </div>
        </div>
      `
          : ""
      }

      <div class="modal-actions">
        ${
          project.projectUrl
            ? `
          <a href="${project.projectUrl}" target="_blank" class="btn primary">
            <i class="fas fa-external-link-alt"></i>
            View Live Site
          </a>
        `
            : ""
        }
        ${
          project.githubUrl
            ? `
          <a href="${project.githubUrl}" target="_blank" class="btn secondary">
            <i class="fab fa-github"></i>
            View Code
          </a>
        `
            : ""
        }
      </div>
    `
  }

  renderPortableText(content) {
    // Simple portable text renderer
    return content
      .map((block) => {
        if (block._type === "block") {
          const text = block.children?.map((child) => child.text).join("") || ""
          switch (block.style) {
            case "h2":
              return `<h2>${text}</h2>`
            case "h3":
              return `<h3>${text}</h3>`
            case "h4":
              return `<h4>${text}</h4>`
            default:
              return `<p>${text}</p>`
          }
        } else if (block._type === "image") {
          const imageUrl = portfolioService.buildImageUrl(block, { width: 700, quality: 85 })
          return `<img src="${imageUrl}" alt="${block.alt || ""}" class="content-image">`
        }
        return ""
      })
      .join("")
  }

  showModal() {
    const modal = document.getElementById("project-modal")
    if (modal) {
      modal.classList.add("active")
      document.body.style.overflow = "hidden"
    }
  }

  closeModal() {
    const modal = document.getElementById("project-modal")
    if (modal) {
      modal.classList.remove("active")
      document.body.style.overflow = ""
    }
  }

  showPreviousProject() {
    if (this.currentProjectIndex > 0) {
      this.currentProjectIndex--
      const project = this.filteredProjects[this.currentProjectIndex]
      this.openProjectModal(project._id, this.currentProjectIndex)
    }
  }

  showNextProject() {
    if (this.currentProjectIndex < this.filteredProjects.length - 1) {
      this.currentProjectIndex++
      const project = this.filteredProjects[this.currentProjectIndex]
      this.openProjectModal(project._id, this.currentProjectIndex)
    }
  }

  loadMoreProjects() {
    this.currentPage++
    this.renderProjects()
  }

  updateLoadMoreButton(hasMore) {
    const loadMoreBtn = document.getElementById("load-more-btn")
    if (!loadMoreBtn) return

    const container = loadMoreBtn.closest(".load-more-container")
    if (hasMore) {
      container.style.display = "block"
      loadMoreBtn.classList.remove("loading")
    } else {
      container.style.display = "none"
    }
  }

  showLoading(show) {
    const container = document.getElementById("projects-container")
    if (!container) return

    if (show) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <p>Loading amazing projects...</p>
        </div>
      `
    }
  }

  showError(message) {
    const container = document.getElementById("projects-container")
    if (!container) return

    container.innerHTML = `
      <div class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Oops! Something went wrong</h3>
        <p>${message}</p>
        <button class="btn primary" onclick="location.reload()">
          <i class="fas fa-refresh"></i>
          Try Again
        </button>
      </div>
    `
  }

  triggerRevealAnimations() {
    // Trigger reveal animations for newly added elements
    const reveals = document.querySelectorAll(".project-item")
    reveals.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }, index * 100)
    })
  }
}

// Initialize portfolio page when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize on portfolio page
  if (document.body.classList.contains("portfolio-page") || document.querySelector(".portfolio-hero")) {
    new PortfolioPage()
  }
})

// Export for potential external use
export { PortfolioPage }
