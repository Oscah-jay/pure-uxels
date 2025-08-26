// Portfolio JavaScript with Sanity CMS Integration
import { SanityClient } from "sanity"
import { PortfolioService } from "./portfolioService" // Assuming PortfolioService is imported from a local file

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Sanity client and portfolio service
  const sanityClient = new SanityClient({
    projectId: "your-project-id", // Replace with your Sanity project ID
    dataset: "production", // Replace with your dataset name
    apiVersion: "2023-05-03",
    useCdn: true,
  })

  const portfolioService = new PortfolioService(sanityClient)

  // Element references
  const projectsContainer = document.getElementById("projectsContainer")
  const loadMoreBtn = document.querySelector(".load-more-btn")
  const loadMoreText = loadMoreBtn?.querySelector("span")
  const spinner = loadMoreBtn?.querySelector("i")
  const overlay = document.getElementById("projectsOverlay")
  const overlayGrid = document.getElementById("overlayGrid")
  const overlayClose = document.getElementById("overlayClose")

  let allProjects = []
  let displayedProjects = []
  let currentOffset = 0
  const projectsPerLoad = 6

  // Initialize reveal animations
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal-text")

    revealElements.forEach((element) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(30px)"
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay || 0
            setTimeout(() => {
              entry.target.classList.add("active")
            }, delay)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    revealElements.forEach((element) => {
      observer.observe(element)
    })
  }

  // Fetch initial projects from Sanity
  async function fetchInitialProjects() {
    try {
      showLoading()
      const projects = await portfolioService.getAllProjects(projectsPerLoad, 0)
      allProjects = projects
      displayedProjects = projects
      currentOffset = projects.length

      renderProjects(projects)
      hideLoading()
    } catch (error) {
      console.error("Failed to load projects:", error)
      showError("Failed to load projects. Please try again later.")
      hideLoading()
    }
  }

  // Render projects in the grid
  function renderProjects(projects, append = false) {
    if (!projectsContainer) return

    if (!append) {
      projectsContainer.innerHTML = ""
    }

    projects.forEach((project, index) => {
      const projectElement = createProjectElement(project, index)
      projectsContainer.appendChild(projectElement)
    })

    // Animate project items
    setTimeout(() => {
      const newItems = projectsContainer.querySelectorAll(".project-item:not(.animated)")
      newItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.animation = "fadeInUp 0.5s forwards"
          item.classList.add("animated")
        }, 100 * index)
      })
    }, 100)
  }

  // Create individual project element
  function createProjectElement(project, index) {
    const projectDiv = document.createElement("div")
    projectDiv.className = "project-item"
    projectDiv.setAttribute("data-category", "web") // Default category since schema doesn't have categories

    const imageUrl = project.image
      ? sanityClient.imageUrlFor(project.image, {
          width: 400,
          height: 300,
          quality: 80,
          fit: "crop",
        })
      : "/portfolio-project.png"

    projectDiv.innerHTML = `
            <div class="project-image">
                <img src="${imageUrl}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-category">Portfolio</div>
                    <div class="project-title">${project.title}</div>
                    <div class="project-description">${project.description || ""}</div>
                    ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="view-project-btn">View Project</a>` : ""}
                </div>
            </div>
        `

    return projectDiv
  }

  // Load more projects
  async function loadMoreProjects() {
    if (!loadMoreBtn) return

    try {
      loadMoreBtn.classList.add("loading")
      if (loadMoreText) loadMoreText.textContent = "Loading..."
      if (spinner) spinner.style.display = "inline-block"

      const newProjects = await portfolioService.getAllProjects(projectsPerLoad, currentOffset)

      if (newProjects.length > 0) {
        allProjects = [...allProjects, ...newProjects]
        displayedProjects = [...displayedProjects, ...newProjects]
        currentOffset += newProjects.length

        renderProjects(newProjects, true)
      } else {
        if (loadMoreText) loadMoreText.textContent = "No more projects"
        loadMoreBtn.disabled = true
      }
    } catch (error) {
      console.error("Failed to load more projects:", error)
      showError("Failed to load more projects.")
    } finally {
      loadMoreBtn.classList.remove("loading")
      if (loadMoreText) loadMoreText.textContent = "Load More"
      if (spinner) spinner.style.display = "none"
    }
  }

  // Show all projects in overlay
  function showProjectsOverlay() {
    if (!overlay || !overlayGrid) return

    overlayGrid.innerHTML = ""

    allProjects.forEach((project) => {
      const projectEl = document.createElement("div")
      projectEl.className = "project-card"

      const imageUrl = project.image
        ? sanityClient.imageUrlFor(project.image, {
            width: 300,
            height: 200,
            quality: 80,
            fit: "crop",
          })
        : "/portfolio-project.png"

      projectEl.innerHTML = `
                <img src="${imageUrl}" alt="${project.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
                <h3>${project.title}</h3>
                <p>${project.description || "No description available"}</p>
                ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: none;">View Project →</a>` : ""}
            `
      overlayGrid.appendChild(projectEl)
    })

    overlay.style.display = "flex"
  }

  // Show loading state
  function showLoading() {
    if (projectsContainer) {
      projectsContainer.innerHTML = '<div class="loading-state">Loading projects...</div>'
    }
  }

  // Hide loading state
  function hideLoading() {
    const loadingState = document.querySelector(".loading-state")
    if (loadingState) {
      loadingState.remove()
    }
  }

  // Show error message
  function showError(message) {
    if (projectsContainer) {
      projectsContainer.innerHTML = `<div class="error-state">${message}</div>`
    }
  }

  // Event listeners
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreProjects)
  }

  if (overlayClose) {
    overlayClose.addEventListener("click", () => {
      if (overlay) overlay.style.display = "none"
    })
  }

  // Initialize everything
  initRevealAnimations()
  fetchInitialProjects()

  // Custom cursor functionality
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")

  if (cursor && cursorFollower) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px"
      cursor.style.top = e.clientY + "px"

      setTimeout(() => {
        cursorFollower.style.left = e.clientX + "px"
        cursorFollower.style.top = e.clientY + "px"
      }, 100)
    })

    // Add hover effects for project items
    document.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target.closest(".project-item")) {
          cursorFollower.classList.add("link-grow")
        }
      },
      true,
    )

    document.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target.closest(".project-item")) {
          cursorFollower.classList.remove("link-grow")
        }
      },
      true,
    )
  }

  // Scroll reveal animation
  function revealElements() {
    const reveals = document.querySelectorAll(".reveal")
    const revealTexts = document.querySelectorAll(".reveal-text")

    reveals.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("active")
      }
    })

    revealTexts.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", revealElements)
  setTimeout(revealElements, 300)
})
