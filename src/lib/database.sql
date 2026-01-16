-- =====================================================
-- Global Art Exhibition Website - Database Schema
-- Supabase에서 이 SQL을 실행하세요
-- =====================================================

-- =====================================================
-- 0. Storage 버킷 설정 (SQL Editor에서 실행)
-- =====================================================

-- Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public) 
VALUES ('exhibition-images', 'exhibition-images', true)
ON CONFLICT (id) DO NOTHING;

-- 모든 사용자가 이미지를 볼 수 있도록 허용
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'exhibition-images');

-- 인증된 사용자만 이미지 업로드 가능
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'exhibition-images' 
    AND auth.role() = 'authenticated'
  );

-- 인증된 사용자만 이미지 삭제 가능
CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'exhibition-images' 
    AND auth.role() = 'authenticated'
  );

-- =====================================================

-- 1. Museums 테이블 생성
CREATE TABLE IF NOT EXISTS museums (
  id SERIAL PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Exhibitions 테이블 생성
CREATE TABLE IF NOT EXISTS exhibitions (
  id SERIAL PRIMARY KEY,
  museum_id INTEGER NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  year VARCHAR(10) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  website TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_exhibitions_museum_id ON exhibitions(museum_id);
CREATE INDEX IF NOT EXISTS idx_museums_country ON museums(country);

-- 4. updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Museums 테이블 트리거
DROP TRIGGER IF EXISTS update_museums_updated_at ON museums;
CREATE TRIGGER update_museums_updated_at
  BEFORE UPDATE ON museums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Exhibitions 테이블 트리거
DROP TRIGGER IF EXISTS update_exhibitions_updated_at ON exhibitions;
CREATE TRIGGER update_exhibitions_updated_at
  BEFORE UPDATE ON exhibitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Row Level Security (RLS) 활성화
ALTER TABLE museums ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;

-- 8. 공개 읽기 정책 (누구나 데이터를 읽을 수 있음)
DROP POLICY IF EXISTS "Museums are viewable by everyone" ON museums;
CREATE POLICY "Museums are viewable by everyone" ON museums
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Exhibitions are viewable by everyone" ON exhibitions;
CREATE POLICY "Exhibitions are viewable by everyone" ON exhibitions
  FOR SELECT USING (true);

-- 9. 인증된 사용자만 데이터 수정 가능
DROP POLICY IF EXISTS "Authenticated users can insert museums" ON museums;
CREATE POLICY "Authenticated users can insert museums" ON museums
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update museums" ON museums;
CREATE POLICY "Authenticated users can update museums" ON museums
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete museums" ON museums;
CREATE POLICY "Authenticated users can delete museums" ON museums
  FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert exhibitions" ON exhibitions;
CREATE POLICY "Authenticated users can insert exhibitions" ON exhibitions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update exhibitions" ON exhibitions;
CREATE POLICY "Authenticated users can update exhibitions" ON exhibitions
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete exhibitions" ON exhibitions;
CREATE POLICY "Authenticated users can delete exhibitions" ON exhibitions
  FOR DELETE USING (auth.role() = 'authenticated');


-- =====================================================
-- 초기 데이터 삽입 (Seed Data)
-- =====================================================

INSERT INTO museums (country, city, name, short_name, description, image) VALUES
('CHINA', 'Hong Kong', 'M+ Museum', 'M+', '아시아 최초의 글로벌 현대 시각문화 박물관. 동서양이 교차하는 문화의 허브.', 'https://images.unsplash.com/photo-1737040621533-6cc229f1e506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNJTIwUGx1cyUyME11c2V1bSUyMEhvbmclMjBLb25nfGVufDF8fHx8MTc2ODM3NTkzNHww&ixlib=rb-4.1.0&q=80&w=1080'),
('FRANCE', 'Paris', 'Musée d''Orsay', 'D''ORSAY', '19세기 예술의 정점. 기차역을 개조한 빛의 공간에서 인상주의 걸작들을 만나다.', 'https://images.unsplash.com/photo-1759376294957-a1f68356ab40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNdXMlQzMlQTllJTIwZCUyN09yc2F5JTIwaW50ZXJpb3IlMjBhcmNoaXRlY3R1cmUlMjBhcnR8ZW58MXx8fHwxNzY4MzY0NDE5fDA&ixlib=rb-4.1.0&q=80&w=1080'),
('GERMANY', 'Berlin', 'Neue Nationalgalerie', 'NEUE', '미스 반 데어 로에가 설계한 유리 신전. 20세기 모더니즘 건축의 걸작.', 'https://images.unsplash.com/photo-1740680996207-b4eaae096619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXVlJTIwTmF0aW9uYWxnYWxlcmllJTIwQmVybGlufGVufDF8fHx8MTc2ODM3NTkzNnww&ixlib=rb-4.1.0&q=80&w=1080'),
('ITALY', 'Florence', 'Uffizi Gallery', 'UFFIZI', '르네상스의 발상지. 보티첼리와 다빈치가 숨 쉬는 역사 그 자체.', 'https://images.unsplash.com/photo-1667990435570-c801dc052f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVZmZpemklMjBHYWxsZXJ5JTIwRmxvcmVuY2UlMjBpbnRlcmlvciUyMHJlbmFpc3NhbmNlfGVufDF8fHx8MTc2ODM2NDQyM3ww&ixlib=rb-4.1.0&q=80&w=1080'),
('JAPAN', 'Tokyo', 'Mori Art Museum', 'MORI', '도쿄 타워가 내려다보이는 하늘 위 미술관. 동시대 아시아 예술의 중심.', 'https://images.unsplash.com/photo-1759782526827-5fecfb5f2d9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JpJTIwQXJ0JTIwTXVzZXVtJTIwVG9reW8lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjgzNzU5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'),
('SOUTH KOREA', 'Seoul', 'Leeum Museum', 'LEEUM', '전통과 현대가 교차하는 시간의 경계. 붉은 벽돌과 스테인리스 스틸의 조화.', 'https://images.unsplash.com/photo-1708179504036-0f952912eac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMZWV1bSUyME11c2V1bSUyMFNlb3VsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2ODM2NDQyMHww&ixlib=rb-4.1.0&q=80&w=1080'),
('UK', 'London', 'Tate Modern', 'TATE', '산업 유산 위에서 피어난 현대 미술. 거대한 터빈 홀이 주는 압도적 스케일.', 'https://images.unsplash.com/photo-1760213928402-8a6f2d3a2f0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUYXRlJTIwTW9kZXJuJTIwTG9uZG9uJTIwdHVyYmluZSUyMGhhbGwlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjgzNjQ0MTl8MA&ixlib=rb-4.1.0&q=80&w=1080'),
('USA', 'New York', 'The MoMA', 'MOMA', '현대 미술의 심장. 끊임없이 질문을 던지는 가장 진보적인 예술의 최전선.', 'https://images.unsplash.com/photo-1647792845543-a8032c59cbdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb01BJTIwTmV3JTIwWW9yayUyMG11c2V1bSUyMGludGVyaW9yfGVufDF8fHx8MTc2ODM2NDQxOXww&ixlib=rb-4.1.0&q=80&w=1080');

-- M+ Museum (id: 1) 전시회
INSERT INTO exhibitions (museum_id, title, category, year, description, image, website) VALUES
(1, 'Things, Spaces, Interactions', 'Design', '2024', '사물, 공간, 상호작용. 20세기부터 현재까지 아시아 디자인의 진화와 혁신을 탐구합니다.', 'https://images.unsplash.com/photo-1556297850-b44db1a663f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBjaGluZXNlJTIwYXJ0fGVufDF8fHx8MTc2ODM3NTkzNHww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mplus.org.hk'),
(1, 'Ink Dreams: Chinese Literati Painting', 'Traditional', '2024', '수묵의 꿈. 중국 문인화의 정신세계를 담은 먹과 물의 조화, 그 깊이를 만나다.', 'https://images.unsplash.com/photo-1684871430772-569936b1a0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwaW5rJTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY4Mzc1OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mplus.org.hk'),
(1, 'Calligraphy as Living Art', 'Calligraphy', '2024', '살아있는 예술, 서예. 현대 서예가들이 전통의 붓글씨에 불어넣은 새로운 생명력.', 'https://images.unsplash.com/photo-1658236738162-43b272396b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwY2FsbGlncmFwaHklMjBleGhpYml0aW9ufGVufDF8fHx8MTc2ODM3NTkzNXww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mplus.org.hk'),
(1, 'The Terracotta Warriors: Guardian Spirits', 'Ancient Art', '2023', '병마용의 수호령. 2천 년 전 진시황의 군대, 고대 중국의 위대한 예술적 유산.', 'https://images.unsplash.com/photo-1737418829009-f4a4cec7219c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXJyYWNvdHRhJTIwd2FycmlvcnMlMjBleGhpYml0aW9ufGVufDF8fHx8MTc2ODM3NTkzNnww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mplus.org.hk'),
(1, 'Contemporary Asian Sculpture', 'Sculpture', '2023', '아시아 현대 조각의 지평. 전통과 현대를 넘나드는 조각가들의 실험적 도전.', 'https://images.unsplash.com/photo-1605658782236-54c8632c7619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGNvbnRlbXBvcmFyeSUyMHNjdWxwdHVyZXxlbnwxfHx8fDE3NjgzNzU5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mplus.org.hk');

-- Musée d'Orsay (id: 2) 전시회
INSERT INTO exhibitions (museum_id, title, category, year, description, image, website) VALUES
(2, 'Manet / Degas', 'Impressionism', '2024', '에두아르 마네와 에드가 드가, 두 거장의 대화. 인상주의를 정의한 라이벌이자 친구였던 두 화가의 작품을 통해 19세기 파리 예술계의 혁명을 목격하세요.', 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5ldCUyMGltcHJlc3Npb25pc3QlMjBwYWludGluZ3xlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.musee-orsay.fr'),
(2, 'Van Gogh in Auvers-sur-Oise', 'Post-Impressionism', '2024', '반 고흐의 마지막 70일. 오베르에서 그린 열정적인 붓놀림과 강렬한 색채가 담긴 작품들을 통해 천재 화가의 마지막 순간을 재조명합니다.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW4lMjBnb2doJTIwcGFpbnRpbmd8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.musee-orsay.fr'),
(2, 'Paris 1874: Inventing Impressionism', 'History', '2024', '1874년 4월 15일, 예술 역사가 바뀐 날. 최초의 인상주의 전시회가 열린 파리의 혁명적 순간을 역사적 자료와 함께 재현합니다.', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMDE4NzQlMjBhcnR8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.musee-orsay.fr'),
(2, 'Pastels from Millet to Redon', 'Drawing', '2023', '파스텔의 부드러운 매력. 밀레부터 르동까지, 19세기 프랑스 화가들이 파스텔로 표현한 섬세한 빛과 색채의 향연.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBkcmF3aW5nJTIwYXJ0fGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.musee-orsay.fr'),
(2, 'Edvard Munch: A Poem of Life, Love and Death', 'Expressionism', '2023', '뭉크의 내면 풍경. ''절규''의 화가가 그린 인간 존재의 근원적 감정들 - 삶, 사랑, 죽음에 대한 시적 탐구.', 'https://images.unsplash.com/photo-1577083288073-40892c0860a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdW5jaCUyMHNjcmVhbSUyMHBhaW50aW5nfGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.musee-orsay.fr');

-- Neue Nationalgalerie (id: 3) 전시회
INSERT INTO exhibitions (museum_id, title, category, year, description, image, website) VALUES
(3, 'German Expressionism: The Bridge and The Blue Rider', 'Expressionism', '2024', '독일 표현주의의 양대 산맥. 브뤼케와 청기사파가 보여준 감정의 폭발과 색채의 혁명.', 'https://images.unsplash.com/photo-1763116147265-6f9fda3934da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBleHByZXNzaW9uaXNtJTIwYXJ0fGVufDF8fHx8MTc2ODM3NTkzN3ww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.neue-nationalgalerie.de'),
(3, 'Bauhaus: Form Follows Function', 'Design', '2024', '바우하우스의 유산. 형태는 기능을 따른다는 철학으로 세계 디자인을 혁신한 모더니즘의 요람.', 'https://images.unsplash.com/photo-1759090901533-c2af53f08ee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXVoYXVzJTIwZGVzaWduJTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjgzNzU5Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.neue-nationalgalerie.de'),
(3, 'Gerhard Richter: Painting After All', 'Contemporary', '2024', '게르하르트 리히터 회고전. 추상과 구상, 사진과 회화의 경계를 넘나드는 현대미술의 거장.', 'https://images.unsplash.com/photo-1688223368687-aa87b0d58840?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJoYXJkJTIwcmljaHRlciUyMHBhaW50aW5nfGVufDF8fHx8MTc2ODM3NTkzOHww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.neue-nationalgalerie.de'),
(3, 'Neo Rauch: The Leipzig School', 'Painting', '2023', '네오 라우흐와 라이프치히 화파. 동독의 기억과 초현실적 상상력이 만나는 독특한 회화 세계.', 'https://images.unsplash.com/photo-1632067694866-de074902e56f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW8lMjByYXVjaCUyMHBhaW50aW5nfGVufDF8fHx8MTc2ODM3NTkzOHww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.neue-nationalgalerie.de'),
(3, 'Modern German Sculpture: Beuys to Kiefer', 'Sculpture', '2023', '독일 현대 조각의 거장들. 보이스부터 키퍼까지, 물질과 개념이 만나는 예술적 탐구.', 'https://images.unsplash.com/photo-1763454787342-9bc86d1dac8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnZXJtYW4lMjBzY3VscHR1cmV8ZW58MXx8fHwxNzY4Mzc1OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.neue-nationalgalerie.de');

-- Uffizi Gallery (id: 4) 전시회
INSERT INTO exhibitions (museum_id, title, category, year, description, image, website) VALUES
(4, 'Botticelli and the Medici', 'Renaissance', '2024', '보티첼리와 메디치 가문. 르네상스 예술의 황금기를 이끈 후원자와 화가의 관계를 조명하는 특별전.', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3R0aWNlbGxpJTIwcGFpbnRpbmd8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.uffizi.it'),
(4, 'Caravaggio and the 17th Century', 'Baroque', '2024', '카라바조의 극적인 빛. 바로크 시대를 연 혁명적 화가의 명암법과 사실주의가 만들어낸 강렬한 드라마.', 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJhdmFnZ2lvJTIwcGFpbnRpbmd8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.uffizi.it'),
(4, 'Leonardo da Vinci''s Annunciation', 'Masterpiece', '2024', '레오나르도의 수태고지. 천재의 초기작에 담긴 완벽한 원근법과 섬세한 자연 묘사를 감상하세요.', 'https://images.unsplash.com/photo-1578926078627-cf68d0566c24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW9uYXJkbyUyMGRhJTIwdmluY2klMjBwYWludGluZ3xlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.uffizi.it'),
(4, 'Titian''s Women', 'Portraiture', '2023', '티치아노가 그린 여성들. 베네치아 거장이 포착한 르네상스 여성의 아름다움과 위엄.', 'https://images.unsplash.com/photo-1577720643272-265f8c0ced57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5haXNzYW5jZSUyMHBvcnRyYWl0fGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.uffizi.it'),
(4, 'The Art of Sculpture', 'Sculpture', '2023', '조각의 예술. 미켈란젤로부터 베르니니까지, 대리석에 생명을 불어넣은 거장들의 3차원 걸작.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5haXNzYW5jZSUyMHNjdWxwdHVyZXxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.uffizi.it');

-- Mori Art Museum (id: 5) 전시회
INSERT INTO exhibitions (museum_id, title, category, year, description, image, website) VALUES
(5, 'Our Ecology: Toward a Planetary Living', 'Contemporary', '2024', '지구적 생태계를 향한 여정. 환경 위기 시대, 예술가들이 제시하는 지속 가능한 미래에 대한 비전과 실천.', 'https://images.unsplash.com/photo-1767460775045-a0bf02c997af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBqYXBhbmVzZSUyMGFydCUyMGV4aGliaXRpb258ZW58MXx8fHwxNzY4Mzc1OTMyfDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mori.art.museum'),
(5, 'teamLab: World Unleashed', 'Digital Art', '2024', '팀랩의 디지털 유토피아. 빛과 소리, 인터랙티브 기술이 만들어내는 경계 없는 예술 세계.', 'https://images.unsplash.com/photo-1761735490180-225200bd71a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtTGFiJTIwZGlnaXRhbCUyMGFydCUyMGluc3RhbGxhdGlvbnxlbnwxfHx8fDE3NjgzNzU5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mori.art.museum'),
(5, 'Shodo: The Art of Japanese Calligraphy', 'Traditional', '2024', '서예의 정신. 먹과 붓이 만나 탄생하는 일본 서예의 아름다움과 선의 미학.', 'https://images.unsplash.com/photo-1767298003694-5fb561ef4b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGNhbGxpZ3JhcGh5JTIwYXJ0fGVufDF8fHx8MTc2ODM3NTkzM3ww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mori.art.museum'),
(5, 'Manga and Anime: Revolution of Japanese Pop Culture', 'Pop Culture', '2023', '만화와 애니메이션의 혁명. 전 세계를 사로잡은 일본 팝 컬처의 역사와 미학을 조명합니다.', 'https://images.unsplash.com/photo-1716085487003-217f0e459f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGFuaW1lJTIwYXJ0JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjgzNzU5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mori.art.museum'),
(5, 'Ma: The Aesthetics of Japanese Space', 'Design', '2023', '마(間)의 미학. 비움과 여백, 침묵이 만들어내는 일본 미니멀리즘의 공간 철학.', 'https://images.unsplash.com/photo-1755018237843-2f47f470cf11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwamFwYW5lc2UlMjBkZXNpZ258ZW58MXx8fHwxNzY4Mzc1OTM0fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.mori.art.museum');

-- Leeum Museum (id: 6) 전시회
INSERT INTO exhibitions (museum_id, title, category, year, description, image, website) VALUES
(6, 'Maurizio Cattelan: WE', 'Contemporary', '2024', '마우리치오 카텔란의 아시아 최대 규모 회고전. 도발적이고 유머러스한 작품들을 통해 현대 사회를 날카롭게 비판하는 거장의 예술 세계.', 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcnQlMjBpbnN0YWxsYXRpb258ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.leeum.org'),
(6, 'Joseon White Porcelain', 'Traditional', '2024', '조선 백자의 순백의 아름다움. 500년 역사를 지닌 한국 도자기 예술의 정수를 만나는 특별전.', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBwb3JjZWxhaW58ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.leeum.org'),
(6, 'Cloud Walkers', 'Installation', '2023', '구름 위를 걷는 경험. 빛과 공간, 소리가 어우러진 몰입형 인스톨레이션 작품으로 새로운 감각의 여행을 떠나보세요.', 'https://images.unsplash.com/photo-1549887534-1541e9326642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGFydCUyMGluc3RhbGxhdGlvbnxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.leeum.org'),
(6, 'Arts of Korea', 'Permanent', '2023', '한국 미술의 정수. 고려 불화부터 조선 회화까지, 천 년을 아우르는 한국 전통 미술의 정수를 상설 전시합니다.', 'https://images.unsplash.com/photo-1582637506008-335c7ca66e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFydHxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.leeum.org'),
(6, 'Interlace: Textile Art', 'Craft', '2023', '직조의 예술. 전통 섬유 공예와 현대 텍스타일 아트가 만나 만들어내는 새로운 조형 언어를 탐험합니다.', 'https://images.unsplash.com/photo-1601924357840-3c6b0f1685c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwYXJ0fGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.leeum.org');

-- Tate Modern (id: 7) 전시회
INSERT INTO exhibitions (museum_id, title, category, year, description, image, website) VALUES
(7, 'Yayoi Kusama: Infinity Mirror Rooms', 'Installation', '2024', '쿠사마 야요이의 무한 거울방. 끝없이 펼쳐지는 점과 빛의 우주 속으로 들어가는 몰입형 경험.', 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrdXNhbWElMjBpbmZpbml0eSUyMG1pcnJvcnxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.tate.org.uk'),
(7, 'Capturing the Moment', 'Painting', '2024', '순간을 포착하다. 동시대 화가들이 붓으로 담아낸 현대 생활의 찰나와 감정.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBwYWludGluZ3xlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.tate.org.uk'),
(7, 'Hilma af Klint & Piet Mondrian', 'Abstract', '2023', '추상미술의 선구자들. 힐마 아프 클린트와 몬드리안이 개척한 정신적이고 기하학적인 추상의 세계.', 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydHxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.tate.org.uk'),
(7, 'Philip Guston', 'Contemporary', '2023', '필립 거스턴 회고전. 추상에서 구상으로, 그리고 다시 돌아온 미국 현대미술의 거장.', 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGV4cHJlc3Npb25pc20lMjBwYWludGluZ3xlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.tate.org.uk'),
(7, 'Turbine Hall Commission', 'Large Scale', '2023', '터빈 홀의 거대한 예술. 압도적인 공간을 채우는 대형 설치 작품으로 새로운 감각을 경험하세요.', 'https://images.unsplash.com/photo-1549887534-1541e9326642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXJnZSUyMHNjYWxlJTIwaW5zdGFsbGF0aW9ufGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.tate.org.uk');

-- The MoMA (id: 8) 전시회
INSERT INTO exhibitions (museum_id, title, category, year, description, image, website) VALUES
(8, 'Ed Ruscha / Now Then', 'Pop Art', '2024', '에드 루샤의 60년 예술 여정. 팝 아트의 선구자가 보여주는 언어와 이미지, 미국 문화에 대한 독특한 시각.', 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBhcnQlMjBnYWxsZXJ5fGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.moma.org'),
(8, 'Picasso in Fontainebleau', 'Modernism', '2024', '피카소의 여름. 1921년 퐁텐블로에서 그린 신고전주의 시기 작품들을 통해 거장의 또 다른 면모를 발견하세요.', 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWNhc3NvJTIwcGFpbnRpbmd8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.moma.org'),
(8, 'Emerging Ecologies', 'Architecture', '2024', '생태와 건축의 새로운 대화. 지속 가능한 미래를 위한 혁신적인 건축 디자인과 도시 계획을 제시합니다.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.moma.org'),
(8, 'New Photography 2023', 'Photography', '2023', '사진의 새로운 지평. 동시대 사진가들이 포착한 우리 시대의 모습과 사진 매체의 무한한 가능성.', 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.moma.org'),
(8, 'Signals: How Video Transformed the World', 'Media Art', '2023', '비디오 아트의 혁명. 1960년대부터 현재까지, 영상 매체가 어떻게 세계를 변화시켰는지 탐구합니다.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGFydCUyMGluc3RhbGxhdGlvbnxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://www.moma.org');
