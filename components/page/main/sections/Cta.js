'use client';

import { motion } from 'framer-motion';
import { route } from '@/styles/route';

const CtaSection = () => {
  return (
    <section className={route.cta.section}>
      <div className={route.cta.wrapper}>
        <motion.div 
          className={route.cta.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={route.cta.title}>
            교육의 미래를 <br className="sm:hidden"/>
            <span className={route.cta.highlight}>지금 시작하세요</span>
          </h2>
          <p className={route.cta.description}>
            EduTalk의 회원이 되어 모든 기능을 경험해보세요
          </p>
          <div className={route.cta.button.wrap}>
            <motion.a
              href="/auth/register"
              className={route.cta.button.register}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              EduTalk에 가입하기
            </motion.a>
            <motion.a
              href="/auth/login"
              className={route.cta.button.login}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              이미 계정이 있나요?
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
