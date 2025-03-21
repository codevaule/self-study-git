import type {
  Document,
  DocumentSection,
  GeneratedQuestion,
  QuestionType,
  QuestionGenerationOptions,
  Keyword,
} from "./types"
import { generateId, shuffleArray, calculateStringSimilarity } from "./utils"

/**
 * Generates questions based on document content and options
 */
export function generateQuestions(document: Document, options: QuestionGenerationOptions): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []
  const { questionTypes, difficultyRange, count } = options

  // Filter sections if preferred sections are specified
  let sections = document.sections
  if (options.preferredSections && options.preferredSections.length > 0) {
    sections = sections.filter((section) => options.preferredSections!.includes(section.id))
  }

  // If no sections match or no sections in document, return empty array
  if (sections.length === 0) {
    return []
  }

  // Generate questions for each section
  const questionsPerSection = Math.ceil(count / sections.length)

  for (const section of sections) {
    // Skip sections with no keywords
    if (section.keywords.length === 0) continue

    // Filter keywords if excluded keywords are specified
    let keywords = section.keywords
    if (options.excludedKeywords && options.excludedKeywords.length > 0) {
      keywords = keywords.filter(
        (keyword) =>
          !options.excludedKeywords!.some((excluded) => calculateStringSimilarity(keyword.word, excluded) > 0.8),
      )
    }

    // Skip if no keywords left after filtering
    if (keywords.length === 0) continue

    // Generate questions for this section
    const sectionQuestions = generateQuestionsForSection(
      section,
      keywords,
      questionTypes,
      difficultyRange,
      questionsPerSection,
    )

    questions.push(...sectionQuestions)
  }

  // Limit to requested count and shuffle
  return shuffleArray(questions).slice(0, count)
}

/**
 * Generates questions for a specific section
 */
function generateQuestionsForSection(
  section: DocumentSection,
  keywords: Keyword[],
  questionTypes: QuestionType[],
  difficultyRange: [number, number],
  count: number,
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []
  const [minDifficulty, maxDifficulty] = difficultyRange

  // Sort keywords by importance
  const sortedKeywords = [...keywords].sort((a, b) => b.importance - a.importance)

  // Calculate how many questions to generate for each type
  const questionsPerType = Math.ceil(count / questionTypes.length)

  for (const type of questionTypes) {
    const typeQuestions: GeneratedQuestion[] = []

    // Generate questions based on type
    switch (type) {
      case "multiple-choice":
        typeQuestions.push(
          ...generateMultipleChoiceQuestions(section, sortedKeywords, questionsPerType, difficultyRange),
        )
        break

      case "fill-in-blank":
        typeQuestions.push(...generateFillInBlankQuestions(section, sortedKeywords, questionsPerType, difficultyRange))
        break

      case "true-false":
        typeQuestions.push(...generateTrueFalseQuestions(section, sortedKeywords, questionsPerType, difficultyRange))
        break

      case "short-answer":
        typeQuestions.push(...generateShortAnswerQuestions(section, sortedKeywords, questionsPerType, difficultyRange))
        break
    }

    questions.push(...typeQuestions)
  }

  return questions
}

/**
 * Generates multiple choice questions
 */
function generateMultipleChoiceQuestions(
  section: DocumentSection,
  keywords: Keyword[],
  count: number,
  difficultyRange: [number, number],
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []
  const [minDifficulty, maxDifficulty] = difficultyRange

  // Use top keywords for questions
  const keywordsToUse = keywords.slice(0, Math.min(count * 2, keywords.length))

  for (const keyword of keywordsToUse) {
    if (questions.length >= count) break

    // Skip keywords with no context
    if (keyword.context.length === 0) continue

    // Choose a random context sentence
    const contextSentence = keyword.context[Math.floor(Math.random() * keyword.context.length)]

    // Generate question text
    const questionText = generateQuestionForKeyword(keyword.word, contextSentence)

    if (!questionText) continue

    // Generate options (1 correct + 3 distractors)
    const correctAnswer = keyword.word
    const distractors = generateDistractors(keyword.word, keywords, 3)

    // Skip if we couldn't generate enough distractors
    if (distractors.length < 3) continue

    // Create options array with correct answer in random position
    const options = [...distractors]
    const correctIndex = Math.floor(Math.random() * 4)
    options.splice(correctIndex, 0, correctAnswer)

    // Calculate difficulty based on keyword importance and position
    const keywordIndex = keywords.findIndex((k) => k.word === keyword.word)
    const normalizedIndex = keywordIndex / keywords.length
    const difficulty = minDifficulty + normalizedIndex * (maxDifficulty - minDifficulty)

    // Create question object
    questions.push({
      id: generateId("q_mc_"),
      type: "multiple-choice",
      question: questionText,
      answer: correctAnswer,
      options,
      difficulty,
      relatedKeywords: [keyword.word],
      sourceSection: section.id,
      context: contextSentence,
    })
  }

  return questions
}

/**
 * Generates fill-in-blank questions
 */
function generateFillInBlankQuestions(
  section: DocumentSection,
  keywords: Keyword[],
  count: number,
  difficultyRange: [number, number],
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []
  const [minDifficulty, maxDifficulty] = difficultyRange

  // Use top keywords for questions
  const keywordsToUse = keywords.slice(0, Math.min(count * 2, keywords.length))

  for (const keyword of keywordsToUse) {
    if (questions.length >= count) break

    // Skip keywords with no context
    if (keyword.context.length === 0) continue

    // Choose a random context sentence
    const contextSentence = keyword.context[Math.floor(Math.random() * keyword.context.length)]

    // Create fill-in-blank by replacing the keyword with a blank
    const regex = new RegExp(`\\b${keyword.word}\\b`, "i")
    const questionText = contextSentence.replace(regex, "________")

    // Skip if the replacement didn't work (keyword not found in exact form)
    if (questionText === contextSentence) continue

    // Calculate difficulty based on keyword importance and position
    const keywordIndex = keywords.findIndex((k) => k.word === keyword.word)
    const normalizedIndex = keywordIndex / keywords.length
    const difficulty = minDifficulty + normalizedIndex * (maxDifficulty - minDifficulty)

    // Create question object
    questions.push({
      id: generateId("q_fb_"),
      type: "fill-in-blank",
      question: questionText,
      answer: keyword.word,
      difficulty,
      relatedKeywords: [keyword.word],
      sourceSection: section.id,
      context: contextSentence,
    })
  }

  return questions
}

/**
 * Generates true/false questions
 */
function generateTrueFalseQuestions(
  section: DocumentSection,
  keywords: Keyword[],
  count: number,
  difficultyRange: [number, number],
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []
  const [minDifficulty, maxDifficulty] = difficultyRange

  // Use top keywords for questions
  const keywordsToUse = keywords.slice(0, Math.min(count * 2, keywords.length))

  for (const keyword of keywordsToUse) {
    if (questions.length >= count) break

    // Skip keywords with no context
    if (keyword.context.length === 0) continue

    // Choose a random context sentence
    const contextSentence = keyword.context[Math.floor(Math.random() * keyword.context.length)]

    // Decide if this will be a true or false statement
    const isTrue = Math.random() > 0.5

    let questionText: string
    let answer: string

    if (isTrue) {
      // Use the original sentence as a true statement
      questionText = contextSentence
      answer = "True"
    } else {
      // Create a false statement by replacing the keyword with a distractor
      const distractors = generateDistractors(keyword.word, keywords, 1)

      // Skip if we couldn't generate a distractor
      if (distractors.length === 0) continue

      const distractor = distractors[0]
      const regex = new RegExp(`\\b${keyword.word}\\b`, "i")
      questionText = contextSentence.replace(regex, distractor)

      // Skip if the replacement didn't work
      if (questionText === contextSentence) continue

      answer = "False"
    }

    // Calculate difficulty based on keyword importance and position
    const keywordIndex = keywords.findIndex((k) => k.word === keyword.word)
    const normalizedIndex = keywordIndex / keywords.length
    const difficulty = minDifficulty + normalizedIndex * (maxDifficulty - minDifficulty)

    // Create question object
    questions.push({
      id: generateId("q_tf_"),
      type: "true-false",
      question: questionText,
      answer,
      difficulty,
      explanation: isTrue
        ? `This statement is correct as it appears in the original text.`
        : `This statement is false. The correct version should use "${keyword.word}" instead of the incorrect term.`,
      relatedKeywords: [keyword.word],
      sourceSection: section.id,
      context: contextSentence,
    })
  }

  return questions
}

/**
 * Generates short answer questions
 */
function generateShortAnswerQuestions(
  section: DocumentSection,
  keywords: Keyword[],
  count: number,
  difficultyRange: [number, number],
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []
  const [minDifficulty, maxDifficulty] = difficultyRange

  // Use top keywords for questions
  const keywordsToUse = keywords.slice(0, Math.min(count * 2, keywords.length))

  for (const keyword of keywordsToUse) {
    if (questions.length >= count) break

    // Skip keywords with no context
    if (keyword.context.length === 0) continue

    // Choose a random context sentence
    const contextSentence = keyword.context[Math.floor(Math.random() * keyword.context.length)]

    // Generate question text
    const questionText = generateQuestionForKeyword(keyword.word, contextSentence)

    if (!questionText) continue

    // Calculate difficulty based on keyword importance and position
    const keywordIndex = keywords.findIndex((k) => k.word === keyword.word)
    const normalizedIndex = keywordIndex / keywords.length
    const difficulty = minDifficulty + normalizedIndex * (maxDifficulty - minDifficulty)

    // Create question object
    questions.push({
      id: generateId("q_sa_"),
      type: "short-answer",
      question: questionText,
      answer: keyword.word,
      difficulty,
      relatedKeywords: [keyword.word],
      sourceSection: section.id,
      context: contextSentence,
    })
  }

  return questions
}

/**
 * Generates a question for a specific keyword and context
 */
function generateQuestionForKeyword(keyword: string, context: string): string | null {
  // Simple templates for questions
  const templates = [
    `What is the term for ${getDefinitionFromContext(keyword, context)}?`,
    `Which concept refers to ${getDefinitionFromContext(keyword, context)}?`,
    `What do we call ${getDefinitionFromContext(keyword, context)}?`,
    `Identify the term that means ${getDefinitionFromContext(keyword, context)}.`,
    `What is ${getDefinitionFromContext(keyword, context)} called?`,
  ]

  // Choose a random template
  const template = templates[Math.floor(Math.random() * templates.length)]

  // If we couldn't extract a definition, return null
  if (template.includes("undefined") || template.includes("null")) {
    return null
  }

  return template
}

/**
 * Extracts a definition-like phrase for a keyword from context
 */
function getDefinitionFromContext(keyword: string, context: string): string {
  // Remove the keyword from the context to create a definition
  const regex = new RegExp(`\\b${keyword}\\b`, "i")
  const withoutKeyword = context.replace(regex, "").trim()

  // Clean up the definition
  return withoutKeyword
    .replace(/^[,.:;]/, "") // Remove leading punctuation
    .replace(/[,.:;]$/, "") // Remove trailing punctuation
    .trim()
}

/**
 * Generates distractor options for multiple choice questions
 */
function generateDistractors(correctAnswer: string, keywords: Keyword[], count: number): string[] {
  // Filter out the correct answer
  const otherKeywords = keywords.filter((k) => k.word !== correctAnswer).map((k) => k.word)

  // If not enough keywords, return what we have
  if (otherKeywords.length < count) {
    return otherKeywords
  }

  // Try to find similar keywords first
  const similarityScores = otherKeywords.map((word) => ({
    word,
    similarity: calculateStringSimilarity(word, correctAnswer),
  }))

  // Sort by similarity (most similar first)
  similarityScores.sort((a, b) => b.similarity - a.similarity)

  // Take a mix of similar and random keywords
  const similar = similarityScores
    .filter((item) => item.similarity > 0.3)
    .slice(0, Math.ceil(count / 2))
    .map((item) => item.word)

  // Fill the rest with random keywords
  const remaining = count - similar.length
  const random = shuffleArray(otherKeywords.filter((word) => !similar.includes(word))).slice(0, remaining)

  return [...similar, ...random]
}

/**
 * Mock implementation of AI-based question generation
 * This will be replaced with actual AI API calls later
 */
export function generateAIQuestions(document: Document, options: QuestionGenerationOptions): GeneratedQuestion[] {
  // For now, use the rule-based generator
  // This will be replaced with AI API calls when available
  return generateQuestions(document, options)
}

