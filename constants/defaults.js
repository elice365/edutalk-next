/**
 * 기본 상수값들을 정의하는 파일
 */

// 기본 아바타 이미지 URL
export const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png';

// 아바타 처리 유틸리티 함수
export const getAvatarUrl = (avatarUrl) => {
  // 아바타 URL이 없거나 빈 문자열이거나 null/undefined인 경우 기본 아바타 반환
  if (!avatarUrl || avatarUrl.trim() === '') {
    return DEFAULT_AVATAR;
  }
  return avatarUrl;
};