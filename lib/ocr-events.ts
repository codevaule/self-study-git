/**
 * OCR progress event interface
 */
export interface OcrProgressEvent {
  page: number
  pages: number
  status: string
}

/**
 * Dispatch OCR progress event
 * @param detail Event details
 */
export const dispatchOcrProgressEvent = (detail: OcrProgressEvent): void => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("ocr-progress", { detail })
    window.dispatchEvent(event)
  }
}

/**
 * Add OCR progress event listener
 * @param callback Callback function
 * @returns Function to remove listener
 */
export const addOcrProgressListener = (callback: (event: OcrProgressEvent) => void): (() => void) => {
  if (typeof window !== "undefined") {
    const listener = ((e: CustomEvent) => {
      callback(e.detail as OcrProgressEvent)
    }) as EventListener

    window.addEventListener("ocr-progress", listener)
    return () => window.removeEventListener("ocr-progress", listener)
  }
  return () => {}
}

