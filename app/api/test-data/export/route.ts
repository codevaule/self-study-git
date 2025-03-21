// app/api/test-data/export/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const testData = await prisma.testData.findMany()

    // Convert the data to CSV format
    const csvData = convertToCSV(testData)

    // Set the response headers
    const headers = {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="test_data.csv"',
    }

    // Return the CSV data as a response
    return new NextResponse(csvData, { headers })
  } catch (error) {
    console.error("Error exporting test data:", error)
    return NextResponse.json({ error: "Failed to export test data" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return ""
  }

  const headers = Object.keys(data[0])
  const csvRows = []

  csvRows.push(headers.join(","))

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
    })
    csvRows.push(values.join(","))
  }

  return csvRows.join("\n")
}

