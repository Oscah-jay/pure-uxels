// Sanity Client Configuration
const SANITY_PROJECT_ID = "your-project-id" // Replace with your Sanity project ID
const SANITY_DATASET = "production"
const SANITY_API_VERSION = "2023-05-03"

// Sanity Query to fetch projects
const projectsQuery = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  slug,
  tagline,
  mainImage {
    asset-> {
      url
    }
  },
  tags[]-> {
    title
  },
  category,
  order
}`

// Fetch projects from Sanity
async function fetchProjects() {
  const loading = document.getElementById("loading")
  loading.classList.add("active")

  try {
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(projectsQuery)}`

    const response = await fetch(url)
    const data = await response.json()

    console.log("[v0] Fetched projects:", data.result)

    renderProjects(data.result)
  } catch (error) {
    console.error("[v0] Error fetching projects:", error)
    // Fallback to demo data if Sanity fails
    renderProjects(getDemoProjects())
  } finally {
    loading.classList.remove("active")
  }
}

// Demo projects for development/testing
function getDemoProjects() {
  return [
    {
      _id: "1",
      title: "Modern Heritage",
      tagline: "Told Our Way",
      slug: { current: "modern-heritage" },
      mainImage: { asset: { url: "/modern-heritage-african-beauty.jpg" } },
      tags: [{ title: "Branding" }, { title: "Visual Identity" }, { title: "Photography" }],
    },
    {
      _id: "2",
      title: "GCV",
      tagline: "Global Creative Vision",
      slug: { current: "gcv" },
      mainImage: { asset: { url: "/abstract-flowing-fabric-green.jpg" } },
      tags: [{ title: "Design" }, { title: "Strategy" }, { title: "Brand Design" }],
    },
    {
      _id: "3",
      title: "Organic Foods Co.",
      tagline: "Farm to Table Movement",
      slug: { current: "organic-foods" },
      mainImage: { asset: { url: "/organic-icon-green-soccer.jpg" } },
      tags: [{ title: "Web Design" }, { title: "Visual Identity" }, { title: "Brand Strategy" }],
    },
    {
      _id: "4",
      title: "Artisan Coffee",
      tagline: "Crafted with Passion",
      slug: { current: "artisan-coffee" },
      mainImage: { asset: { url: "/coffee-beans-roasting-artisan.jpg" } },
      tags: [{ title: "Photography" }, { title: "Web Development" }, { title: "E-Commerce" }],
    },
    {
      _id: "5",
      title: "GLOBAL NEW YORKER",
      tagline: "Urban Identity",
      slug: { current: "global-new-yorker" },
      mainImage: { asset: { url: "/global-new-yorker-typography-minimal.jpg" } },
      tags: [{ title: "Branding" }, { title: "Content Strategy" }, { title: "Editorial Design" }],
    },
    {
      _id: "6",
      title: "Tech Audio Device",
      tagline: "Sound Reimagined",
      slug: { current: "tech-audio" },
      mainImage: { asset: { url: "/modern-audio-device-technology-dark.jpg" } },
      tags: [{ title: "Product Design" }, { title: "Web Design" }, { title: "3D Rendering" }],
    },
    {
      _id: "7",
      title: "Match Group",
      tagline: "Connecting Lives",
      slug: { current: "match-group" },
      mainImage: { asset: { url: "/match-group-logo-blue-gradient.jpg" } },
      tags: [{ title: "Branding" }, { title: "UX Design" }, { title: "App Design" }],
    },
  ]
}

// Render projects to the grid
function renderProjects(projects) {
  const grid = document.getElementById("portfolioGrid")
  grid.innerHTML = ""

  projects.forEach((project, index) => {
    const card = createProjectCard(project, index + 1)
    grid.appendChild(card)
  })
}

// Create individual project card
function createProjectCard(project, number) {
  const card = document.createElement("div")
  card.className = "project-card"

  const imageUrl = project.mainImage?.asset?.url || "/placeholder.svg?height=600&width=600"
  const tags = project.tags?.map((tag) => tag.title).join(" / ") || "Design / Branding"
  const slug = project.slug?.current || project._id

  card.innerHTML = `
        <div class="project-image-container">
            <img src="${imageUrl}" alt="${project.title}" class="project-image">
            <div class="project-overlay">
                <div class="project-title-overlay">${project.title}</div>
                ${project.tagline ? `<div class="project-tagline-overlay">${project.tagline}</div>` : ""}
            </div>
        </div>
        <div class="project-info">
            <div class="project-header">
                <div class="project-number">${number.toString().padStart(2, "0")}</div>
                <h3 class="project-title">${project.title}</h3>
            </div>
            <div class="project-tags">
                ${project.tags?.map((tag) => `<span class="project-tag">${tag.title}</span>`).join("") || `<span class="project-tag">${tags}</span>`}
            </div>
        </div>
    `

  // Add click handler to navigate to project detail page
  card.addEventListener("click", () => {
    window.location.href = `project.html?slug=${slug}`
  })

  return card
}

// Filter projects by category
function filterProjects(category) {
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.textContent.toLowerCase() === category.toLowerCase()) {
      link.classList.add("active")
    }
  })

  // In production, this would re-fetch with a filtered query
  console.log("[v0] Filtering by category:", category)
}

// Navigation click handlers
document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display projects
  fetchProjects()

  // Add navigation filters
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const category = link.textContent
      filterProjects(category)
    })
  })
})
