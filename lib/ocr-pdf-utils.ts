import { createWorker } from "tesseract.js"
import type { Worker } from "tesseract.js"
import { dispatchOcrProgressEvent } from "./ocr-events"

// Language settings (Korean + English)
const DEFAULT_LANGUAGE = "kor+eng"

// OCR worker instance
let ocrWorker: Worker | null = null

/**
 * Initialize OCR worker
 * @returns Initialized Tesseract worker
 */
export const initOcrWorker = async (language = DEFAULT_LANGUAGE): Promise<Worker> => {
  if (ocrWorker) return ocrWorker

  try {
    // Load worker with specified language
    const worker = await createWorker(language)
    ocrWorker = worker
    console.log("OCR worker successfully initialized")
    return worker
  } catch (error) {
    console.error("OCR worker initialization failed:", error)
    throw new Error("Failed to initialize OCR engine")
  }
}

/**
 * Terminate OCR worker
 */
export const terminateOcrWorker = async (): Promise<void> => {
  if (ocrWorker) {
    await ocrWorker.terminate()
    ocrWorker = null
    console.log("OCR worker terminated")
  }
}

/**
 * Convert PDF page to image
 * @param pdfBytes PDF file as ArrayBuffer
 * @param pageNum Page number to convert
 * @returns ImageData object
 */
const convertPdfPageToImage = async (pdfBytes: ArrayBuffer, pageNum: number): Promise<ImageData> => {
  try {
    // Load PDF.js dynamically
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf")
    const pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.entry")

    // Set worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes })
    const pdf = await loadingTask.promise

    // Get page
    const page = await pdf.getPage(pageNum)

    // Set viewport (high resolution for better OCR)
    const scale = 2.0
    const viewport = page.getViewport({ scale })

    // Create canvas
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Cannot create canvas context")

    canvas.width = viewport.width
    canvas.height = viewport.height

    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }

    await page.render(renderContext).promise

    // Return image data
    return context.getImageData(0, 0, canvas.width, canvas.height)
  } catch (error) {
    console.error("Failed to convert PDF page to image:", error)
    throw error
  }
}

/**
 * Extract text from image using OCR
 * @param imageData Image data to process
 * @returns Extracted text
 */
const extractTextFromImage = async (imageData: ImageData): Promise<string> => {
  try {
    if (!ocrWorker) {
      await initOcrWorker()
    }

    if (!ocrWorker) {
      throw new Error("OCR worker not initialized")
    }

    // Draw image data to canvas
    const canvas = document.createElement("canvas")
    canvas.width = imageData.width
    canvas.height = imageData.height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Cannot create canvas context")

    ctx.putImageData(imageData, 0, 0)

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/png")
    })

    // Perform OCR
    const result = await ocrWorker.recognize(blob)
    return result.data.text
  } catch (error) {
    console.error("Failed to extract text from image:", error)
    throw error
  }
}

/**
 * Try to extract text layer from PDF
 * @param pdfBytes PDF file as ArrayBuffer
 * @returns Extracted text
 */
const extractTextLayerFromPdf = async (pdfBytes: ArrayBuffer): Promise<string> => {
  try {
    // Load PDF.js dynamically
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf")
    const pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.entry")

    // Set worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

    // Load PDF document with CMap support for Korean
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBytes,
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/cmaps/",
      cMapPacked: true,
    })

    const pdf = await loadingTask.promise
    const numPages = pdf.numPages
    let fullText = ""

    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
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
    }

    return fullText
  } catch (error) {
    console.error("Failed to extract text layer from PDF:", error)
    throw error
  }
}

/**
 * Check if PDF has a text layer
 * @param pdfBytes PDF file as ArrayBuffer
 * @returns true if PDF has a text layer
 */
const hasPdfTextLayer = async (pdfBytes: ArrayBuffer): Promise<boolean> => {
  try {
    const text = await extractTextLayerFromPdf(pdfBytes)
    // Check if there's meaningful text (at least 10 characters)
    return text.trim().length > 10
  } catch (error) {
    return false
  }
}

/**
 * Check if text contains Korean characters
 * @param text Text to check
 * @returns true if text contains Korean characters
 */
const hasKoreanText = (text: string): boolean => {
  const koreanRegex = /[\uAC00-\uD7A3]/
  return koreanRegex.test(text)
}

/**
 * Extract text from PDF file with OCR support
 * @param file PDF file
 * @returns Extracted text
 */
export const extractTextFromPdfWithOcr = async (file: File): Promise<string> => {
  let maxPages = 10 // Default max pages to process

  try {
    // Convert file to ArrayBuffer
    const pdfBytes = await readFileAsArrayBuffer(file)

    // First try to extract text layer
    let extractedText = ""
    let hasTextLayer = false

    try {
      hasTextLayer = await hasPdfTextLayer(pdfBytes)
      if (hasTextLayer) {
        extractedText = await extractTextLayerFromPdf(pdfBytes)

        // Check if text contains Korean
        if (hasKoreanText(extractedText)) {
          console.log("Successfully extracted Korean text from PDF text layer")
          return extractedText
        }
      }
    } catch (error) {
      console.warn("Failed to extract text layer, trying OCR:", error)
    }

    // If text layer doesn't exist or doesn't contain Korean, try OCR
    console.log("Trying to extract text using OCR...")

    // Initialize OCR worker
    await initOcrWorker()

    // Load PDF document to get page count
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf")
    const pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.entry")
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes })
    const pdf = await loadingTask.promise
    const numPages = pdf.numPages
    maxPages = Math.min(numPages, 10)

    dispatchOcrProgressEvent({
      page: 0,
      pages: maxPages,
      status: "Initializing OCR...",
    })

    // Process each page with OCR
    let ocrText = ""

    for (let i = 1; i <= maxPages; i++) {
      try {
        dispatchOcrProgressEvent({
          page: i,
          pages: maxPages,
          status: `Processing page ${i}/${maxPages} with OCR...`,
        })

        // Convert page to image
        const imageData = await convertPdfPageToImage(pdfBytes, i)

        // Extract text from image
        const pageText = await extractTextFromImage(imageData)

        ocrText += pageText + "\n\n"
      } catch (pageError) {
        console.warn(`Failed to process page ${i} with OCR:`, pageError)
      }
    }

    // If OCR extracted text, return it
    if (ocrText.trim().length > 0) {
      console.log("Successfully extracted text using OCR")
      return ocrText
    }

    // If all methods failed but we have some text from text layer, return it
    if (extractedText.trim().length > 0) {
      return extractedText
    }

    throw new Error("Could not extract text from PDF")
  } catch (error) {
    console.error("Failed to extract text from PDF:", error)
    throw error
  } finally {
    // Terminate OCR worker
    await terminateOcrWorker()
    dispatchOcrProgressEvent({
      page: maxPages,
      pages: maxPages,
      status: "OCR processing complete",
    })
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

