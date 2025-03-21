import type { Keyword } from "./types"
import { removeStopwords } from "./utils"

/**
 * Extracts important keywords from text content
 */
export function extractKeywords(content: string, paragraphs: string[]): Keyword[] {
  // Extract sentences for context
  const sentences = extractSentences(content)

  // Get word frequency
  const wordFrequency = calculateWordFrequency(content)

  // Calculate TF-IDF for each word
  const tfidfScores = calculateTFIDF(wordFrequency, paragraphs)

  // Create keyword objects
  const keywords: Keyword[] = []

  for (const [word, frequency] of Object.entries(wordFrequency)) {
    // Skip very short words and numbers
    if (word.length < 3 || /^\d+$/.test(word)) continue

    const importance = tfidfScores[word] || 0

    // Only include words with sufficient importance
    if (importance > 0.1) {
      // Find sentences containing this word for context
      const wordContext = sentences.filter((sentence) => sentence.toLowerCase().includes(word.toLowerCase()))

      keywords.push({
        word,
        importance,
        frequency,
        context: wordContext.slice(0, 3), // Limit to 3 context sentences
      })
    }
  }

  // Sort by importance
  return keywords.sort((a, b) => b.importance - a.importance)
}

/**
 * Extracts sentences from text
 */
function extractSentences(text: string): string[] {
  // Simple sentence extraction - split by period, question mark, or exclamation point
  const sentenceRegex = /[^.!?]+[.!?]+/g
  const matches = text.match(sentenceRegex)

  return matches ? matches.map((s) => s.trim()) : []
}

/**
 * Calculates word frequency in text
 */
function calculateWordFrequency(text: string): Record<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Replace punctuation with spaces
    .split(/\s+/) // Split by whitespace
    .filter((word) => word.length > 0)

  // Remove common stopwords
  const filteredWords = removeStopwords(words)

  // Count frequency
  const frequency: Record<string, number> = {}

  for (const word of filteredWords) {
    frequency[word] = (frequency[word] || 0) + 1
  }

  return frequency
}

/**
 * Calculates TF-IDF scores for words
 */
function calculateTFIDF(wordFrequency: Record<string, number>, paragraphs: string[]): Record<string, number> {
  const scores: Record<string, number> = {}
  const totalWords = Object.values(wordFrequency).reduce((sum, freq) => sum + freq, 0)

  // Calculate document frequency (how many paragraphs contain each word)
  const documentFrequency: Record<string, number> = {}

  for (const word of Object.keys(wordFrequency)) {
    documentFrequency[word] = paragraphs.filter((p) => p.toLowerCase().includes(word.toLowerCase())).length
  }

  // Calculate TF-IDF
  for (const [word, frequency] of Object.entries(wordFrequency)) {
    // Term frequency
    const tf = frequency / totalWords

    // Inverse document frequency
    const idf = Math.log(paragraphs.length / (1 + (documentFrequency[word] || 1)))

    // TF-IDF score
    scores[word] = tf * idf
  }

  return scores
}

