import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "자주 묻는 질문 | Study Helper",
  description: "Study Helper 서비스에 대한 자주 묻는 질문과 답변입니다.",
}

// FAQ 데이터
const faqItems = [
  {
    question: "Study Helper는 어떤 서비스인가요?",
    answer:
      "Study Helper는 PDF 문서를 업로드하고 AI를 활용하여 학습 자료를 생성하는 서비스입니다. OCR 기술을 통해 이미지 기반 PDF도 처리할 수 있으며, 문서 내용을 기반으로 퀴즈, 요약, 마인드맵 등을 생성하여 효율적인 학습을 돕습니다.",
  },
  {
    question: "무료로 이용할 수 있나요?",
    answer:
      "기본적인 기능은 무료로 이용할 수 있습니다. 하지만 고급 기능(대용량 PDF 처리, 고급 AI 모델 사용, 더 많은 문서 저장 등)을 이용하기 위해서는 유료 구독이 필요합니다. 자세한 내용은 요금제 페이지를 참고해주세요.",
  },
  {
    question: "어떤 형식의 파일을 업로드할 수 있나요?",
    answer:
      "현재는 PDF 파일만 지원하고 있습니다. PDF 내에 텍스트가 포함되어 있거나 이미지 기반 PDF도 OCR 기술을 통해 처리 가능합니다. 향후 다양한 파일 형식(DOCX, PPT 등)도 지원할 예정입니다.",
  },
  {
    question: "생성된 학습 자료는 어떻게 저장되나요?",
    answer:
      "생성된 모든 학습 자료는 사용자 계정에 안전하게 저장됩니다. 언제든지 접근하여 학습하거나 다운로드할 수 있습니다. 또한 공유 기능을 통해 다른 사용자와 학습 자료를 공유할 수도 있습니다.",
  },
  {
    question: "개인정보는 안전하게 보호되나요?",
    answer:
      "네, 사용자의 개인정보와 업로드된 문서는 암호화되어 안전하게 저장됩니다. 우리는 사용자의 개인정보 보호를 최우선으로 생각하며, 관련 법규를 준수합니다. 자세한 내용은 개인정보 처리방침을 참고해주세요.",
  },
  {
    question: "문서 업로드 용량 제한이 있나요?",
    answer:
      "무료 계정의 경우 문서당 최대 10MB, 월 총 50MB까지 업로드 가능합니다. 유료 구독 시 더 큰 용량의 문서를 처리할 수 있으며, 월 업로드 제한도 증가합니다.",
  },
  {
    question: "생성된 퀴즈의 정확도는 어떤가요?",
    answer:
      "AI가 생성한 퀴즈는 업로드된 문서 내용을 기반으로 하며, 대체로 높은 정확도를 보입니다. 하지만 100% 완벽하지 않을 수 있으므로, 중요한 시험 준비 등에는 추가 검증을 권장합니다. 사용자 피드백을 통해 지속적으로 정확도를 개선하고 있습니다.",
  },
  {
    question: "구독을 취소하면 저장된 데이터는 어떻게 되나요?",
    answer:
      "구독 취소 후에도 기존에 생성한 학습 자료는 30일간 계속 접근 가능합니다. 30일 이후에는 무료 계정 제한에 따라 일부 데이터만 유지됩니다. 필요한 자료는 구독 취소 전에 다운로드하시는 것을 권장합니다.",
  },
  {
    question: "여러 기기에서 이용할 수 있나요?",
    answer:
      "네, Study Helper는 웹 기반 서비스로 계정 로그인을 통해 PC, 태블릿, 스마트폰 등 다양한 기기에서 이용 가능합니다. 모든 기기에서 동일한 학습 자료에 접근할 수 있습니다.",
  },
  {
    question: "오프라인에서도 이용할 수 있나요?",
    answer:
      "현재는 온라인 환경에서만 서비스 이용이 가능합니다. 하지만 생성된 학습 자료는 PDF, 텍스트 파일 등으로 다운로드하여 오프라인에서도 활용할 수 있습니다. 향후 오프라인 모드를 지원하는 모바일 앱 출시를 계획 중입니다.",
  },
]

export default function FAQPage() {
  return (
    <div className="container py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">자주 묻는 질문</h1>
        <p className="text-muted-foreground">Study Helper 서비스에 대한 궁금증을 해결해 드립니다.</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-base font-medium">{item.question}</AccordionTrigger>
            <AccordionContent className="text-base">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4">더 궁금한 점이 있으신가요?</h2>
        <p className="text-base mb-4">문의사항이 있으시면 언제든지 고객센터로 연락해 주세요.</p>
        <a href="mailto:support@studyhelper.com" className="text-primary font-medium hover:underline">
          support@studyhelper.com
        </a>
      </div>
    </div>
  )
}

