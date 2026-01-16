import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Save, X, LogOut, Home, Loader2, Upload, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMuseums, useMuseumMutations, useExhibitionMutations } from '@/hooks/useMuseums';
import { uploadImage } from '@/lib/storage';
import type { MuseumWithExhibitions, MuseumUpdate, ExhibitionInsert, ExhibitionUpdate } from '@/types/database';

interface AdminPageProps {
  onGoHome: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onGoHome }) => {
  const { signOut } = useAuth();
  const { museums, loading, error, refetch } = useMuseums();
  const { updateMuseum, deleteMuseum, loading: museumLoading } = useMuseumMutations();
  const { createExhibition, updateExhibition, deleteExhibition, loading: exhibitionLoading } = useExhibitionMutations();

  const [selectedMuseum, setSelectedMuseum] = useState<MuseumWithExhibitions | null>(null);
  const [isEditingMuseum, setIsEditingMuseum] = useState(false);
  const [editedMuseum, setEditedMuseum] = useState<MuseumUpdate | null>(null);
  const [uploadingImageId, setUploadingImageId] = useState<number | null>(null);
  const [uploadingMuseumImage, setUploadingMuseumImage] = useState(false);
  const [editedExhibitions, setEditedExhibitions] = useState<{[key: number]: ExhibitionUpdate}>({});
  const [savingExhibitionId, setSavingExhibitionId] = useState<number | null>(null);

  // 전시회 이미지 파일 업로드 핸들러
  const handleImageUpload = async (exhibitionId: number, file: File) => {
    setUploadingImageId(exhibitionId);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        await updateExhibition(exhibitionId, { image: imageUrl });
        await refetch();
      } else {
        alert('이미지 업로드에 실패했습니다. Storage 버킷 설정을 확인하세요.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingImageId(null);
    }
  };

  // 미술관 이미지 파일 업로드 핸들러
  const handleMuseumImageUpload = async (file: File) => {
    if (!editedMuseum) return;
    setUploadingMuseumImage(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setEditedMuseum({ ...editedMuseum, image: imageUrl });
      } else {
        alert('이미지 업로드에 실패했습니다. Storage 버킷 설정을 확인하세요.');
      }
    } catch (err) {
      console.error('Museum image upload error:', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingMuseumImage(false);
    }
  };

  // 선택된 미술관이 변경되면 업데이트
  useEffect(() => {
    if (selectedMuseum && museums.length > 0) {
      const updated = museums.find(m => m.id === selectedMuseum.id);
      if (updated) {
        setSelectedMuseum(updated);
      }
    }
  }, [museums]);

  const handleLogout = async () => {
    await signOut();
    onGoHome();
  };

  const handleEditMuseum = (museum: MuseumWithExhibitions) => {
    setEditedMuseum({
      country: museum.country,
      city: museum.city,
      name: museum.name,
      short_name: museum.short_name,
      description: museum.description,
      image: museum.image
    });
    setIsEditingMuseum(true);
  };

  const handleSaveMuseum = async () => {
    if (!editedMuseum || !selectedMuseum) return;
    
    const result = await updateMuseum(selectedMuseum.id, editedMuseum);
    if (result) {
      await refetch();
      setIsEditingMuseum(false);
    }
  };

  const handleDeleteMuseum = async (id: number) => {
    if (window.confirm('정말로 이 미술관을 삭제하시겠습니까? 관련된 모든 전시회도 함께 삭제됩니다.')) {
      const success = await deleteMuseum(id);
      if (success) {
        await refetch();
        setSelectedMuseum(null);
      }
    }
  };

  const handleAddExhibition = async () => {
    if (!selectedMuseum) return;
    
    const newExhibition: ExhibitionInsert = {
      museum_id: selectedMuseum.id,
      title: '새 전시회',
      category: 'Contemporary',
      year: new Date().getFullYear().toString(),
      description: '새로운 전시회 설명입니다.',
      image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d',
      website: 'https://example.com'
    };
    
    const result = await createExhibition(newExhibition);
    if (result) {
      await refetch();
    }
  };

  const handleDeleteExhibition = async (exhibitionId: number) => {
    if (window.confirm('정말로 이 전시회를 삭제하시겠습니까?')) {
      const success = await deleteExhibition(exhibitionId);
      if (success) {
        await refetch();
      }
    }
  };

  // 전시회 필드 수정 (로컬 상태만 업데이트)
  const handleEditExhibitionField = (
    exhibitionId: number, 
    field: keyof ExhibitionUpdate, 
    value: string
  ) => {
    setEditedExhibitions(prev => ({
      ...prev,
      [exhibitionId]: {
        ...prev[exhibitionId],
        [field]: value
      }
    }));
  };

  // 전시회 저장 버튼 클릭 시 실제 저장
  const handleSaveExhibition = async (exhibitionId: number) => {
    const edited = editedExhibitions[exhibitionId];
    if (!edited || Object.keys(edited).length === 0) {
      console.log('No changes to save');
      return;
    }
    
    // 현재 스크롤 위치 저장
    const scrollPosition = window.scrollY;
    
    setSavingExhibitionId(exhibitionId);
    try {
      console.log('Saving exhibition:', exhibitionId, edited);
      const result = await updateExhibition(exhibitionId, edited);
      
      if (result) {
        console.log('Save successful:', result);
        await refetch();
        // 저장 완료 후 해당 전시회의 편집 상태 제거
        setEditedExhibitions(prev => {
          const newState = { ...prev };
          delete newState[exhibitionId];
          return newState;
        });
        // 스크롤 위치 복원
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition);
        });
      } else {
        console.error('Save failed - no result returned');
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSavingExhibitionId(null);
    }
  };

  // 전시회가 수정되었는지 확인
  const isExhibitionEdited = (exhibitionId: number) => {
    return !!editedExhibitions[exhibitionId];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="animate-spin" size={24} />
          <span>데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">오류: {error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-white text-black hover:bg-white/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center sticky top-0 bg-[#0a0a0a] z-50">
        <div>
          <h1 className="text-2xl tracking-wider">미술관 관리자 페이지</h1>
          <p className="text-xs text-white/50 mt-1">Supabase 데이터베이스 연동</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-colors duration-300"
          >
            <Home size={16} />
            홈으로
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-white/90 transition-colors duration-300"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Museums List */}
        <aside className="w-80 border-r border-white/10 min-h-screen p-6">
          <h2 className="text-lg mb-4 flex items-center justify-between">
            미술관 목록
            <span className="text-xs text-white/50">({museums.length}개)</span>
          </h2>
          
          <div className="space-y-2">
            {museums.map(museum => (
              <div
                key={museum.id}
                onClick={() => {
                  setSelectedMuseum(museum);
                  setIsEditingMuseum(false);
                }}
                className={`p-4 border border-white/10 cursor-pointer transition-all ${
                  selectedMuseum?.id === museum.id ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{museum.country}</div>
                    <div className="text-xs text-white/50 mt-1">{museum.name}</div>
                    <div className="text-xs text-white/30 mt-1">{museum.exhibitions.length}개 전시회</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMuseum(museum);
                        handleEditMuseum(museum);
                      }}
                      className="text-white/50 hover:text-white"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMuseum(museum.id);
                      }}
                      className="text-white/50 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {isEditingMuseum && editedMuseum && selectedMuseum ? (
            // Museum Edit Form
            <div className="max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">미술관 정보 수정</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveMuseum}
                    disabled={museumLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {museumLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    저장
                  </button>
                  <button
                    onClick={() => setIsEditingMuseum(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:bg-white/5"
                  >
                    <X size={16} />
                    취소
                  </button>
                </div>
              </div>

              <div className="space-y-4 bg-black border border-white/10 p-6">
                <div>
                  <label className="block text-sm text-white/70 mb-2">국가</label>
                  <input
                    type="text"
                    value={editedMuseum.country || ''}
                    onChange={(e) => setEditedMuseum({ ...editedMuseum, country: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">도시</label>
                  <input
                    type="text"
                    value={editedMuseum.city || ''}
                    onChange={(e) => setEditedMuseum({ ...editedMuseum, city: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">미술관 이름</label>
                  <input
                    type="text"
                    value={editedMuseum.name || ''}
                    onChange={(e) => setEditedMuseum({ ...editedMuseum, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">짧은 이름</label>
                  <input
                    type="text"
                    value={editedMuseum.short_name || ''}
                    onChange={(e) => setEditedMuseum({ ...editedMuseum, short_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">설명</label>
                  <textarea
                    value={editedMuseum.description || ''}
                    onChange={(e) => setEditedMuseum({ ...editedMuseum, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">섹션 배경 이미지</label>
                  
                  {/* 현재 이미지 미리보기 */}
                  {editedMuseum.image && (
                    <div className="mb-3 relative w-full h-40 overflow-hidden border border-white/20 rounded">
                      <img 
                        src={editedMuseum.image} 
                        alt="미술관 배경"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{editedMuseum.country}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {/* URL 입력 */}
                    <input
                      type="text"
                      value={editedMuseum.image || ''}
                      onChange={(e) => setEditedMuseum({ ...editedMuseum, image: e.target.value })}
                      placeholder="이미지 URL 입력"
                      className="flex-1 bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                    />
                    
                    {/* 파일 업로드 버튼 */}
                    <label className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer">
                      {uploadingMuseumImage ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Upload size={16} />
                      )}
                      <span className="text-sm">업로드</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingMuseumImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleMuseumImageUpload(file);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-white/40 mt-1">홈페이지 섹션에 표시되는 배경 이미지입니다</p>
                </div>
              </div>
            </div>
          ) : selectedMuseum ? (
            // Exhibitions List
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">{selectedMuseum.country} - 전시회 목록</h2>
                <button
                  onClick={handleAddExhibition}
                  disabled={exhibitionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {exhibitionLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                  새 전시회 추가
                </button>
              </div>

              <div className="space-y-6">
                {selectedMuseum.exhibitions.map((exh, index) => (
                  <div key={exh.id} className={`bg-black border p-6 ${isExhibitionEdited(exh.id) ? 'border-yellow-500/50' : 'border-white/10'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg">전시회 #{index + 1}</h3>
                        {isExhibitionEdited(exh.id) && (
                          <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1">수정됨</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isExhibitionEdited(exh.id) && (
                          <button
                            onClick={() => handleSaveExhibition(exh.id)}
                            disabled={savingExhibitionId === exh.id}
                            className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm transition-colors disabled:opacity-50"
                          >
                            {savingExhibitionId === exh.id ? (
                              <Loader2 className="animate-spin" size={14} />
                            ) : (
                              <Save size={14} />
                            )}
                            저장
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteExhibition(exh.id)}
                          className="text-white/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/70 mb-2">제목</label>
                        <input
                          type="text"
                          value={editedExhibitions[exh.id]?.title ?? exh.title}
                          onChange={(e) => handleEditExhibitionField(exh.id, 'title', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/70 mb-2">카테고리</label>
                        <input
                          type="text"
                          value={editedExhibitions[exh.id]?.category ?? exh.category}
                          onChange={(e) => handleEditExhibitionField(exh.id, 'category', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/70 mb-2">연도</label>
                        <input
                          type="text"
                          value={editedExhibitions[exh.id]?.year ?? exh.year}
                          onChange={(e) => handleEditExhibitionField(exh.id, 'year', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/70 mb-2">웹사이트</label>
                        <input
                          type="text"
                          value={editedExhibitions[exh.id]?.website ?? exh.website}
                          onChange={(e) => handleEditExhibitionField(exh.id, 'website', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm text-white/70 mb-2">설명</label>
                        <textarea
                          value={editedExhibitions[exh.id]?.description ?? exh.description}
                          onChange={(e) => handleEditExhibitionField(exh.id, 'description', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40 min-h-[80px]"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm text-white/70 mb-2">이미지</label>
                        
                        {/* 현재 이미지 미리보기 */}
                        {(editedExhibitions[exh.id]?.image ?? exh.image) && (
                          <div className="mb-3 relative w-32 h-20 overflow-hidden border border-white/20">
                            <img 
                              src={editedExhibitions[exh.id]?.image ?? exh.image} 
                              alt={exh.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="flex gap-2">
                          {/* URL 입력 */}
                          <input
                            type="text"
                            value={editedExhibitions[exh.id]?.image ?? exh.image}
                            onChange={(e) => handleEditExhibitionField(exh.id, 'image', e.target.value)}
                            placeholder="이미지 URL 입력"
                            className="flex-1 bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-white/40"
                          />
                          
                          {/* 파일 업로드 버튼 */}
                          <label className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer">
                            {uploadingImageId === exh.id ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Upload size={16} />
                            )}
                            <span className="text-sm">업로드</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingImageId === exh.id}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(exh.id, file);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-white/40 mt-1">URL을 직접 입력하거나 이미지 파일을 업로드하세요</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Empty State
            <div className="flex items-center justify-center h-full text-white/50">
              <div className="text-center">
                <p className="text-lg mb-2">미술관을 선택해주세요</p>
                <p className="text-sm">왼쪽 목록에서 미술관을 선택하여 수정할 수 있습니다</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
