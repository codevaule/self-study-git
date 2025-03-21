import { initOcrWorker, terminateOcrWorker } from "../lib/ocr-pdf-utils"

// Mock tesseract.js
jest.mock("tesseract.js", () => ({
  createWorker: jest.fn().mockImplementation(() =>
    Promise.resolve({
      terminate: jest.fn().mockResolvedValue(undefined),
      recognize: jest.fn().mockResolvedValue({
        data: {
          text: "Sample OCR text",
        },
      }),
    }),
  ),
}))

describe("OCR PDF Utils", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("initOcrWorker initializes worker correctly", async () => {
    const worker = await initOcrWorker()
    expect(worker).toBeDefined()
    expect(worker.recognize).toBeDefined()
    expect(worker.terminate).toBeDefined()
  })

  test("terminateOcrWorker terminates worker correctly", async () => {
    const worker = await initOcrWorker()
    await terminateOcrWorker()
    // Second call should not throw error
    await terminateOcrWorker()
  })
})

