const { defineConfig } = require('sanity')
const { structureTool } = require('sanity/structure')
const { visionTool } = require('@sanity/vision')
const { schemaTypes } = require('./schemaTypes')

module.exports = defineConfig({
  name: 'default',
  title: 'PUX Blog',

  projectId: 'j5s1dfn3',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
