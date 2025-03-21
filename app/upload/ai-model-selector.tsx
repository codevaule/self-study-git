"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// 지원되는 AI 모델 정의
const AI_MODELS = {
  sample: { name: "샘플 컨텐츠", provider: "local", isPaid: false },
  "gpt-3.5-turbo": { name: "GPT-3.5 Turbo", provider: "openai", isPaid: true },
  "gpt-4o": { name: "GPT-4o", provider: "openai", isPaid: true },
  "gemini-pro": { name: "Google Gemini Pro", provider: "google", isPaid: false },
  "claude-instant": { name: "Claude Instant", provider: "anthropic", isPaid: true },
  "llama-2": { name: "Llama 2", provider: "meta", isPaid: false },
}

interface AIModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
  apiKey: string
  onApiKeyChange: (apiKey: string) => void
}

export default function AIModelSelector({
  selectedModel,
  onModelChange,
  apiKey,
  onApiKeyChange,
}: AIModelSelectorProps) {
  const [showApiKey, setShowApiKey] = useState(false)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ai-model" className="text-sm flex items-center gap-1">
          AI 모델 선택
          <span className="text-xs text-muted-foreground ml-1">(유료 모델은 API 키 필요)</span>
        </Label>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="AI 모델 선택" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(AI_MODELS).map(([id, model]) => (
              <SelectItem key={id} value={id}>
                {model.name} {model.isPaid ? "(유료)" : "(무료)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {AI_MODELS[selectedModel]?.isPaid && (
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-sm flex items-center justify-between">
            <span>API 키 (유료 모델)</span>
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-xs text-primary hover:underline"
            >
              {showApiKey ? "숨기기" : "보기"}
            </button>
          </Label>
          <Input
            id="api-key"
            type={showApiKey ? "text" : "password"}
            placeholder="API 키를 입력하세요"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">
            API 키가 없으면 샘플 컨텐츠가 생성됩니다. API 키는 안전하게 저장되지 않으니 주의하세요.
          </p>
        </div>
      )}
    </div>
  )
}

