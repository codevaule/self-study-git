import { extractTextFromPdfFallback } from "./fallback-pdf-extractor"

// PDF.js library loading status
let pdfJsLoaded = false
let pdfJsLib: any = null

/**
 * Load PDF.js library
 * @returns true if library was loaded successfully
 */
export const loadPdfLibrary = async (): Promise<boolean> => {
  // Return if already loaded
  if (pdfJsLoaded && pdfJsLib) {
    return true
  }

  // Check if we're in browser environment
  if (typeof window === "undefined") {
    console.warn("PDF library can only be loaded in browser environment")
    return false
  }

  try {
    // Check if PDF.js is already in global scope
    if ((window as any).pdfjsLib) {
      pdfJsLib = (window as any).pdfjsLib
      pdfJsLoaded = true
      return true
    }

    // Dynamically load PDF.js script
    await loadPdfJsScript()

    // Get PDF.js from global scope
    pdfJsLib = (window as any).pdfjsLib

    if (!pdfJsLib) {
      throw new Error("Could not find PDF.js library")
    }

    // Set worker
    if (pdfJsLib.GlobalWorkerOptions) {
      const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`
      pdfJsLib.GlobalWorkerOptions.workerSrc = workerSrc
    }

    pdfJsLoaded = true
    console.log("PDF library loaded successfully")
    return true
  } catch (error) {
    console.error("Failed to load PDF library:", error)
    pdfJsLoaded = false
    pdfJsLib = null
    return false
  }
}

/**
 * Load PDF.js script
 * @returns Promise that resolves when script is loaded
 */
const loadPdfJsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="pdf.min.js"]')) {
      resolve()
      return
    }

    // Create script element
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
    script.async = true

    script.onload = () => {
      console.log("PDF.js script loaded")
      resolve()
    }

    script.onerror = (error) => {
      console.error("Failed to load PDF.js script:", error)
      reject(new Error("Could not load PDF.js script"))
    }

    // Add script to document
    document.head.appendChild(script)
  })
}

/**
 * Extract text from PDF
 * @param file PDF file
 * @returns Extracted text
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // First try to load PDF.js library
    const loaded = await loadPdfLibrary()

    if (!loaded || !pdfJsLib) {
      console.warn("Failed to load PDF.js library, using fallback extractor")
      return await extractTextFromPdfFallback(file)
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await readFileAsArrayBuffer(file)

    // Load PDF document
    const loadingTask = pdfJsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/cmaps/",
      cMapPacked: true,
    })

    const pdf = await loadingTask.promise
    const numPages = pdf.numPages
    let fullText = ""

    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false,
        })

        let lastY = null
        let pageText = ""

        for (const item of textContent.items) {
          const textItem = item as any
          if (lastY !== null && Math.abs(textItem.transform[5] - lastY) > 1) {
            pageText += "\n"
          }
          pageText += textItem.str
          lastY = textItem.transform[5]
        }

        fullText += pageText + "\n\n"
      } catch (pageError) {
        console.warn(`Failed to extract text from page ${i}:`, pageError)
      }
    }

    if (fullText.trim().length > 0) {
      return fullText
    }

    // If PDF.js extraction failed, try fallback
    console.warn("PDF.js text extraction failed, using fallback extractor")
    return await extractTextFromPdfFallback(file)
  } catch (error) {
    console.error("Failed to extract text from PDF:", error)

    // Try fallback extractor on error
    try {
      console.warn("Using fallback extractor due to error")
      return await extractTextFromPdfFallback(file)
    } catch (fallbackError) {
      console.error("Fallback extractor also failed:", fallbackError)
      throw new Error("All PDF text extraction methods failed")
    }
  }
}

/**
 * Read file as ArrayBuffer
 * @param file File to read
 * @returns ArrayBuffer
 */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(e.target.result)
      } else {
        reject(new Error("Failed to convert file to ArrayBuffer"))
      }
    }
    reader.onerror = (e) => {
      reject(new Error("File reading error: " + e))
    }
    reader.readAsArrayBuffer(file)
  })
}

