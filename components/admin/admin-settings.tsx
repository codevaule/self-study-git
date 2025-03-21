"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Settings {
  siteName: string
  siteDescription: string
  contactEmail: string
  maintenanceMode: boolean
  allowRegistration: boolean
  maxUploadSize: number
  aiModelSettings: {
    defaultModel: string
    temperature: number
    maxTokens: number
    systemPrompt: string
  }
  paymentSettings: {
    currency: string
    taxRate: number
    bankTransferEnabled: boolean
    bankAccount: string
    bankName: string
  }
}

export function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "스터디 헬퍼",
    siteDescription: "효율적인 학습을 위한 AI 기반 스터디 도우미",
    contactEmail: "contact@studyhelper.com",
    maintenanceMode: false,
    allowRegistration: true,
    maxUploadSize: 10,
    aiModelSettings: {
      defaultModel: "gpt-4",
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: "당신은 학습을 돕는 AI 어시스턴트입니다. 학생들의 질문에 명확하고 교육적인 방식으로 답변해주세요.",
    },
    paymentSettings: {
      currency: "KRW",
      taxRate: 10,
      bankTransferEnabled: true,
      bankAccount: "123-456-789012",
      bankName: "신한은행",
    },
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof Settings],
        [field]: value,
      },
    }))
  }

  const saveSettings = async () => {
    try {
      setLoading(true)

      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 실제 구현에서는 아래와 같이 API 호출
      // const response = await fetch('/api/admin/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })

      // if (!response.ok) throw new Error('설정 저장에 실패했습니다.')

      toast({
        title: "설정 저장 완료",
        description: "관리자 설정이 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("설정 저장 오류:", error)
      toast({
        title: "설정 저장 실패",
        description: "설정을 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="general">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">일반</TabsTrigger>
        <TabsTrigger value="ai">AI 설정</TabsTrigger>
        <TabsTrigger value="payment">결제 설정</TabsTrigger>
        <TabsTrigger value="advanced">고급 설정</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>일반 설정</CardTitle>
            <CardDescription>사이트의 기본 정보와 설정을 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">사이트 이름</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">사이트 설명</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleChange("siteDescription", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">연락처 이메일</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
              />
              <Label htmlFor="maintenanceMode">유지보수 모드</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allowRegistration"
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => handleChange("allowRegistration", checked)}
              />
              <Label htmlFor="allowRegistration">회원가입 허용</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings} disabled={loading}>
              {loading ? "저장 중..." : "설정 저장"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="ai">
        <Card>
          <CardHeader>
            <CardTitle>AI 설정</CardTitle>
            <CardDescription>AI 모델 및 생성 설정을 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultModel">기본 AI 모델</Label>
              <Input
                id="defaultModel"
                value={settings.aiModelSettings.defaultModel}
                onChange={(e) => handleNestedChange("aiModelSettings", "defaultModel", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (0.0 ~ 1.0)</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={settings.aiModelSettings.temperature}
                onChange={(e) =>
                  handleNestedChange("aiModelSettings", "temperature", Number.parseFloat(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTokens">최대 토큰 수</Label>
              <Input
                id="maxTokens"
                type="number"
                min="100"
                max="4000"
                step="100"
                value={settings.aiModelSettings.maxTokens}
                onChange={(e) => handleNestedChange("aiModelSettings", "maxTokens", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">시스템 프롬프트</Label>
              <Textarea
                id="systemPrompt"
                rows={4}
                value={settings.aiModelSettings.systemPrompt}
                onChange={(e) => handleNestedChange("aiModelSettings", "systemPrompt", e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings} disabled={loading}>
              {loading ? "저장 중..." : "설정 저장"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="payment">
        <Card>
          <CardHeader>
            <CardTitle>결제 설정</CardTitle>
            <CardDescription>결제 관련 설정을 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">통화</Label>
              <Input
                id="currency"
                value={settings.paymentSettings.currency}
                onChange={(e) => handleNestedChange("paymentSettings", "currency", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">세율 (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                value={settings.paymentSettings.taxRate}
                onChange={(e) => handleNestedChange("paymentSettings", "taxRate", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="bankTransferEnabled"
                checked={settings.paymentSettings.bankTransferEnabled}
                onCheckedChange={(checked) => handleNestedChange("paymentSettings", "bankTransferEnabled", checked)}
              />
              <Label htmlFor="bankTransferEnabled">계좌이체 활성화</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">은행명</Label>
              <Input
                id="bankName"
                value={settings.paymentSettings.bankName}
                onChange={(e) => handleNestedChange("paymentSettings", "bankName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccount">계좌번호</Label>
              <Input
                id="bankAccount"
                value={settings.paymentSettings.bankAccount}
                onChange={(e) => handleNestedChange("paymentSettings", "bankAccount", e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings} disabled={loading}>
              {loading ? "저장 중..." : "설정 저장"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>고급 설정</CardTitle>
            <CardDescription>고급 시스템 설정을 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxUploadSize">최대 업로드 크기 (MB)</Label>
              <Input
                id="maxUploadSize"
                type="number"
                min="1"
                max="100"
                value={settings.maxUploadSize}
                onChange={(e) => handleChange("maxUploadSize", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>데이터베이스 관리</Label>
              <div className="flex space-x-2">
                <Button variant="outline">백업 생성</Button>
                <Button variant="outline">캐시 비우기</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>시스템 로그</Label>
              <Button variant="outline" className="w-full">
                로그 보기
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings} disabled={loading}>
              {loading ? "저장 중..." : "설정 저장"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

