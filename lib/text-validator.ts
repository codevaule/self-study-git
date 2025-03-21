/**
 * Utility functions to validate extracted text
 */

// PDF binary structure patterns
const PDF_BINARY_PATTERNS = [
  /^%PDF-\d\.\d/, // PDF header
  /obj<</, // PDF object
  /\/Type\/Page/, // Page type
  /\/Contents \d+ \d+ R/, // Contents reference
  /\/MediaBox \[\d+ \d+ \d+ \d+\]/, // Media box
  /endobj/, // End object
  /xref/, // Cross-reference table
  /trailer/, // Trailer
  /startxref/, // Start reference
]

// Meaningful text patterns (Korean, English, numbers, etc.)
const MEANINGFUL_TEXT_PATTERNS = [
  /[가-힣]{3,}/, // Korean 3+ characters
  /[A-Za-z]{5,}/, // English 5+ characters
  /[A-Za-z]{3,}\s[A-Za-z]{3,}/, // English 2+ words
  /\d{1,}[A-Za-z가-힣]{2,}/, // Number + text combination
  /[A-Za-z가-힣]{2,}\d{1,}/, // Text + number combination
]

/**
 * Validate extracted text
 * @param text Text to validate
 * @param fileName File name (for logging)
 * @returns Validation result
 */
export const validateExtractedText = (text: string, fileName: string): { isValid: boolean; warning?: string } => {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      warning: "No text extracted. Try another extraction method.",
    }
  }

  // Text sample (first 500 characters)
  const textSample = text.substring(0, 500)

  // Check for PDF binary structure patterns
  const hasPdfBinaryPatterns = PDF_BINARY_PATTERNS.some((pattern) => pattern.test(textSample))

  // Check for meaningful text patterns
  const hasMeaningfulText = MEANINGFUL_TEXT_PATTERNS.some((pattern) => pattern.test(text))

  // Count Korean characters
  const koreanCharCount = countKoreanCharacters(text)
  const hasKoreanInFilename = containsKoreanInFilename(fileName)

  // Validation logic
  if (hasPdfBinaryPatterns && !hasMeaningfulText) {
    return {
      isValid: false,
      warning:
        "PDF internal structure was extracted as text. This is not the actual content. Try another extraction method.",
    }
  }

  if (hasKoreanInFilename && koreanCharCount < 10 && text.length > 100) {
    return {
      isValid: false,
      warning: "Korean filename detected but almost no Korean text was extracted. Korean characters may be corrupted.",
    }
  }

  if (text.length > 100 && !hasMeaningfulText) {
    return {
      isValid: false,
      warning: "Extracted text doesn't seem to contain meaningful content. Try another extraction method.",
    }
  }

  // Check special character ratio
  const specialCharRatio = calculateSpecialCharRatio(text)
  if (specialCharRatio > 0.3) {
    // More than 30% special characters
    return {
      isValid: false,
      warning: "Too many special characters in extracted text. Text may be corrupted.",
    }
  }

  return { isValid: true }
}

/**
 * Count Korean characters
 * @param text Text to count Korean characters in
 * @returns Number of Korean characters
 */
const countKoreanCharacters = (text: string): number => {
  let count = 0
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code >= 0xac00 && code <= 0xd7a3) {
      count++
    }
  }
  return count
}

/**
 * Check if filename contains Korean
 * @param filename Filename to check
 * @returns true if filename contains Korean
 */
const containsKoreanInFilename = (filename: string): boolean => {
  const koreanRegex = /[\uAC00-\uD7A3]/
  return koreanRegex.test(filename)
}

/**
 * Calculate special character ratio
 * @param text Text to calculate ratio for
 * @returns Ratio of special characters
 */
const calculateSpecialCharRatio = (text: string): number => {
  if (!text || text.length === 0) return 0

  // Normal text characters (Korean, English, numbers, spaces, common punctuation)
  const normalChars = /[가-힣A-Za-z0-9\s.,;:!?'"()[\]{}]/

  let specialCharCount = 0
  for (let i = 0; i < text.length; i++) {
    if (!normalChars.test(text[i])) {
      specialCharCount++
    }
  }

  return specialCharCount / text.length
}

