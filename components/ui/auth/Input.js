import React, { useState } from 'react';
import { auth } from '@/styles/auth';
import Alert from './Alert'; // Alert 컴포넌트 임포트

const AuthInput = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  required,
  icon,
  focused,
  isPassword = false, // 비밀번호 입력 필드 여부
  strength, // 비밀번호 강도 (isPassword가 true일 때만 유효)
  error // 에러 메시지 (isPassword가 true일 때만 유효)
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // 실제 input 태그의 type 결정
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // 비밀번호 강도 바 클래스 매핑
  const strengthBarClass = {
    1: auth.passwordStrength.bar.weak,
    2: auth.passwordStrength.bar.fair,
    3: auth.passwordStrength.bar.good,
    4: auth.passwordStrength.bar.strong,
  };

  return (
    <div className={isPassword && !error ? auth.input.passwordConfirmGap : ""}> {/* 비밀번호 확인 필드 간격 */} 
      <label htmlFor={id} className={auth.input.label}>
        {placeholder}
      </label>
      <div className={auth.input.container}>
        <div
          className={`
            ${auth.input.iconContainer.base}
            ${focused || value ? auth.input.iconContainer.focused : auth.input.iconContainer.default}
          `}
        >
          {icon}
        </div>
        <input
          type={inputType}
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`
            ${isPassword ? auth.input.fieldWithToggle.base : auth.input.field.base}
            ${focused
              ? (isPassword ? auth.input.fieldWithToggle.focused : auth.input.field.focused)
              : (isPassword && error)
                ? 'border-error-500 ring-4 ring-error-100'
                : (isPassword ? auth.input.fieldWithToggle.default : auth.input.field.default)
            }
          `}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={auth.input.toggleButton}
          >
            {showPassword ? (
              <svg className={auth.input.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className={auth.input.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {isPassword && strength && (
        <div className={auth.passwordStrength.container}>
          <div className={auth.passwordStrength.bar.container}>
            <div
                className={`${auth.passwordStrength.bar.fill} ${
                  strengthBarClass[strength.strength] || 'w-0'
                }`}
              ></div>
          </div>
          <p className={auth.passwordStrength.hint}>
            8자 이상, 영문과 숫자 조합 권장
          </p>
        </div>
      )}
      {isPassword && error && (
        <Alert type="error" message={error} />
      )}
    </div>
  );
};

export default AuthInput;
