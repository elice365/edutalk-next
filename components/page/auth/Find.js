import { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/styles/auth";
import Header from "@/components/ui/auth/Header";
import Input from "@/components/ui/auth/Input";
import Button from "@/components/ui/auth/Button";
import AuthNavigate from "@/components/ui/auth/Navigate";
import Alert from "@/components/ui/auth/Alert";

export default function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState(null); // API 응답 상태

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResponse(null);

    // API 요청 보내기
    try {
      const res = await fetch("/api/auth/find-password", { // API 엔드포인트 경로
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        // API에서 에러를 반환한 경우
        setResponse({ error: data.error || "오류가 발생했습니다." });
      } else {
        // 성공적으로 처리된 경우
        setResponse({ success: true, message: data.message });
      }
    } catch (error) {
      // 네트워크 에러 등
      setResponse({ error: `비밀번호 찾기 요청에 실패했습니다: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={auth.container}
    >
      <Header
        icon={<svg className={auth.header.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
        title="비밀번호 찾기"
        subtitle="가입하신 이메일 주소를 입력해주세요"
      />

      {!response?.success ? (
        <form onSubmit={handleSubmit} className={auth.form.container}>
          <Input
            label="이메일"
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="가입하신 이메일을 입력하세요"
          />

          {response?.error && (
            <Alert type="error" message={response.error} />
          )}

          <Button type="submit" disabled={isLoading} isLoading={isLoading}>
            비밀번호 재설정 링크 받기
          </Button>

          <Alert 
            type="info" 
            title="이메일 확인이 필요합니다"
            message="비밀번호 재설정 링크를 이메일로 발송해드립니다. 스팸 메일함도 확인해주세요."
          />
        </form>
      ) : (
        <Alert type="success" title="이메일을 확인해주세요">
          <p className={auth.alert.success.text}>
            {response.message}
          </p>
          <p className={auth.alert.info.text}>
            이메일이 도착하지 않았다면 스팸 메일함을 확인해주세요.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-600 mb-2">
              다른 방법으로 도움이 필요하신가요?
            </p>
            <button
              onClick={() => window.location.reload()}
              className={auth.link.primary}
            >
              다시 시도하기
            </button>
          </div>
        </Alert>
      )}

      <AuthNavigate
        text="계정이 기억나셨나요?"
        linkText="로그인"
        link="/auth/login"
      />
    </motion.div>
  );
}
