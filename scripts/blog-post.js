// Individual Blog Post functionality with Sanity integration
class BlogPostManager {
    constructor() {
      this.postSlug = this.getSlugFromURL()
      this.currentPost = null
      this.relatedPosts = []
  
      this.init()
    }
  
    getSlugFromURL() {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get("slug")
    }
  
    async init() {
      // Wait for Sanity client to be available
      if (typeof window.sanityClient === "undefined") {
        console.error("Sanity client not found. Please check your configuration.")
        this.showError("Unable to connect to content management system.")
        return
      }
  
      if (!this.postSlug) {
        this.showError("No article specified.")
        return
      }
  
      this.bindEvents()
      await this.loadPost()
    }
  
    bindEvents() {
      // Share functionality
      const shareBtn = document.getElementById("share-btn")
      if (shareBtn) {
        shareBtn.addEventListener("click", () => this.handleShare())
      }
  
      // Social share buttons
      const shareButtons = {
        twitter: document.getElementById("share-twitter"),
        facebook: document.getElementById("share-facebook"),
        linkedin: document.getElementById("share-linkedin"),
        copy: document.getElementById("copy-link"),
      }
  
      Object.entries(shareButtons).forEach(([platform, button]) => {
        if (button) {
          button.addEventListener("click", (e) => {
            e.preventDefault()
            this.handleSocialShare(platform)
          })
        }
      })
  
      // Scroll spy for table of contents
      window.addEventListener("scroll", () => this.updateTOC())
    }
  
    async loadPost() {
      this.showLoading()
  
      try {
        // GROQ query to fetch individual blog post
        const query = `
                  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))] [0] {
                      _id,
                      title,
                      slug,
                      excerpt,
                      publishedAt,
                      body,
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
                          title,
                          image {
                              asset->{
                                  _id,
                                  url
                              }
                          }
                      },
                      seo {
                          metaTitle,
                          metaDescription,
                          ogImage {
                              asset->{
                                  _id,
                                  url
                              }
                          }
                      }
                  }
              `
  
        const post = await window.sanityClient.fetch(query, { slug: this.postSlug })
  
        if (!post) {
          this.showError("Article not found.")
          return
        }
  
        this.currentPost = post
        this.renderPost()
        this.updateSEO()
        await this.loadRelatedPosts()
        await this.loadPostNavigation()
      } catch (error) {
        console.error("Error loading post:", error)
        this.showError("Failed to load article. Please try again later.")
      }
    }
  
    renderPost() {
      const post = this.currentPost
  
      // Update page title
      document.title = `${post.title} - Pure UXels Blog`
  
      // Update breadcrumb
      const breadcrumbTitle = document.getElementById("breadcrumb-title")
      if (breadcrumbTitle) {
        breadcrumbTitle.textContent = post.title
      }
  
      // Render categories
      const categoriesContainer = document.getElementById("post-categories")
      if (categoriesContainer && post.categories) {
        categoriesContainer.innerHTML = post.categories
          .map((category) => `<span class="post-category">${category.title}</span>`)
          .join("")
      }
  
      // Calculate reading time
      const readingTime = this.calculateReadingTime(post.body)
      const readingTimeElement = document.getElementById("reading-time")
      if (readingTimeElement) {
        readingTimeElement.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min read`
      }
  
      // Render title and excerpt
      document.getElementById("post-title").textContent = post.title
      if (post.excerpt) {
        document.getElementById("post-excerpt").textContent = post.excerpt
      }
  
      // Render author
      const authorContainer = document.getElementById("post-author")
      if (authorContainer && post.author) {
        const authorImage = post.author.image
          ? window.sanityClient.imageUrlBuilder(post.author.image, { width: 80, height: 80, quality: 90 })
          : "/placeholder.svg?height=80&width=80"
  
        authorContainer.innerHTML = `
                  <img src="${authorImage}" alt="${post.author.name}" class="author-avatar">
                  <div class="author-info">
                      <div class="author-name">${post.author.name}</div>
                      ${post.author.title ? `<div class="author-title">${post.author.title}</div>` : ""}
                  </div>
              `
      }
  
      // Render date
      const dateElement = document.getElementById("post-date")
      if (dateElement) {
        const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        dateElement.textContent = publishedDate
      }
  
      // Render featured image
      if (post.mainImage) {
        const imageUrl = window.sanityClient.imageUrlBuilder(post.mainImage, {
          width: 1200,
          height: 600,
          quality: 90,
        })
  
        const featuredImg = document.getElementById("featured-img")
        if (featuredImg) {
          featuredImg.src = imageUrl
          featuredImg.alt = post.mainImage.alt || post.title
        }
      } else {
        // Hide featured image section if no image
        const featuredImageSection = document.getElementById("post-featured-image")
        if (featuredImageSection) {
          featuredImageSection.style.display = "none"
        }
      }
  
      // Render post content
      this.renderPostContent(post.body)
  
      // Generate table of contents
      this.generateTOC()
  
      // Show the post content
      this.showPost()
    }
  
    renderPostContent(body) {
      const contentContainer = document.getElementById("post-body")
      if (!contentContainer || !body) return
  
      // Convert Sanity's Portable Text to HTML
      // This is a simplified version - you might want to use @sanity/block-content-to-html for complex content
      const htmlContent = this.portableTextToHTML(body)
      contentContainer.innerHTML = htmlContent
    }
  
    portableTextToHTML(blocks) {
      if (!blocks || !Array.isArray(blocks)) return ""
  
      return blocks
        .map((block) => {
          switch (block._type) {
            case "block":
              return this.renderBlock(block)
            case "image":
              return this.renderImage(block)
            default:
              return ""
          }
        })
        .join("")
    }
  
    renderBlock(block) {
      const style = block.style || "normal"
      const children = block.children || []
  
      const text = children
        .map((child) => {
          let text = child.text || ""
  
          // Apply marks (bold, italic, etc.)
          if (child.marks && child.marks.length > 0) {
            child.marks.forEach((mark) => {
              switch (mark) {
                case "strong":
                  text = `<strong>${text}</strong>`
                  break
                case "em":
                  text = `<em>${text}</em>`
                  break
                case "code":
                  text = `<code>${text}</code>`
                  break
              }
            })
          }
  
          return text
        })
        .join("")
  
      switch (style) {
        case "h1":
          return `<h1 id="${this.generateId(text)}">${text}</h1>`
        case "h2":
          return `<h2 id="${this.generateId(text)}">${text}</h2>`
        case "h3":
          return `<h3 id="${this.generateId(text)}">${text}</h3>`
        case "h4":
          return `<h4 id="${this.generateId(text)}">${text}</h4>`
        case "blockquote":
          return `<blockquote>${text}</blockquote>`
        default:
          return `<p>${text}</p>`
      }
    }
  
    renderImage(block) {
      if (!block.asset) return ""
  
      const imageUrl = window.sanityClient.imageUrlBuilder(block, {
        width: 800,
        quality: 90,
      })
  
      return `<img src="${imageUrl}" alt="${block.alt || ""}" loading="lazy">`
    }
  
    generateId(text) {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }
  
    calculateReadingTime(body) {
      if (!body || !Array.isArray(body)) return 1
  
      const wordCount = body.reduce((count, block) => {
        if (block._type === "block" && block.children) {
          const blockText = block.children.map((child) => child.text || "").join(" ")
          return count + blockText.split(/\s+/).length
        }
        return count
      }, 0)
  
      return Math.max(1, Math.ceil(wordCount / 200)) // Assuming 200 words per minute
    }
  
    generateTOC() {
      const headings = document.querySelectorAll("#post-body h1, #post-body h2, #post-body h3, #post-body h4")
      const tocNav = document.getElementById("toc-nav")
      const tocWidget = document.getElementById("toc-widget")
  
      if (!tocNav || headings.length === 0) {
        if (tocWidget) tocWidget.style.display = "none"
        return
      }
  
      const tocItems = Array.from(headings)
        .map((heading) => {
          const level = heading.tagName.toLowerCase()
          const text = heading.textContent
          const id = heading.id || this.generateId(text)
  
          if (!heading.id) heading.id = id
  
          return `<a href="#${id}" class="toc-${level}">${text}</a>`
        })
        .join("")
  
      tocNav.innerHTML = tocItems
    }
  
    updateTOC() {
      const tocLinks = document.querySelectorAll(".toc-nav a")
      const headings = document.querySelectorAll("#post-body h1, #post-body h2, #post-body h3, #post-body h4")
  
      let activeHeading = null
      const scrollPosition = window.scrollY + 150
  
      headings.forEach((heading) => {
        if (heading.offsetTop <= scrollPosition) {
          activeHeading = heading
        }
      })
  
      tocLinks.forEach((link) => link.classList.remove("active"))
  
      if (activeHeading) {
        const activeLink = document.querySelector(`.toc-nav a[href="#${activeHeading.id}"]`)
        if (activeLink) activeLink.classList.add("active")
      }
    }
  
    async loadRelatedPosts() {
      if (!this.currentPost.categories || this.currentPost.categories.length === 0) return
  
      try {
        const categoryIds = this.currentPost.categories.map((cat) => cat._id)
  
        const query = `
                  *[_type == "post" && _id != $currentId && count(categories[@._ref in $categoryIds]) > 0 && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...3] {
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
                      }
                  }
              `
  
        const relatedPosts = await window.sanityClient.fetch(query, {
          currentId: this.currentPost._id,
          categoryIds,
        })
  
        this.relatedPosts = relatedPosts || []
        this.renderRelatedPosts()
      } catch (error) {
        console.error("Error loading related posts:", error)
      }
    }
  
    renderRelatedPosts() {
      const container = document.getElementById("related-posts-grid")
      const section = document.getElementById("related-posts")
  
      if (!container || this.relatedPosts.length === 0) {
        if (section) section.style.display = "none"
        return
      }
  
      container.innerHTML = this.relatedPosts
        .map((post) => {
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
                  <a href="blog-post.html?slug=${post.slug.current}" class="related-post">
                      <div class="related-post-image">
                          <img src="${imageUrl}" alt="${post.mainImage?.alt || post.title}" loading="lazy">
                      </div>
                      <div class="related-post-content">
                          <div class="related-post-category">${category}</div>
                          <h3 class="related-post-title">${post.title}</h3>
                          <div class="related-post-date">${publishedDate}</div>
                      </div>
                  </a>
              `
        })
        .join("")
    }
  
    async loadPostNavigation() {
      try {
        // Get previous and next posts
        const query = `{
                  "previous": *[_type == "post" && publishedAt < $currentDate && !(_id in path("drafts.**"))] | order(publishedAt desc) [0] {
                      title,
                      slug
                  },
                  "next": *[_type == "post" && publishedAt > $currentDate && !(_id in path("drafts.**"))] | order(publishedAt asc) [0] {
                      title,
                      slug
                  }
              }`
  
        const navigation = await window.sanityClient.fetch(query, {
          currentDate: this.currentPost.publishedAt,
        })
  
        this.renderPostNavigation(navigation)
      } catch (error) {
        console.error("Error loading post navigation:", error)
      }
    }
  
    renderPostNavigation(navigation) {
      const navContainer = document.getElementById("post-navigation")
      const prevContainer = document.getElementById("nav-previous")
      const nextContainer = document.getElementById("nav-next")
  
      if (!navigation.previous && !navigation.next) {
        if (navContainer) navContainer.style.display = "none"
        return
      }
  
      if (navigation.previous && prevContainer) {
        prevContainer.innerHTML = `
                  <span class="nav-label">← Previous Article</span>
                  <span class="nav-title">${navigation.previous.title}</span>
              `
        prevContainer.href = `blog-post.html?slug=${navigation.previous.slug.current}`
      }
  
      if (navigation.next && nextContainer) {
        nextContainer.innerHTML = `
                  <span class="nav-label">Next Article →</span>
                  <span class="nav-title">${navigation.next.title}</span>
              `
        nextContainer.href = `blog-post.html?slug=${navigation.next.slug.current}`
      }
    }
  
    updateSEO() {
      const post = this.currentPost
  
      // Update meta tags
      const metaTitle = post.seo?.metaTitle || post.title
      const metaDescription = post.seo?.metaDescription || post.excerpt || ""
      const ogImage = post.seo?.ogImage || post.mainImage
  
      document.title = `${metaTitle} - Pure UXels`
  
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement("meta")
        metaDesc.name = "description"
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = metaDescription
  
      // Update Open Graph tags
      const ogTags = {
        "og:title": metaTitle,
        "og:description": metaDescription,
        "og:url": window.location.href,
        "og:type": "article",
      }
  
      if (ogImage) {
        ogTags["og:image"] = window.sanityClient.imageUrlBuilder(ogImage, {
          width: 1200,
          height: 630,
          quality: 90,
        })
      }
  
      Object.entries(ogTags).forEach(([property, content]) => {
        let tag = document.querySelector(`meta[property="${property}"]`)
        if (!tag) {
          tag = document.createElement("meta")
          tag.setAttribute("property", property)
          document.head.appendChild(tag)
        }
        tag.content = content
      })
  
      // Update Twitter Card tags
      const twitterTags = {
        "twitter:title": metaTitle,
        "twitter:description": metaDescription,
      }
  
      if (ogImage) {
        twitterTags["twitter:image"] = ogTags["og:image"]
      }
  
      Object.entries(twitterTags).forEach(([name, content]) => {
        let tag = document.querySelector(`meta[name="${name}"]`)
        if (!tag) {
          tag = document.createElement("meta")
          tag.name = name
          document.head.appendChild(tag)
        }
        tag.content = content
      })
    }
  
    handleShare() {
      if (navigator.share) {
        navigator
          .share({
            title: this.currentPost.title,
            text: this.currentPost.excerpt || "",
            url: window.location.href,
          })
          .catch((error) => console.log("Error sharing:", error))
      } else {
        this.handleSocialShare("copy")
      }
    }
  
    handleSocialShare(platform) {
      const url = encodeURIComponent(window.location.href)
      const title = encodeURIComponent(this.currentPost.title)
      const text = encodeURIComponent(this.currentPost.excerpt || "")
  
      let shareUrl = ""
  
      switch (platform) {
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
          break
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
          break
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
          break
        case "copy":
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              alert("Link copied to clipboard!")
            })
            .catch(() => {
              // Fallback for older browsers
              const textArea = document.createElement("textarea")
              textArea.value = window.location.href
              document.body.appendChild(textArea)
              textArea.select()
              document.execCommand("copy")
              document.body.removeChild(textArea)
              alert("Link copied to clipboard!")
            })
          return
      }
  
      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400")
      }
    }
  
    showLoading() {
      document.getElementById("post-loading").style.display = "block"
      document.getElementById("post-error").style.display = "none"
      document.getElementById("blog-post-content").style.display = "none"
    }
  
    showError(message) {
      document.getElementById("post-loading").style.display = "none"
      document.getElementById("post-error").style.display = "block"
      document.getElementById("blog-post-content").style.display = "none"
  
      const errorContent = document.querySelector(".error-content p")
      if (errorContent) {
        errorContent.textContent = message
      }
    }
  
    showPost() {
      document.getElementById("post-loading").style.display = "none"
      document.getElementById("post-error").style.display = "none"
      document.getElementById("blog-post-content").style.display = "block"
    }
  }
  
  // Initialize blog post manager when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    new BlogPostManager()
  })
  