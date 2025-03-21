import type { Document } from "./types"
import { extractKeywords } from "./keyword-extractor"

/**
 * Processes a raw document text into a structured Document object
 */
export function processDocument(title: string, content: string): Document {
  const documentId = `doc_${Date.now()}`
  const sections = extractSections(content)

  return {
    id: documentId,
    title,
    content,
    sections: sections.map((section, index) => {
      const sectionId = `${documentId}_section_${index}`
      const paragraphs = extractParagraphs(section.content)
      const keywords = extractKeywords(section.content, paragraphs)

      return {
        id: sectionId,
        title: section.title,
        content: section.content,
        level: section.level,
        paragraphs,
        keywords,
      }
    }),
  }
}

/**
 * Extracts sections from document content based on headings
 */
function extractSections(content: string): { title: string; content: string; level: number }[] {
  // Simple section extraction based on markdown-style headings
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const matches = [...content.matchAll(headingRegex)]

  if (matches.length === 0) {
    // If no headings found, treat the entire document as one section
    return [{ title: "Main Content", content, level: 1 }]
  }

  const sections: { title: string; content: string; level: number; startIndex: number }[] = []

  // Process each heading and extract its content
  matches.forEach((match, index) => {
    const level = match[1].length
    const title = match[2].trim()
    const startIndex = match.index || 0

    sections.push({
      title,
      content: "", // Will be filled later
      level,
      startIndex,
    })
  })

  // Fill in the content for each section
  sections.forEach((section, index) => {
    const nextIndex = index < sections.length - 1 ? sections[index + 1].startIndex : content.length
    const sectionContent = content.substring(section.startIndex, nextIndex)

    // Remove the heading itself from the content
    const headingEndIndex = sectionContent.indexOf("\n")
    section.content = sectionContent.substring(headingEndIndex + 1).trim()

    // Remove the startIndex property as it's no longer needed
    delete section.startIndex
  })

  return sections as { title: string; content: string; level: number }[]
}

/**
 * Extracts paragraphs from section content
 */
function extractParagraphs(content: string): string[] {
  // Split by double newlines to separate paragraphs
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

