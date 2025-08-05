import { useState, useEffect, useContext, useCallback } from 'react';
import { api } from '@/utils/axios';
import { AuthContext } from '@/components/provider/Auth';

export const useProfile = () => {
  const { user, login: updateUserContext } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // 목업 서버에서 프로필 정보 가져오기
      const response = await api.get(`/profiles/${user.id}`);
      setProfile(response.data);
    } catch (err) {
      console.error("프로필 정보 조회 실패:", err);
      setError("프로필 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updatedData) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // 목업 서버에 프로필 정보 업데이트
      const response = await api.put(`/profiles/${user.id}`, {
        ...profile, // 기존 프로필 정보
        ...updatedData // 업데이트할 정보
      });
      
      setProfile(response.data);
      
      // AuthContext의 사용자 정보도 업데이트
      const updatedUser = { ...user, name: response.data.name, avatar: response.data.avatar };
      updateUserContext(updatedUser, localStorage.getItem('authToken')); // 토큰은 유지

      alert("프로필이 성공적으로 업데이트되었습니다.");
      return { success: true };

    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
      setError("프로필 업데이트에 실패했습니다.");
      alert("프로필 업데이트에 실패했습니다.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, updateProfile, fetchProfile };
};
