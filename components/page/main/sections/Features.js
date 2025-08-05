'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { route } from '@/styles/route';
import { heartbeat } from '@/utils/animationVariants';
import { features } from '@/constants/main';
import { ChatIcon, SpeakerIcon, ChartBarIcon, VideoIcon, DocumentIcon, ShieldIcon } from '@/components/ui/icons';

const FeaturesSection = () => {
  return (
    <section id="features" className={route.features.section}>
      <div className={route.features.container}>
        <motion.div 
          className={route.features.header.group}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={route.features.header.title}>
            교육의 <span className={route.features.header.highlight}>혁신적인 기능</span>
          </h2>
          <p className={route.features.header.description}>
            최첨단 기술과 교육 전문성이 결합된 완벽한 학습 생태계
          </p>
        </motion.div>
        
        <div className={route.features.grid}>
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className={route.features.card.group}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className={`${route.features.card.inner} ${feature.bgColor}`}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                  borderColor: "rgb(147, 197, 253)"
                }}
                transition={{ duration: 0.5 }}
              >
                <div className={route.features.card.background}></div>
                <motion.div 
                  className={route.features.card.icon}
                  whileHover={{ ...heartbeat.animate }}
                >
                  {feature.iconName === 'ChatIcon' && <ChatIcon className={feature.iconClass} />}
                  {feature.iconName === 'SpeakerIcon' && <SpeakerIcon className={feature.iconClass} />}
                  {feature.iconName === 'ChartBarIcon' && <ChartBarIcon className={feature.iconClass} />}
                  {feature.iconName === 'VideoIcon' && <VideoIcon className={feature.iconClass} />}
                  {feature.iconName === 'DocumentIcon' && <DocumentIcon className={feature.iconClass} />}
                  {feature.iconName === 'ShieldIcon' && <ShieldIcon className={feature.iconClass} />}
                </motion.div>
                <h3 className={route.features.card.title}>
                  {feature.title}
                </h3>
                <p className={route.features.card.description}>
                  {feature.description}
                </p>
                <motion.div 
                  className={route.features.card.indicator}
                  animate={{
                    y: [-2, 2, -2],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
