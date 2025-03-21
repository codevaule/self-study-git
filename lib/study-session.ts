// This is a simple in-memory storage for study sessions
// In a real application, you would use a database

const sessions: Record<string, any> = {}

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Truncate content to avoid localStorage quota issues
const truncateContent = (content: string, maxLength = 10000) => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + "... (content truncated for storage)"
}

// Clean up old sessions if we're approaching storage limits
const cleanupOldSessions = () => {
  if (typeof window === "undefined") return

  try {
    const storedSessions = localStorage.getItem("studySessions")
    if (!storedSessions) return

    const parsedSessions = JSON.parse(storedSessions)
    const sessionIds = Object.keys(parsedSessions)

    // If we have more than 10 sessions, remove the oldest ones
    if (sessionIds.length > 10) {
      // Sort sessions by timestamp (oldest first)
      const sortedIds = sessionIds.sort((a, b) => {
        const timestampA = new Date(parsedSessions[a].timestamp).getTime()
        const timestampB = new Date(parsedSessions[b].timestamp).getTime()
        return timestampA - timestampB
      })

      // Remove the oldest sessions, keeping the 10 most recent
      const idsToRemove = sortedIds.slice(0, sortedIds.length - 10)
      idsToRemove.forEach((id) => {
        delete parsedSessions[id]
      })

      localStorage.setItem("studySessions", JSON.stringify(parsedSessions))
    }
  } catch (error) {
    console.error("Failed to clean up old sessions:", error)
  }
}

// Create a new study session
export const createStudySession = async (sessionData: any) => {
  const id = generateId()

  // Truncate content to avoid localStorage quota issues
  const truncatedContent = truncateContent(sessionData.content)

  // Initialize study plan if provided
  let studyPlan = sessionData.studyPlan
  if (studyPlan) {
    studyPlan = {
      ...studyPlan,
      currentDay: 1,
      startDate: new Date().toISOString(),
      completedToday: 0,
      carryOver: 0,
    }
  }

  const session = {
    id,
    ...sessionData,
    content: truncatedContent, // Store truncated content
    originalContentLength: sessionData.content.length, // Keep track of original length
    questionHistory: {},
    studyPlan, // Add study plan if provided
  }

  // Store in localStorage if available (browser environment)
  if (typeof window !== "undefined") {
    try {
      // Clean up old sessions first
      cleanupOldSessions()

      // Get existing sessions
      const storedSessions = localStorage.getItem("studySessions")
      const existingSessions = storedSessions ? JSON.parse(storedSessions) : {}

      // Add new session
      existingSessions[id] = session

      try {
        // 한글 인코딩 문제를 방지하기 위해 JSON.stringify 사용 시 null 및 undefined 처리
        const safeStringify = (obj: any) => {
          return JSON.stringify(obj, (key, value) => {
            // null이나 undefined 값은 빈 문자열로 대체
            if (value === null || value === undefined) {
              return ""
            }
            return value
          })
        }

        localStorage.setItem("studySessions", safeStringify(existingSessions))
      } catch (storageError) {
        // 할당량 제한에 도달한 경우 더 적극적인 정리 수행
        console.warn("저장소 할당량 문제 감지, 적극적인 정리 수행 중")

        // 가장 최근 3개 세션을 제외한 모든 세션 제거
        const sessionIds = Object.keys(existingSessions)
        if (sessionIds.length > 3) {
          const sortedIds = sessionIds.sort((a, b) => {
            const timestampA = new Date(existingSessions[a].timestamp).getTime()
            const timestampB = new Date(existingSessions[b].timestamp).getTime()
            return timestampA - timestampB
          })

          const idsToRemove = sortedIds.slice(0, sortedIds.length - 3)
          idsToRemove.forEach((id) => {
            delete existingSessions[id]
          })

          // 더 적은 세션으로 다시 저장 시도
          try {
            localStorage.setItem("studySessions", safeStringify(existingSessions))
          } catch (finalError) {
            // 여전히 실패하는 경우 현재 세션 콘텐츠를 더 줄임
            session.content = truncateContent(session.content, 5000)
            existingSessions[id] = session
            localStorage.setItem("studySessions", safeStringify(existingSessions))
          }
        }
      }
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
      // Continue with in-memory storage even if localStorage fails
    }
  }

  // Also store in memory
  sessions[id] = session

  return id
}

// Get a study session by ID
export const getStudySession = async (id: string) => {
  // Try to get from localStorage first (browser environment)
  if (typeof window !== "undefined") {
    try {
      const storedSessions = localStorage.getItem("studySessions")
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions)
        if (parsedSessions[id]) {
          return parsedSessions[id]
        }
      }
    } catch (error) {
      console.error("Failed to read from localStorage:", error)
    }
  }

  // Fall back to memory
  return sessions[id] || null
}

// Update a study session
export const updateStudySession = async (id: string, sessionData: any) => {
  // Ensure we don't increase the content size when updating
  if (sessionData.content && typeof sessionData.content === "string") {
    sessionData.content = truncateContent(sessionData.content)
  }

  // Update in localStorage if available (browser environment)
  if (typeof window !== "undefined") {
    try {
      const storedSessions = localStorage.getItem("studySessions")
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions)
        parsedSessions[id] = sessionData

        try {
          const safeStringify = (obj: any) => {
            return JSON.stringify(obj, (key, value) => {
              // null이나 undefined 값은 빈 문자열로 대체
              if (value === null || value === undefined) {
                return ""
              }
              return value
            })
          }
          localStorage.setItem("studySessions", safeStringify(parsedSessions))
        } catch (storageError) {
          // If quota exceeded, remove content from all sessions except current one
          console.warn("Storage quota issue on update, removing content from old sessions")

          Object.keys(parsedSessions).forEach((sessionId) => {
            if (sessionId !== id) {
              // Keep minimal info but remove content
              if (parsedSessions[sessionId].content) {
                parsedSessions[sessionId].content = "Content removed to save space"
              }
            }
          })

          const safeStringify = (obj: any) => {
            return JSON.stringify(obj, (key, value) => {
              // null이나 undefined 값은 빈 문자열로 대체
              if (value === null || value === undefined) {
                return ""
              }
              return value
            })
          }
          localStorage.setItem("studySessions", safeStringify(parsedSessions))
        }
      }
    } catch (error) {
      console.error("Failed to update in localStorage:", error)
    }
  }

  // Also update in memory
  sessions[id] = sessionData

  return id
}

// Get all study sessions
export const getAllStudySessions = async () => {
  // Try to get from localStorage first (browser environment)
  if (typeof window !== "undefined") {
    try {
      const storedSessions = localStorage.getItem("studySessions")
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions)
        return Object.values(parsedSessions)
      }
    } catch (error) {
      console.error("Failed to read from localStorage:", error)
    }
  }

  // Fall back to memory
  return Object.values(sessions)
}

// Delete a study session
export const deleteStudySession = async (id: string) => {
  // Delete from localStorage if available (browser environment)
  if (typeof window !== "undefined") {
    try {
      const storedSessions = localStorage.getItem("studySessions")
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions)
        delete parsedSessions[id]
        localStorage.setItem("studySessions", JSON.stringify(parsedSessions))
      }
    } catch (error) {
      console.error("Failed to delete from localStorage:", error)
    }
  }

  // Also delete from memory
  delete sessions[id]

  return true
}

// Update study plan progress
export const updateStudyPlanProgress = async (id: string, completedQuestions: number) => {
  try {
    const session = await getStudySession(id)
    if (!session || !session.studyPlan) return false

    const plan = session.studyPlan

    // Update completed questions for today
    plan.completedToday += completedQuestions

    // Check if daily goal is met
    const dailyGoal = plan.questionsPerDay + plan.carryOver

    // If we've completed all questions for today
    if (plan.completedToday >= dailyGoal) {
      // Move to next day
      plan.currentDay += 1
      // Reset carry over (no questions carried over)
      plan.carryOver = 0
      // Reset completed today
      plan.completedToday = 0
    } else {
      // Calculate questions to carry over
      plan.carryOver = dailyGoal - plan.completedToday
    }

    // Update session with new plan
    await updateStudySession(id, {
      ...session,
      studyPlan: plan,
    })

    return true
  } catch (error) {
    console.error("Failed to update study plan progress:", error)
    return false
  }
}

// Get today's question count (including carry over)
export const getTodayQuestionCount = async (id: string) => {
  try {
    const session = await getStudySession(id)
    if (!session || !session.studyPlan) return null

    const plan = session.studyPlan
    return {
      questionsPerDay: plan.questionsPerDay,
      carryOver: plan.carryOver,
      total: plan.questionsPerDay + plan.carryOver,
      completed: plan.completedToday,
      remaining: plan.questionsPerDay + plan.carryOver - plan.completedToday,
    }
  } catch (error) {
    console.error("Failed to get today's question count:", error)
    return null
  }
}

