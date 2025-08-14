// Blog functionality with Sanity integration
class BlogManager {
    constructor() {
      this.currentPage = 1
      this.postsPerPage = 6
      this.currentFilter = "all"
      this.currentSearch = ""
      this.allPosts = []
      this.isLoading = false
  
      this.init()
    }
  
    async init() {
      // Wait for Sanity client to be available
      if (typeof window.sanityClient === "undefined") {
        console.error("Sanity client not found. Please check your configuration.")
        this.showError("Unable to connect to content management system.")
        return
      }
  
      this.bindEvents()
      await this.loadPosts()
      await this.loadFeaturedPost()
    }
  
    bindEvents() {
      // Filter buttons
      const filterBtns = document.querySelectorAll(".filter-btn")
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.handleFilterChange(e.target.dataset.filter)
        })
      })
  
      // Search input
      const searchInput = document.getElementById("blog-search")
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.handleSearch(e.target.value)
        })
      }
  
      // Load more button
      const loadMoreBtn = document.getElementById("load-more-btn")
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
          this.loadMorePosts()
        })
      }
  
      // Newsletter form
      const newsletterForm = document.getElementById("newsletter-form")
      if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
          this.handleNewsletterSubmit(e)
        })
      }
    }
  
    async loadPosts() {
      if (this.isLoading) return
  
      this.isLoading = true
      this.showLoading()
  
      try {
        // GROQ query to fetch blog posts
        const query = `
                  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
                      _id,
                      title,
                      slug,
                      excerpt,
                      publishedAt,
                      mainImage {
                          asset->{
                              _id,
                              url
                          },
                          alt
                      },
                      categories[]->{
                          title,
                          slug
                      },
                      author->{
                          name,
                          image {
                              asset->{
                                  _id,
                                  url
                              }
                          }
                      }
                  }
              `
  
        const posts = await window.sanityClient.fetch(query)
        this.allPosts = posts || []
  
        if (this.allPosts.length === 0) {
          this.showEmptyState()
        } else {
          this.renderPosts()
        }
      } catch (error) {
        console.error("Error loading posts:", error)
        this.showError("Failed to load blog posts. Please try again later.")
      } finally {
        this.isLoading = false
      }
    }
  
    async loadFeaturedPost() {
      try {
        // Query for featured post (you can modify this based on your schema)
        const query = `
                  *[_type == "post" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) [0] {
                      _id,
                      title,
                      slug,
                      excerpt,
                      publishedAt,
                      mainImage {
                          asset->{
                              _id,
                              url
                          },
                          alt
                      },
                      categories[]->{
                          title,
                          slug
                      },
                      author->{
                          name,
                          image {
                              asset->{
                                  _id,
                                  url
                              }
                          }
                      }
                  }
              `
  
        const featuredPost = await window.sanityClient.fetch(query)
  
        if (featuredPost) {
          this.renderFeaturedPost(featuredPost)
        } else {
          // If no featured post, hide the section
          const featuredSection = document.getElementById("featured-post")
          if (featuredSection) {
            featuredSection.style.display = "none"
          }
        }
      } catch (error) {
        console.error("Error loading featured post:", error)
      }
    }
  
    renderFeaturedPost(post) {
      const featuredContent = document.querySelector(".featured-content")
      if (!featuredContent) return
  
      const imageUrl = post.mainImage
        ? window.sanityClient.imageUrlBuilder(post.mainImage, { width: 600, height: 400, quality: 90 })
        : "/placeholder.svg?height=400&width=600"
  
      const authorImage = post.author?.image
        ? window.sanityClient.imageUrlBuilder(post.author.image, { width: 60, height: 60, quality: 90 })
        : "/placeholder.svg?height=60&width=60"
  
      const category = post.categories?.[0]?.title || "Article"
      const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
  
      featuredContent.innerHTML = `
              <div class="featured-badge">Featured Article</div>
              <div class="featured-article">
                  <div class="featured-image">
                      <img src="${imageUrl}" alt="${post.mainImage?.alt || post.title}" loading="lazy">
                  </div>
                  <div class="featured-text">
                      <div class="featured-category">${category}</div>
                      <h2 class="featured-title">${post.title}</h2>
                      <p class="featured-excerpt">${post.excerpt || ""}</p>
                      <div class="featured-meta">
                          <div class="featured-author">
                              <img src="${authorImage}" alt="${post.author?.name || "Author"}" class="author-avatar">
                              <span>${post.author?.name || "Pure UXels Team"}</span>
                          </div>
                          <span class="featured-date">${publishedDate}</span>
                      </div>
                      <a href="blog-post.html?slug=${post.slug.current}" class="read-more-btn">
                          Read Full Article <i class="fas fa-arrow-right"></i>
                      </a>
                  </div>
              </div>
          `
    }
  
    renderPosts() {
      const container = document.getElementById("blog-posts")
      if (!container) return
  
      const filteredPosts = this.getFilteredPosts()
      const postsToShow = filteredPosts.slice(0, this.currentPage * this.postsPerPage)
  
      if (postsToShow.length === 0) {
        this.showEmptyState()
        return
      }
  
      container.innerHTML = postsToShow
        .map((post, index) => {
          const imageUrl = post.mainImage
            ? window.sanityClient.imageUrlBuilder(post.mainImage, { width: 400, height: 250, quality: 90 })
            : "/placeholder.svg?height=250&width=400"
  
          const category = post.categories?.[0]?.title || "Article"
          const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
  
          return `
                  <article class="blog-post" style="animation-delay: ${index * 0.1}s">
                      <div class="blog-post-image">
                          <img src="${imageUrl}" alt="${post.mainImage?.alt || post.title}" loading="lazy">
                      </div>
                      <div class="blog-post-content">
                          <div class="blog-post-category">${category}</div>
                          <h3 class="blog-post-title">
                              <a href="blog-post.html?slug=${post.slug.current}">${post.title}</a>
                          </h3>
                          <p class="blog-post-excerpt">${post.excerpt || ""}</p>
                          <div class="blog-post-meta">
                              <div class="blog-post-author">
                                  <span>${post.author?.name || "Pure UXels Team"}</span>
                              </div>
                              <div class="blog-post-date">${publishedDate}</div>
                          </div>
                      </div>
                  </article>
              `
        })
        .join("")
  
      // Update load more button
      this.updateLoadMoreButton(filteredPosts.length)
    }
  
    getFilteredPosts() {
      let filtered = [...this.allPosts]
  
      // Apply category filter
      if (this.currentFilter !== "all") {
        filtered = filtered.filter((post) => post.categories?.some((cat) => cat.slug.current === this.currentFilter))
      }
  
      // Apply search filter
      if (this.currentSearch) {
        const searchTerm = this.currentSearch.toLowerCase()
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm)),
        )
      }
  
      return filtered
    }
  
    handleFilterChange(filter) {
      this.currentFilter = filter
      this.currentPage = 1
  
      // Update active filter button
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active")
      })
      document.querySelector(`[data-filter="${filter}"]`).classList.add("active")
  
      this.renderPosts()
    }
  
    handleSearch(searchTerm) {
      this.currentSearch = searchTerm
      this.currentPage = 1
      this.renderPosts()
    }
  
    loadMorePosts() {
      this.currentPage++
      this.renderPosts()
    }
  
    updateLoadMoreButton(totalFilteredPosts) {
      const loadMoreBtn = document.getElementById("load-more-btn")
      if (!loadMoreBtn) return
  
      const showingPosts = this.currentPage * this.postsPerPage
  
      if (showingPosts >= totalFilteredPosts) {
        loadMoreBtn.style.display = "none"
      } else {
        loadMoreBtn.style.display = "inline-flex"
      }
    }
  
    showLoading() {
      const container = document.getElementById("blog-posts")
      if (container) {
        container.innerHTML = `
                  <div class="loading-state">
                      <div class="loading-spinner"></div>
                      <p>Loading articles...</p>
                  </div>
              `
      }
    }
  
    showEmptyState() {
      const container = document.getElementById("blog-posts")
      if (container) {
        const message = this.currentSearch ? `No articles found for "${this.currentSearch}"` : "No articles found"
  
        container.innerHTML = `
                  <div class="empty-state">
                      <i class="fas fa-search"></i>
                      <h3>${message}</h3>
                      <p>Try adjusting your search or filter criteria.</p>
                  </div>
              `
      }
    }
  
    showError(message) {
      const container = document.getElementById("blog-posts")
      if (container) {
        container.innerHTML = `
                  <div class="empty-state">
                      <i class="fas fa-exclamation-triangle"></i>
                      <h3>Oops! Something went wrong</h3>
                      <p>${message}</p>
                  </div>
              `
      }
    }
  
    handleNewsletterSubmit(e) {
      e.preventDefault()
      const email = e.target.querySelector('input[type="email"]').value
  
      // Here you would typically send the email to your newsletter service
      console.log("Newsletter signup:", email)
  
      // Show success message
      alert("Thank you for subscribing to our newsletter!")
      e.target.reset()
    }
  }
  
  // Initialize blog manager when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    new BlogManager()
  })
  