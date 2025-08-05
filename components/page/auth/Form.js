import { auth } from '@/styles/auth';

const AuthFormSide = ({ children }) => {
  return (
    <div className={auth.layout.formSide}>
      <div className={auth.layout.formWrapper}>
        {children}
      </div>
    </div>
  );
};

export default AuthFormSide;
