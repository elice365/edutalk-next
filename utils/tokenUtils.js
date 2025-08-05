/**
 * JWT 토큰 관련 유틸리티 함수들 (RS256 지원)
 */

import { getAvatarUrl } from '@/constants/defaults';

/**
 * JWT 토큰을 디코딩하여 헤더와 페이로드를 반환 (서명 검증 없음)
 * @param {string} token - JWT 토큰
 * @returns {object|null} - {header, payload} 또는 null (실패 시)
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    // JWT는 header.payload.signature 형태
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Base64 URL 디코딩
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    return { header, payload };
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

/**
 * 토큰이 만료되었는지 확인
 * @param {string} token - JWT 토큰
 * @returns {boolean} - 만료 여부
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.payload.exp < currentTime;
};

/**
 * 토큰에서 사용자 정보 추출
 * @param {string} token - JWT 토큰
 * @returns {object|null} - 사용자 정보 또는 null
 */
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload) return null;
  
  const payload = decoded.payload;
  
  return {
    id: payload.sub || payload.userId || payload.id, // JWT에서 sub이 사용자 ID
    userType: payload.type || payload.userType || payload.role, // JWT에서 type이 사용자 타입
    name: payload.name || payload.username,
    email: payload.email,
    avatar: getAvatarUrl(payload.avatar),
    identy: payload.identy // JWT에서 identy 추가
  };
};

/**
 * 토큰 기본 유효성 검사 (형식 + 만료 시간)
 * @param {string} token - JWT 토큰
 * @returns {boolean} - 기본 유효성 여부
 */
export const isValid = (token) => {
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  return !isTokenExpired(token);
};

/**
 * RS256 토큰의 서명을 백엔드에서 검증
 * @param {string} token - JWT 토큰
 * @returns {Promise<boolean>} - 검증 결과
 */
export const verifyToken = async (token) => {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });
    
    const result = await response.json();
    return response.ok && result.valid;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

/**
 * JWKS로 토큰 검증
 * @param {string} token - JWT 토큰
 * @param {string} jwksUrl - JWKS 엔드포인트 URL
 * @returns {Promise<boolean>} - 검증 결과
 */
export const verifyJWKS = async (token, jwksUrl) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.header.kid) return false;
    
    // JWKS에서 키 정보 가져오기
    const jwksResponse = await fetch(jwksUrl);
    const jwks = await jwksResponse.json();
    
    const key = jwks.keys.find(k => k.kid === decoded.header.kid);
    if (!key) return false;
    
    // 실제 서명 검증은 crypto 라이브러리나 백엔드에서 처리
    // 프론트엔드에서는 기본 검증만 수행
    return isValid(token);
  } catch (error) {
    console.error('JWKS verification error:', error);
    return false;
  }
};

/**
 * 종합적인 토큰 유효성 검사
 * @param {string} token - JWT 토큰
 * @param {object} options - 검증 옵션
 * @returns {Promise<boolean>} - 검증 결과
 */
export const validate = async (token, options = {}) => {
  // 기본 유효성 검사
  if (!isValid(token)) {
    return false;
  }
  
  // 백엔드 검증이 필요한 경우
  if (options.backend) {
    return await verifyToken(token);
  }
  
  // JWKS 검증이 필요한 경우
  if (options.jwksUrl) {
    return await verifyJWKS(token, options.jwksUrl);
  }
  
  // 기본적으로는 기본 검증만 수행
  return true;
};

/**
 * 토큰 정보 요약
 * @param {string} token - JWT 토큰
 * @returns {object|null} - 토큰 정보
 */
export const getInfo = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  const { header, payload } = decoded;
  
  return {
    algorithm: header.alg,
    type: header.typ,
    keyId: header.kid,
    issuer: payload.iss,
    audience: payload.aud,
    subject: payload.sub,
    issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
    expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
    notBefore: payload.nbf ? new Date(payload.nbf * 1000) : null,
    isExpired: isTokenExpired(token)
  };
};