import { useState, useEffect, useContext } from "react";
import { api } from '@/utils/axios';
import { AuthContext } from '@/components/provider/Auth';

export const useNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchNotices = async () => {
    if (!user?.identity && !user?.identy) {
      setError('User identity not found');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const identity = user.identity || user.identy;
      
      // Notice API 호출 - identy 파라미터 추가
      const response = await api.get(`/api/notices?identy=${encodeURIComponent(identity)}`);
      
      // Notice 스키마: delete=false 가 아닌 공지만 표시, displayOrder로 정렬
      const validNotices = (response.data.notices || []).filter(notice => !notice.delete);
      setNotices(validNotices);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  useEffect(() => {
    if (user) {
      fetchNotices();
    }
  }, [user]);

  const isExpired = (expirationTime) => {
    if (!expirationTime) return false;
    return new Date(expirationTime) < new Date();
  };

  return {
    notices,
    loading,
    error,
    formatDate,
    isExpired,
    fetchNotices
  };
};
