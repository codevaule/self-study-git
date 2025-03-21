import { Metadata } from "next"

export const metadata: Metadata = {
  title: "서비스 이용약관 | Study Helper",
  description: "Study Helper 서비스의 이용약관입니다.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">서비스 이용약관</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          본 약관은 Study Helper가 운영하는 Study Helper 웹사이트(이하 "서비스"라 함)를 이용함에 있어 
          이용자와 Study Helper 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">제1조 (정의)</h2>
        <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
        <ol className="list-decimal pl-8 my-4">
          <li>"서비스"라 함은 Study Helper가 제공하는 모든 서비스를 의미합니다.</li>
          <li>"이용자"라 함은 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
          <li>"회원"이라 함은 서비스에 회원등록을 한 자로서, 계속적으로 서비스를 이용할 수 있는 자를 말합니다.</li>
          <li>"콘텐츠"라 함은 서비스 내에서 제공되는 모든 형태의 정보나 자료를 의미합니다.</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">제2조 (약관의 효력 및 변경)</h2>
        <ol className="list-decimal pl-8 my-4">
          <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
          <li>Study Helper는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
          <li>이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다. 변경된 약관이 공지된 후에도 계속해서 서비스를 이용하는 경우에는 약관 변경에 동의한 것으로 간주됩니다.</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">제3조 (서비스의 제공 및 변경)</h2>
        <ol className="list-decimal pl-8 my-4">
          <li>Study Helper는 다음과 같은 서비스를 제공합니다:
            <ul className="list-disc pl-8 my-2">
              <li>학습 자료 생성 및 관리 서비스</li>
              <li>퀴즈 및 문제 생성 서비스</li>
              <li>OCR 기능을 통한 PDF 파일 분석 서비스</li>
              <li>기타 Study Helper가 추가 개발하거나 다른 회사와의 제휴를 통해 제공하는 서비스</li>
            </ul>
          </li>
          <li>Study Helper는 기술적 사양의 변경 등의 이유로 서비스의 내용을 변경할 수 있으며, 변경 사항은 사전에 공지합니다.</li>
          <li>Study Helper는 무료로 제공되는 서비스의 일부 또는 전부를 회사의 정책에 따라 유료로 전환할 수 있습니다.</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">제4조 (회원가입 및 계정관리)</h2>
        <ol className="list-decimal pl-8 my-4">
          <li>이용자는 Study Helper가 정한 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
          <li>Study Helper는 전항에 따른 회원가입 신청자가 다음 각 호에 해당하는 경우에는 회원가입을 거절할 수 있습니다:
            <ul className="list-disc pl-8 my-2">
              <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
              <li>허위의 정보를 기재하거나, 필수 정보를 누락한 경우</li>
              <li>만 14세 미만인 경우</li>
              <li>이전에 이용약관 위반 등의 사유로 회원 자격이 제한된 적이 있는 경우</li>
            </ul>
          </li>
          <li>회원은 자신의 계정정보를 안전하게 관리할 책임이 있으며, 타인에게 자신의 계정정보를 제공하거나 대여, 양도해서는 안 됩니다.</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">제5조 (개인정보 보호)</h2>
        <p>
          Study Helper는 이용자의 개인정보를 적극적으로 보호하며, 이용자의 개인정보 보호에 관한 사항은 관련법령 및 
          Study Helper가 별도로 정한 '개인정보 처리방침'에 따릅니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">제6조 (이용자의 의무)</h2>
        <ol className="list-decimal pl-8 my-4">
          <li>이용자는 다음 행위를 해서는 안 됩니다:
            <ul className="list-disc pl-8 my-2">
              <li>타인의 계정 및 개인정보를 도용하는 행위</li>
              <li>서비스 내용을 무단으로 복제, 전송, 배포하는 행위</li>
              <li>서비스를 이용하여 불법적인 콘텐츠를 게시하는 행위</li>
              <li>서비스의 안정적인 운영을 방해하는 행위</li>
              <li>기타 관련 법령에 위배되는 행위</li>
            </ul>
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">제7조 (서비스 이용제한)</h2>
        <p>
          Study Helper는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 
          서비스 이용을 제한하거나 회원 자격을 정지, 탈퇴시킬 수 있습니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">제8조 (책임제한)</h2>
        <ol className="list-decimal pl-8 my-4">
          <li>Study Helper는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.</li>
          <li>Study Helper는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
          <li>Study Helper는 이용자가 서비스를 통해 얻은 정보나 자료의 신뢰도, 정확성 등에 대하여 보증을 하지 않으며, 이로 인해 발생한 손해에 대하여 책임을 지지 않습니다.</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">제9조 (분쟁해결)</h2>
        <p>
          본 약관에 명시되지 않은 사항은 관련 법령 및 Study Helper가 정한 서비스 운영정책에 따르며, 
          서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 민사소송법상의 관할법원에 제기합니다.
        </p>

        <div className="bg-gray-100 p-4 rounded-md my-8">
          <p>부칙</p>
          <p>본 약관은 2023년 1월 1일부터 적용됩니다.</p>
        </div>
      </div>
    </div>
  )
} 