// Blog Configuration
// Update these settings to match your Sanity project and preferences

const blogConfig = {
    // Sanity Configuration
    sanity: {
      projectId: "j5s1dfn3", // Replace with your Sanity project ID
      dataset: "production", // Replace with your dataset name
      apiVersion: "2025-08-12",
      useCdn: true, // Set to false for development
    },
  
    // Blog Settings
    blog: {
      postsPerPage: 6,
      featuredPostsCount: 1,
      relatedPostsCount: 3,
      excerptLength: 160,
      readingWordsPerMinute: 200,
    },
  
    // SEO Settings
    seo: {
      siteName: "Pure UXels",
      siteUrl: "https://pureuxels.com", // Replace with your website URL
      defaultImage: "/Assets/og-image.jpg", // Default social sharing image
      twitterHandle: "@PureUxels",
    },
  
    // Social Media Links
    social: {
      twitter: "https://x.com/PureUxels",
      instagram: "https://www.instagram.com/pure_uxels",
      linkedin: "https://www.linkedin.com/in/pure-uxels-476365361/",
      facebook: "#",
    },
  
    // Contact Information
    contact: {
      email: "studio@pureuxels.com",
      phone: "+254798785974",
      address: {
        city: "Nairobi",
        country: "Kenya",
      },
    },
  
    // Navigation Links (update these to match your existing pages)
    navigation: {
      main: [
        { name: "Home", href: "./index.html" },
        { name: "Services", href: "./services.html" },
        { name: "About", href: "./About.html" },
        { name: "Portfolio", href: "./portfolio.html" },
        { name: "Blog", href: "./blog.html" },
        { name: "Contact", href: "./contact.html" },
      ],
      overlay: [
        { name: "Work", href: "./portfolio.html" },
        { name: "Services", href: "./services.html" },
        { name: "About", href: "./About.html" },
        { name: "Contact", href: "./contact.html" },
        { name: "Blog", href: "./blog.html" },
      ],
    },
  }
  
  // Export configuration
  if (typeof window !== "undefined") {
    window.blogConfig = blogConfig
  }
  
  if (typeof module !== "undefined" && module.exports) {
    module.exports = blogConfig
  }
  