'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { route } from '@/styles/route';
import { slideInLeft, float, bounceGentle } from '@/utils/animationVariants';
import { heroFeatures } from '@/constants/main';
import { ChartBarIcon, ChatIcon, VideoIcon } from '@/components/ui/icons';

const HeroSection = () => {
  return (
    <section 
      className={route.hero.container}
      aria-labelledby="hero-heading"
    >
      {/* Enhanced Background Elements */}
      <div className={route.hero.sectionWrap}>
        <motion.div 
          className={route.hero.section1}
          style={{ willChange: 'transform' }}
          animate={float.animate}
        />
        <motion.div 
          className={route.hero.section2}
          style={{ willChange: 'transform' }}
          animate={{
            y: [0, -6, 0],
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
              repeatType: "reverse"
            }
          }}
        />
        <motion.div 
          className={route.hero.section3}
          animate={bounceGentle.animate}
        />
      </div>
      
      <div className={route.hero.content.wrap}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Status Badge */}
          <motion.div 
            className={route.hero.content.badge}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span 
              className={route.hero.content.text}
              animate={bounceGentle.animate}
            />
            새로운 교육 혁신이 시작됩니다
          </motion.div>
          
          {/* Main Heading */}
          <h1 
            id="hero-heading"
            className={route.hero.main.title}
          >
            <motion.span 
              className={route.hero.main.gradiant}
              initial={slideInLeft.initial}
              animate={slideInLeft.animate}
              transition={slideInLeft.transition}
            >
              스마트한 교육
            </motion.span>
            <motion.span 
              className={route.hero.main.sub}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              새로운 연결
            </motion.span>
          </h1>
          
          {/* Subtitle */}
          <motion.p 
            className={route.hero.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <span className="block sm:inline">AI 기반 학습 분석과 실시간 소통으로</span>
            <br className="hidden sm:block"/>
            <strong className="text-neutral-800 block sm:inline mt-2 sm:mt-0">강사와 학생 모두가 성장하는 교육 플랫폼</strong>
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className={route.hero.cta.button}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <motion.a
              href="/auth/register"
              className={route.hero.cta.register.section}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              <span className={route.hero.cta.register.span}></span>
              <span className={route.hero.cta.register.text}>
                EduTalk에 가입하기 
                <motion.svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.a>
            <motion.a
              href="#demo"
              className={route.hero.cta.demo.section}
              whileHover={{ 
                scale: 1.05,
                y: -2
              }}
              transition={{ duration: 0.3 }}
            >
              <span className={route.hero.cta.demo.span}></span>
              <span className={route.hero.cta.demo.text}>
                데모 보기
                <motion.svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
        
        {/* Enhanced Hero Feature Cards */}
        <motion.div 
          className={route.hero.feature.wrap}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
        >
          <div className={route.hero.feature.inner}>
            <div className={route.hero.feature.grid}>
              {heroFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className={route.hero.feature.card.section}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  <div className={route.hero.feature.card.background}></div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`${route.hero.feature.card.icon} ${feature.bgColor}`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 6
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.iconName === 'ChartBarIcon' && <ChartBarIcon className={feature.iconClass} />}
                      {feature.iconName === 'ChatIcon' && <ChatIcon className={feature.iconClass} />}
                      {feature.iconName === 'VideoIcon' && <VideoIcon className={feature.iconClass} />}
                    </motion.div>
                    
                    <h3 className={route.hero.feature.card.title}>
                      {feature.title}
                    </h3>
                    
                    <p className={route.hero.feature.card.description}>
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Animated indicator */}
                  <motion.div 
                    className={route.hero.feature.card.indicator}
                    animate={{
                      y: [-1, 1, -1],
                      transition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Additional Visual Elements */}
            <div className={route.hero.visualWrap}>
              <motion.div 
                className={route.hero.visual1}
                animate={float.animate}
              />
              <motion.div 
                className={route.hero.visual2}
                animate={{
                  y: [0, -8, 0],
                  transition: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }
                }}
              />
              <motion.div 
                className={route.hero.visual3}
                animate={bounceGentle.animate}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
