import { useState, useEffect, useCallback } from 'react';
import { LettersResponse, Letter } from '@/types';
import { letterService } from '@/services/letterService';

export default function useUserLetters(
  userId?: number,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 1
  });

  const fetchLetters = useCallback(async (page: number = pagination.page) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response: LettersResponse = await letterService.getLettersByUserId(
        userId,
        page,
        pagination.limit
      );
      
      setLetters(response.data);
      setPagination(prev => ({
        ...prev,
        page: response.page,
        total: response.total,
        totalPages: response.totalPages
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch letters');
    } finally {
      setLoading(false);
    }
  }, [userId, pagination.limit, pagination.page]);

  const updateLetterStatus = useCallback(async (
    id: number,
    status: "pending" | "diterima"
  ) => {
    try {
      await letterService.updateLetterStatus(id, status);
      setLetters(prev => 
        prev.map(letter => 
          letter.nomor_registrasi === id ? { ...letter, status } : letter
        )
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      return false;
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLetters();
    }
  }, [userId, fetchLetters]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchLetters(page);
  }, [fetchLetters]);

  return {
    letters,
    loading,
    error,
    pagination,
    isAdmin: true,
    updateLetterStatus,
    setPage
  };
}