import { Metadata } from "next"

export const metadata: Metadata = {
  title: "개인정보 처리방침 | Study Helper",
  description: "Study Helper 서비스의 개인정보 처리방침입니다.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">개인정보 처리방침</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          Study Helper('https://study-helper.example.com'이하 'Study Helper')은(는) 개인정보보호법에 따라 
          이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 
          다음과 같은 처리방침을 두고 있습니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. 개인정보의 처리 목적</h2>
        <p>
          Study Helper는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 
          이용하지 않습니다.
        </p>
        <ul className="list-disc pl-8 my-4">
          <li>회원 가입 및 관리</li>
          <li>서비스 제공 및 콘텐츠 활용</li>
          <li>학습 데이터 분석 및 맞춤형 학습 콘텐츠 제공</li>
          <li>마케팅 및 광고에의 활용</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. 개인정보의 처리 및 보유 기간</h2>
        <p>
          ① Study Helper는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시에 
          동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </p>
        <p>
          ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
        </p>
        <ul className="list-disc pl-8 my-4">
          <li>회원 가입 및 관리: 회원 탈퇴 시까지</li>
          <li>결제 정보: 관련 법령에 따라 5년간 보관</li>
          <li>학습 데이터: 서비스 이용 기간 및 회원 탈퇴 후 30일까지</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. 개인정보의 제3자 제공</h2>
        <p>
          Study Helper는 원칙적으로 이용자의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서 
          처리하며, 이용자의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. 개인정보처리 위탁</h2>
        <p>
          ① Study Helper는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
        </p>
        <ul className="list-disc pl-8 my-4">
          <li>결제 처리: 결제 대행사</li>
          <li>서버 호스팅: 클라우드 서비스 제공업체</li>
          <li>이메일 발송: 이메일 서비스 제공업체</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. 정보주체와 법정대리인의 권리·의무 및 행사방법</h2>
        <p>
          정보주체는 Study Helper에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. 개인정보의 파기</h2>
        <p>
          Study Helper는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
          지체없이 해당 개인정보를 파기합니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. 개인정보 보호책임자</h2>
        <p>
          Study Helper는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 
          불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <div className="bg-gray-100 p-4 rounded-md my-4">
          <p>개인정보 보호책임자</p>
          <p>이름: 홍길동</p>
          <p>직책: 개인정보보호 담당자</p>
          <p>연락처: privacy@study-helper.example.com</p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. 개인정보 처리방침 변경</h2>
        <p>
          이 개인정보 처리방침은 2023년 1월 1일부터 적용됩니다. 이 방침은 법령 및 방침에 따라 변경될 수 있으며, 
          변경 시 웹사이트를 통하여 공지할 것입니다.
        </p>
      </div>
    </div>
  )
} 