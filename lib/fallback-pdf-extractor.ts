/**
 * Fallback PDF text extraction method (used when PDF.js fails)
 */

/**
 * Extract text from PDF using fallback method
 * @param file PDF file
 * @returns Extracted text
 */
export const extractTextFromPdfFallback = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Could not read file")
        }

        // Convert binary data to string
        const binary = event.target.result as ArrayBuffer
        const data = new Uint8Array(binary)

        // Check if it's a valid PDF (starts with %PDF-)
        const isPdf =
          data.length > 5 &&
          data[0] === 0x25 && // %
          data[1] === 0x50 && // P
          data[2] === 0x44 && // D
          data[3] === 0x46 && // F
          data[4] === 0x2d // -

        if (!isPdf) {
          throw new Error("Not a valid PDF file")
        }

        // Try different encoding methods
        const results = [
          extractTextWithEncoding(data, "utf-8"),
          extractTextWithEncoding(data, "utf-16"),
          extractTextWithEncoding(data, "euc-kr"),
          extractKoreanTextBlocks(data),
        ]

        // Choose the result with the most Korean characters
        let bestResult = ""
        let maxKoreanCount = 0

        for (const result of results) {
          const koreanCount = countKoreanCharacters(result)
          if (koreanCount > maxKoreanCount) {
            maxKoreanCount = koreanCount
            bestResult = result
          }
        }

        // Add warning if extracted text is too short
        if (bestResult.length < 100) {
          bestResult += "\n\n[Warning: Could not extract enough text from PDF. Try another method.]"
        }

        resolve(bestResult)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Try to extract text with different encodings
 * @param data PDF data as Uint8Array
 * @param encoding Encoding to use
 * @returns Extracted text
 */
const extractTextWithEncoding = (data: Uint8Array, encoding: string): string => {
  try {
    // Try to find text objects
    let text = ""
    let inTextObject = false
    let textBuffer = ""

    for (let i = 0; i < data.length - 2; i++) {
      // Look for BT (Begin Text) objects
      if (data[i] === 0x42 && data[i + 1] === 0x54) {
        inTextObject = true
        i += 2
        continue
      }

      // Look for ET (End Text) objects
      if (data[i] === 0x45 && data[i + 1] === 0x54) {
        inTextObject = false
        text += textBuffer + "\n"
        textBuffer = ""
        i += 2
        continue
      }

      // Extract text from text objects
      if (inTextObject) {
        // Only extract readable ASCII characters
        if (data[i] >= 32 && data[i] <= 126) {
          textBuffer += String.fromCharCode(data[i])
        }
      }
    }

    // Try encoding-based extraction
    if (encoding === "utf-16") {
      // Handle UTF-16
      const utf16Text = extractUtf16Text(data)
      if (utf16Text.length > text.length) {
        text = utf16Text
      }
    } else if (encoding === "euc-kr") {
      // Handle EUC-KR (limited in browser)
      const eucKrText = attemptEucKrExtraction(data)
      if (eucKrText.length > text.length) {
        text = eucKrText
      }
    }

    return text
  } catch (error) {
    console.warn(`Failed to extract text with ${encoding} encoding:`, error)
    return ""
  }
}

/**
 * Extract UTF-16 text
 * @param data PDF data as Uint8Array
 * @returns Extracted text
 */
const extractUtf16Text = (data: Uint8Array): string => {
  let text = ""

  // Look for UTF-16BE BOM (FEFF)
  for (let i = 0; i < data.length - 4; i++) {
    if (data[i] === 0xfe && data[i + 1] === 0xff) {
      // Found UTF-16BE
      for (let j = i + 2; j < data.length - 1; j += 2) {
        const charCode = (data[j] << 8) | data[j + 1]
        if (charCode >= 32 && charCode <= 65535) {
          text += String.fromCharCode(charCode)
        }
      }
      break
    } else if (data[i] === 0xff && data[i + 1] === 0xfe) {
      // Found UTF-16LE
      for (let j = i + 2; j < data.length - 1; j += 2) {
        const charCode = (data[j + 1] << 8) | data[j]
        if (charCode >= 32 && charCode <= 65535) {
          text += String.fromCharCode(charCode)
        }
      }
      break
    }
  }

  return text
}

/**
 * Try to extract EUC-KR text (limited in browser)
 * @param data PDF data as Uint8Array
 * @returns Extracted text
 */
const attemptEucKrExtraction = (data: Uint8Array): string => {
  // EUC-KR decoding is limited in browser
  // In a real implementation, this would need server-side processing or a more complex library
  return ""
}

/**
 * Extract Korean text blocks
 * @param data PDF data as Uint8Array
 * @returns Extracted text
 */
const extractKoreanTextBlocks = (data: Uint8Array): string => {
  const koreanBlocks = []

  // Korean Unicode range (AC00-D7A3)
  for (let i = 0; i < data.length - 1; i++) {
    // Detect UTF-8 Korean (3-byte sequence)
    if (
      i + 2 < data.length &&
      data[i] >= 0xe0 &&
      data[i] <= 0xef &&
      data[i + 1] >= 0x80 &&
      data[i + 1] <= 0xbf &&
      data[i + 2] >= 0x80 &&
      data[i + 2] <= 0xbf
    ) {
      let koreanBlock = ""
      let j = i

      while (
        j + 2 < data.length &&
        data[j] >= 0xe0 &&
        data[j] <= 0xef &&
        data[j + 1] >= 0x80 &&
        data[j + 1] <= 0xbf &&
        data[j + 2] >= 0x80 &&
        data[j + 2] <= 0xbf
      ) {
        // Decode UTF-8 3-byte character
        const codePoint = ((data[j] & 0x0f) << 12) | ((data[j + 1] & 0x3f) << 6) | (data[j + 2] & 0x3f)

        // Check if it's in Korean Unicode range
        if (codePoint >= 0xac00 && codePoint <= 0xd7a3) {
          koreanBlock += String.fromCharCode(codePoint)
        }

        j += 3
      }

      if (koreanBlock.length > 0) {
        koreanBlocks.push(koreanBlock)
      }

      i = j - 1
    }
  }

  return koreanBlocks.join(" ")
}

/**
 * Count Korean characters in text
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

