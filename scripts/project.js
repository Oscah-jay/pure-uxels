// Sanity Client Configuration
const SANITY_PROJECT_ID = "your-project-id" // Replace with your Sanity project ID
const SANITY_DATASET = "production"
const SANITY_API_VERSION = "2023-05-03"

// Get project slug from URL
function getProjectSlug() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("slug")
}

// Sanity Query to fetch single project by slug
function getProjectQuery(slug) {
  return `*[_type == "project" && slug.current == "${slug}"][0] {
        _id,
        title,
        slug,
        tagline,
        category,
        client,
        year,
        services,
        description,
        challenge,
        solution,
        results,
        mainImage {
            asset-> {
                url
            }
        },
        gallery[] {
            asset-> {
                url
            }
        },
        tags[]-> {
            title
        },
        "nextProject": *[_type == "project" && order > ^.order] | order(order asc)[0] {
            title,
            slug
        }
    }`
}

// Fetch project from Sanity
async function fetchProject(slug) {
  const loading = document.getElementById("loading")
  loading.classList.add("active")

  try {
    const query = getProjectQuery(slug)
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`

    const response = await fetch(url)
    const data = await response.json()

    console.log("[v0] Fetched project:", data.result)

    if (data.result) {
      renderProject(data.result)
    } else {
      // Fallback to demo data
      renderProject(getDemoProject(slug))
    }
  } catch (error) {
    console.error("[v0] Error fetching project:", error)
    renderProject(getDemoProject(slug))
  } finally {
    loading.classList.remove("active")
  }
}

// Demo project data
function getDemoProject(slug) {
  const projects = {
    "modern-heritage": {
      title: "Modern Heritage",
      tagline: "Told Our Way",
      category: "Branding",
      client: "Heritage Foundation",
      year: "2024",
      services: ["Brand Strategy", "Visual Identity", "Photography", "Art Direction"],
      description:
        "A celebration of cultural heritage through contemporary design, bridging tradition and modernity with authentic storytelling.",
      challenge:
        "The challenge was to create a visual identity that honors traditional heritage while appealing to a modern, diverse audience.",
      solution:
        "We developed a comprehensive brand system that combines traditional patterns with contemporary typography and photography, creating a unique visual language that speaks to both heritage and progress.",
      results: [
        { number: "300%", label: "Increase in Engagement" },
        { number: "150K+", label: "Social Media Reach" },
        { number: "25", label: "Awards Won" },
      ],
      mainImage: { asset: { url: "/modern-heritage-african-beauty-portrait.jpg" } },
      gallery: [
        { asset: { url: "/heritage-branding-materials.jpg" } },
        { asset: { url: "/traditional-patterns-modern-design.jpg" } },
        { asset: { url: "/heritage-photography-campaign.jpg" } },
      ],
      nextProject: { title: "GCV", slug: { current: "gcv" } },
    },
    gcv: {
      title: "GCV",
      tagline: "Global Creative Vision",
      category: "Brand Design",
      client: "GCV International",
      year: "2024",
      services: ["Brand Strategy", "Visual Design", "Motion Graphics"],
      description:
        "A bold reimagining of a global creative consultancy, emphasizing fluidity, innovation, and cross-cultural collaboration.",
      challenge:
        "To create a brand identity that represents global creativity while maintaining a cohesive and memorable visual language.",
      solution:
        "We designed an abstract, flowing visual system inspired by fabric and movement, symbolizing the fluid nature of creativity across cultures.",
      results: [
        { number: "50+", label: "Global Partners" },
        { number: "200%", label: "Business Growth" },
        { number: "15", label: "Countries Reached" },
      ],
      mainImage: { asset: { url: "/abstract-flowing-fabric-green-turquoise.jpg" } },
      gallery: [{ asset: { url: "/gcv-brand-applications.jpg" } }, { asset: { url: "/global-creative-vision-identity.jpg" } }],
      nextProject: { title: "Modern Heritage", slug: { current: "modern-heritage" } },
    },
  }

  return projects[slug] || projects["modern-heritage"]
}

// Render project detail
function renderProject(project) {
  const container = document.getElementById("projectDetail")

  const galleryHTML =
    project.gallery
      ?.map((img) => `<img src="${img.asset.url}" alt="${project.title}" class="gallery-item">`)
      .join("") || ""

  const resultsHTML =
    project.results
      ?.map(
        (result) =>
          `<div class="result-item">
            <div class="result-number">${result.number}</div>
            <div class="result-label">${result.label}</div>
        </div>`,
      )
      .join("") || ""

  const servicesHTML = project.services?.map((service) => `<li>${service}</li>`).join("") || ""

  container.innerHTML = `
        <div class="project-hero">
            <img src="${project.mainImage.asset.url}" alt="${project.title}" class="project-hero-image">
            
            <div class="project-header">
                <div class="project-category">${project.category}</div>
                <h1 class="project-title">${project.title}</h1>
                ${project.tagline ? `<p class="project-tagline">${project.tagline}</p>` : ""}
                
                <div class="project-meta">
                    ${
                      project.client
                        ? `
                    <div class="meta-item">
                        <h4>Client</h4>
                        <p>${project.client}</p>
                    </div>`
                        : ""
                    }
                    ${
                      project.year
                        ? `
                    <div class="meta-item">
                        <h4>Year</h4>
                        <p>${project.year}</p>
                    </div>`
                        : ""
                    }
                    ${
                      project.services
                        ? `
                    <div class="meta-item">
                        <h4>Services</h4>
                        <ul>${servicesHTML}</ul>
                    </div>`
                        : ""
                    }
                </div>
            </div>
        </div>
        
        <div class="project-content">
            ${
              project.description
                ? `
            <div class="project-section">
                <h2>Overview</h2>
                <p>${project.description}</p>
            </div>`
                : ""
            }
            
            ${
              project.challenge
                ? `
            <div class="project-section">
                <h2>The Challenge</h2>
                <p>${project.challenge}</p>
            </div>`
                : ""
            }
            
            ${
              project.solution
                ? `
            <div class="project-section">
                <h2>Our Solution</h2>
                <p>${project.solution}</p>
            </div>`
                : ""
            }
        </div>
        
        ${
          galleryHTML
            ? `
        <div class="project-gallery">
            <div class="gallery-grid">
                ${galleryHTML}
            </div>
        </div>`
            : ""
        }
        
        ${
          resultsHTML
            ? `
        <div class="project-section">
            <h2>Results</h2>
            <div class="results-grid">
                ${resultsHTML}
            </div>
        </div>`
            : ""
        }
        
        ${
          project.nextProject
            ? `
        <div class="next-project">
            <h3>Next Project</h3>
            <h2>${project.nextProject.title}</h2>
            <a href="project.html?slug=${project.nextProject.slug.current}" class="next-project-link">View Project →</a>
        </div>`
            : ""
        }
    `

  // Update page title
  document.title = `${project.title} - Creative Agency`
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const slug = getProjectSlug()
  if (slug) {
    fetchProject(slug)
  } else {
    document.getElementById("projectDetail").innerHTML = `
            <div style="text-align: center; padding: 4rem;">
                <h1>Project not found</h1>
                <p><a href="portfolio.html">← Back to Portfolio</a></p>
            </div>
        `
    document.getElementById("loading").classList.remove("active")
  }
})
