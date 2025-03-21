import type { Metadata } from "next"
import BankTransferClientPage from "./BankTransferClientPage"

export const metadata: Metadata = {
  title: "계좌이체 결제 | Study Helper",
  description: "계좌이체를 통한 결제 방법을 안내합니다.",
}

export default function BankTransferPage() {
  return <BankTransferClientPage />
}

