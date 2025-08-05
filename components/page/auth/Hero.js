import { auth } from '@/styles/auth.js';
import { authFeatures } from '@/constants/auth';

const AuthHeroSide = () => {
  return (
    <div className={auth.layout.brandingSide}>
      <div className={auth.branding.container}>
        {/* Logo  로고 */}
        <div className={auth.branding.logoSection}>
          <div className={auth.branding.logoIcon}>
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h1 className={auth.branding.title}>EduTalk</h1>
            <p className={auth.branding.subtitle}>Education Platform</p>
          </div>
        </div>
        
        {/* Main Message */}
        <div className={auth.branding.messageSection} style={{animationDelay: '0.2s'}}>
          <h2 className={auth.branding.mainHeading}>
            교육 소통의 새로운 <br/>
            <span className={auth.branding.accent}>시작점이 되세요</span>
          </h2>
          <p className={auth.branding.description}>
            교육 기관과 학생 간의 실시간 채팅으로 <br/>
            더 효과적인 교육 커뮤니케이션을 지원합니다
          </p>
        </div>
        
        {/* Feature Highlights */}
        <div className={auth.branding.feature.container} style={{animationDelay: '0.4s'}}>
          {authFeatures.map((feature, index) => (
            <div key={index} className={auth.branding.feature.card}>
              <div className={auth.branding.feature.icon}>
                {feature.icon}
              </div>
              <div className={auth.branding.feature.content}>
                <h3 className={auth.branding.feature.title}>{feature.title}</h3>
                <p className={auth.branding.feature.description}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthHeroSide;
