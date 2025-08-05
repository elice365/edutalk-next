import Header from "@/components/layout/header/Main";
import { ChatProvider } from "@/components/provider/Chat";
import { AuthProvider } from "@/components/provider/Auth";


export const metadata = () => {
  return {
    title: "EduTalk - 강사와 학생을 연결하는 혁신적인 교육 플랫폼",
    description: "실시간 소통과 AI 기반 학습 관리로 교육의 새로운 패러다임을 경험하세요",
    keywords: "온라인 교육, 강사, 학생, 실시간 채팅, 교육 플랫폼, 학습 관리",
  };
};  
export default function MainLayout({ children }) {
  return (
    <AuthProvider>
      <ChatProvider>
        <Header />
        {children}
      </ChatProvider>
    </AuthProvider>
  );
}
