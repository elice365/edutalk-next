import nodemailer from 'nodemailer';
// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'email-smtp.ap-southeast-2.amazonaws.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export async function sendEmail(options) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: options.from || process.env.SMTP_FROM || 'noreply@edutalk.com',
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export async function sendVerificationEmail(email, token) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/verify?email=${encodeURIComponent(email)}&token=${token}`;
  
  const subject = '[Edutalk] 이메일 인증을 완료해 주세요';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ff6b35; margin: 0;">Edutalk</h1>
      </div>
      
      <h2 style="color: #333; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">이메일 인증</h2>
      
      <p style="line-height: 1.6;">안녕하세요,</p>
      
      <p style="line-height: 1.6;">
        Edutalk에 가입해 주셔서 감사합니다. 
        회원가입을 완료하려면 아래 버튼을 클릭하여 이메일 주소를 인증해 주세요.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" 
           style="display: inline-block; background-color: #ff6b35; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          이메일 인증하기
        </a>
      </div>
      
      <p style="line-height: 1.6; font-size: 14px; color: #666;">
        또는 아래 링크를 브라우저에 복사하여 붙여넣으세요:<br>
        <a href="${url}" style="color: #ff6b35; word-break: break-all;">${url}</a>
      </p>
      
      <div style="background-color: #f8f9fa; border-left: 4px solid #ff6b35; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          <strong>중요:</strong> 이 링크는 24시간 후에 만료됩니다. 
          만료된 경우 다시 회원가입을 진행해 주세요.
        </p>
      </div>
      
      <p style="line-height: 1.6; font-size: 14px; color: #666;">
        만약 이 이메일을 요청하지 않으셨다면 무시하셔도 됩니다.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        질문이나 문제가 있으시면 언제든지 문의해 주세요.<br>
        <strong>Edutalk는 절대 사용자의 비밀번호나 개인정보를 묻는 이메일을 보내지 않습니다.</strong>
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; margin: 0;">
          이 메시지는 Edutalk에서 발송되었습니다.
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendPasswordResetEmail(email, token) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/auth/reset?email=${encodeURIComponent(email)}&token=${token}`;
  
  const subject = '[Edutalk] 비밀번호 재설정 요청';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ff6b35; margin: 0;">Edutalk</h1>
      </div>
      
      <h2 style="color: #333; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">비밀번호 재설정</h2>
      
      <p style="line-height: 1.6;">안녕하세요,</p>
      
      <p style="line-height: 1.6;">
        귀하의 Edutalk 계정에 대한 비밀번호 재설정이 요청되었습니다.
        비밀번호를 재설정하려면 아래 버튼을 클릭하세요.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" 
           style="display: inline-block; background-color: #ff6b35; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          비밀번호 재설정
        </a>
      </div>
      
      <p style="line-height: 1.6; font-size: 14px; color: #666;">
        또는 아래 링크를 브라우저에 복사하여 붙여넣으세요:<br>
        <a href="${url}" style="color: #ff6b35; word-break: break-all;">${url}</a>
      </p>
      
      <div style="background-color: #f8f9fa; border-left: 4px solid #ff6b35; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          <strong>중요:</strong> 이 링크는 1시간 후에 만료됩니다.
          비밀번호 재설정을 요청하지 않으셨다면 이 이메일을 무시하셔도 됩니다.
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        보안 알림: 이 비밀번호 재설정은 ${new Date().toLocaleString('ko-KR')}에 요청되었습니다.<br>
        본인이 요청하지 않았다면 계정이 무단 접근되었을 수 있으니 즉시 지원팀에 문의하세요.
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; margin: 0;">
          이 메시지는 Edutalk에서 발송되었습니다.
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendWelcomeEmail(email, name) {
  const subject = '[Edutalk] 환영합니다! 가입이 완료되었습니다';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ff6b35; margin: 0;">Edutalk</h1>
      </div>
      
      <h2 style="color: #333; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">환영합니다!</h2>
      
      <p style="line-height: 1.6;">안녕하세요 ${name}님,</p>
      
      <p style="line-height: 1.6;">
        Edutalk 가입이 성공적으로 완료되었습니다!
        이제 모든 서비스를 이용하실 수 있습니다.
      </p>
      
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #ff6b35; margin-top: 0;">시작하기</h3>
        <ul style="line-height: 1.8;">
          <li>채팅방에서 실시간 대화를 시작하세요</li>
          <li>공지사항을 확인하여 최신 소식을 받아보세요</li>
          <li>프로필을 설정하여 나만의 공간을 만드세요</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/login" 
           style="display: inline-block; background-color: #ff6b35; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          지금 시작하기
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        도움이 필요하시면 언제든지 문의해 주세요.<br>
        Edutalk 팀 드림
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; margin: 0;">
          이 메시지는 Edutalk에서 발송되었습니다.
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}