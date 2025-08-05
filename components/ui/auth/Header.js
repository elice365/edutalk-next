import { auth } from '@/styles/auth';

const AuthHeader = ({ icon, title, subtitle }) => {
  return (
    <div className={auth.header.register.container}>
      <div className={auth.header.register.iconContainer}>
        {icon}
      </div>
      <h2 className={auth.header.register.title}>{title}</h2>
      <p className={auth.header.register.subtitle}>
        {subtitle}
      </p>
    </div>
  );
};

export default AuthHeader;
