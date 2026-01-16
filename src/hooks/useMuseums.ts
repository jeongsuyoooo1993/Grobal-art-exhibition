import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { 
  Museum, 
  MuseumInsert, 
  MuseumUpdate, 
  Exhibition, 
  ExhibitionInsert, 
  ExhibitionUpdate,
  MuseumWithExhibitions 
} from '@/types/database';

// 모든 미술관과 전시회 데이터를 가져오는 훅
export const useMuseums = () => {
  const [museums, setMuseums] = useState<MuseumWithExhibitions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMuseums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 미술관 데이터 가져오기
      const { data: museumsData, error: museumsError } = await supabase
        .from('museums')
        .select('*')
        .order('id');

      if (museumsError) throw museumsError;

      // 전시회 데이터 가져오기
      const { data: exhibitionsData, error: exhibitionsError } = await supabase
        .from('exhibitions')
        .select('*')
        .order('id');

      if (exhibitionsError) throw exhibitionsError;

      // 미술관별로 전시회 그룹화
      const museumsWithExhibitions: MuseumWithExhibitions[] = (museumsData || []).map(museum => ({
        ...museum,
        exhibitions: (exhibitionsData || []).filter(exh => exh.museum_id === museum.id)
      }));

      setMuseums(museumsWithExhibitions);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMuseums();
  }, [fetchMuseums]);

  return { museums, loading, error, refetch: fetchMuseums };
};

// 미술관 CRUD 훅
export const useMuseumMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMuseum = async (museum: MuseumInsert): Promise<Museum | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('museums')
        .insert(museum)
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '미술관 생성에 실패했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMuseum = async (id: number, updates: MuseumUpdate): Promise<Museum | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('museums')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '미술관 수정에 실패했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteMuseum = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('museums')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '미술관 삭제에 실패했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createMuseum, updateMuseum, deleteMuseum, loading, error };
};

// 전시회 CRUD 훅
export const useExhibitionMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExhibition = async (exhibition: ExhibitionInsert): Promise<Exhibition | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('exhibitions')
        .insert(exhibition)
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '전시회 생성에 실패했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateExhibition = async (id: number, updates: ExhibitionUpdate): Promise<Exhibition | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('Updating exhibition with:', { id, updates });

      const { data, error: updateError } = await supabase
        .from('exhibitions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw updateError;
      }
      return data;
    } catch (err: any) {
      const errorMessage = err?.message || err?.error_description || '전시회 수정에 실패했습니다.';
      console.error('Update exhibition error details:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteExhibition = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('exhibitions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '전시회 삭제에 실패했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createExhibition, updateExhibition, deleteExhibition, loading, error };
};
