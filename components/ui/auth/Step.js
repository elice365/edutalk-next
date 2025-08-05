'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { auth } from '@/styles/auth';
import AuthInput from './Input';
import Checkbox from './Checkbox';

// 회원 가입 단계를 표시하는 컴포넌트

export const Step1 = ({ formData, handleInputChange, focusedField, setFocusedField }) => (
  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }} className={auth.register.fieldGroup}>
    <AuthInput
      id="identy"
      name="identy"
      placeholder="계약사명/기관명"
      value={formData.identy}
      onChange={handleInputChange}
      onFocus={() => setFocusedField('identy')}
      onBlur={() => setFocusedField('')}
      focused={focusedField === 'identy'}
      icon={<svg className={auth.input.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
      required
    />
    <AuthInput
      id="email"
      name="email"
      type="email"
      placeholder="이메일 주소"
      value={formData.email}
      onChange={handleInputChange}
      onFocus={() => setFocusedField('email')}
      onBlur={() => setFocusedField('')}
      focused={focusedField === 'email'}
      icon={<svg className={auth.input.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
      required
    />
  </motion.div>
);

export const Step2 = ({ formData, handleInputChange, focusedField, setFocusedField, getPasswordStrength }) => (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="space-y-6">
        <AuthInput
            id="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'password'}
            isPassword={true}
            strength={getPasswordStrength(formData.password)}
            icon={<svg className={auth.input.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            required
        />
        <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'confirmPassword'}
            isPassword={true}
            error={formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? "비밀번호가 일치하지 않습니다" : null}
            icon={<svg className={auth.input.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            required
        />
    </motion.div>
);

export const Step3 = ({ formData, handleInputChange }) => (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="space-y-6">
        <div>
            <h3 className={auth.header.title}>이용약관 및 개인정보처리방침</h3>
            <div className="space-y-4">
                <Checkbox
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    label="이용약관 및 개인정보처리방침 동의 (필수)"
                    description="EduTalk 서비스 이용을 위해 이용약관과 개인정보처리방침에 동의해주세요."
                    link="전문 보기"
                />
                <Checkbox
                    id="marketing"
                    name="marketing"
                    checked={formData.marketing}
                    onChange={handleInputChange}
                    label="마케팅 정보 수신 동의 (선택)"
                    description="새로운 기능, 이벤트, 프로모션 등의 유용한 정보를 이메일로 받아보세요."
                />
            </div>
        </div>
        <div className={auth.register.summary.container}>
            <h4 className={auth.register.summary.title}>
                <svg className={auth.register.summary.icon} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                가입 정보 확인
            </h4>
            <div className={auth.register.summary.content}>
                <div className={auth.register.summary.row}>
                    <span className={auth.register.summary.label}>계약사명:</span>
                    <span className={auth.register.summary.value}>{formData.identy}</span>
                </div>
                <div className={auth.register.summary.row}>
                    <span className={auth.register.summary.label}>이메일:</span>
                    <span className={auth.register.summary.value}>{formData.email}</span>
                </div>
            </div>
        </div>
    </motion.div>
);