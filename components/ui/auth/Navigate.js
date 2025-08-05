import Link from 'next/link';
import { auth } from '@/styles/auth';

const AuthNavigate = ({ text, link, linkText }) => {
  return (
    <div className={auth.navigation.container}>
      <div className={auth.navigation.textContainer}>
        {text}{" "}
        <Link href={link} className={auth.link.primary}>
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default AuthNavigate;
