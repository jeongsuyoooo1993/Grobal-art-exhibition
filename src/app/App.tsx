import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ExternalLink, Loader2, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import LoginPage from '@/app/components/LoginPage';
import AdminPage from '@/app/components/AdminPage';
import GlobeIntro from '@/app/components/GlobeIntro';
import { useAuth } from '@/contexts/AuthContext';
import { useMuseums } from '@/hooks/useMuseums';
import type { MuseumWithExhibitions, Exhibition } from '@/types/database';

/**
 * DATA: World Class Museums with Exhibition Lists (Alphabetical Order)
 */

// Exhibition Detail Interface
interface ExhibitionDetail {
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  website: string;
}

const MUSEUMS = [
  {
    id: 1,
    country: "CHINA",
    city: "Hong Kong",
    name: "M+ Museum",
    shortName: "M+",
    description: "아시아 최초의 글로벌 현대 시각문화 박물관. 동서양이 교차하는 문화의 허브.",
    image: "https://images.unsplash.com/photo-1737040621533-6cc229f1e506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNJTIwUGx1cyUyME11c2V1bSUyMEhvbmclMjBLb25nfGVufDF8fHx8MTc2ODM3NTkzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exhibitions: [
      { 
        title: "Things, Spaces, Interactions", 
        category: "Design", 
        year: "2024",
        description: "사물, 공간, 상호작용. 20세기부터 현재까지 아시아 디자인의 진화와 혁신을 탐구합니다.",
        image: "https://images.unsplash.com/photo-1556297850-b44db1a663f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBjaGluZXNlJTIwYXJ0fGVufDF8fHx8MTc2ODM3NTkzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      },
      { 
        title: "Ink Dreams: Chinese Literati Painting", 
        category: "Traditional", 
        year: "2024",
        description: "수묵의 꿈. 중국 문인화의 정신세계를 담은 먹과 물의 조화, 그 깊이를 만나다.",
        image: "https://images.unsplash.com/photo-1684871430772-569936b1a0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwaW5rJTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY4Mzc1OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      },
      { 
        title: "Calligraphy as Living Art", 
        category: "Calligraphy", 
        year: "2024",
        description: "살아있는 예술, 서예. 현대 서예가들이 전통의 붓글씨에 불어넣은 새로운 생명력.",
        image: "https://images.unsplash.com/photo-1658236738162-43b272396b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwY2FsbGlncmFwaHklMjBleGhpYml0aW9ufGVufDF8fHx8MTc2ODM3NTkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      },
      { 
        title: "The Terracotta Warriors: Guardian Spirits", 
        category: "Ancient Art", 
        year: "2023",
        description: "병마용의 수호령. 2천 년 전 진시황의 군대, 고대 중국의 위대한 예술적 유산.",
        image: "https://images.unsplash.com/photo-1737418829009-f4a4cec7219c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXJyYWNvdHRhJTIwd2FycmlvcnMlMjBleGhpYml0aW9ufGVufDF8fHx8MTc2ODM3NTkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      },
      { 
        title: "Contemporary Asian Sculpture", 
        category: "Sculpture", 
        year: "2023",
        description: "아시아 현대 조각의 지평. 전통과 현대를 넘나드는 조각가들의 실험적 도전.",
        image: "https://images.unsplash.com/photo-1605658782236-54c8632c7619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGNvbnRlbXBvcmFyeSUyMHNjdWxwdHVyZXxlbnwxfHx8fDE3NjgzNzU5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      }
    ]
  },
  {
    id: 2,
    country: "FRANCE",
    city: "Paris",
    name: "Musée d'Orsay",
    shortName: "D'ORSAY",
    description: "19세기 예술의 정점. 기차역을 개조한 빛의 공간에서 인상주의 걸작들을 만나다.",
    image: "https://images.unsplash.com/photo-1759376294957-a1f68356ab40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNdXMlQzMlQTllJTIwZCUyN09yc2F5JTIwaW50ZXJpb3IlMjBhcmNoaXRlY3R1cmUlMjBhcnR8ZW58MXx8fHwxNzY4MzY0NDE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exhibitions: [
      { 
        title: "Manet / Degas", 
        category: "Impressionism", 
        year: "2024",
        description: "에두아르 마네와 에드가 드가, 두 거장의 대화. 인상주의를 정의한 라이벌이자 친구였던 두 화가의 작품을 통해 19세기 파리 예술계의 혁명을 목격하세요.",
        image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5ldCUyMGltcHJlc3Npb25pc3QlMjBwYWludGluZ3xlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.musee-orsay.fr"
      },
      { 
        title: "Van Gogh in Auvers-sur-Oise", 
        category: "Post-Impressionism", 
        year: "2024",
        description: "반 고흐의 마지막 70일. 오베르에서 그린 열정적인 붓놀림과 강렬한 색채가 담긴 작품들을 통해 천재 화가의 마지막 순간을 재조명합니다.",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW4lMjBnb2doJTIwcGFpbnRpbmd8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.musee-orsay.fr"
      },
      { 
        title: "Paris 1874: Inventing Impressionism", 
        category: "History", 
        year: "2024",
        description: "1874년 4월 15일, 예술 역사가 바뀐 날. 최초의 인상주의 전시회가 열린 파리의 혁명적 순간을 역사적 자료와 함께 재현합니다.",
        image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMDE4NzQlMjBhcnR8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.musee-orsay.fr"
      },
      { 
        title: "Pastels from Millet to Redon", 
        category: "Drawing", 
        year: "2023",
        description: "파스텔의 부드러운 매력. 밀레부터 르동까지, 19세기 프랑스 화가들이 파스텔로 표현한 섬세한 빛과 색채의 향연.",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBkcmF3aW5nJTIwYXJ0fGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.musee-orsay.fr"
      },
      { 
        title: "Edvard Munch: A Poem of Life, Love and Death", 
        category: "Expressionism", 
        year: "2023",
        description: "뭉크의 내면 풍경. '절규'의 화가가 그린 인간 존재의 근원적 감정들 - 삶, 사랑, 죽음에 대한 시적 탐구.",
        image: "https://images.unsplash.com/photo-1577083288073-40892c0860a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdW5jaCUyMHNjcmVhbSUyMHBhaW50aW5nfGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.musee-orsay.fr"
      }
    ]
  },
  {
    id: 3,
    country: "GERMANY",
    city: "Berlin",
    name: "Neue Nationalgalerie",
    shortName: "NEUE",
    description: "미스 반 데어 로에가 설계한 유리 신전. 20세기 모더니즘 건축의 걸작.",
    image: "https://images.unsplash.com/photo-1740680996207-b4eaae096619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXVlJTIwTmF0aW9uYWxnYWxlcmllJTIwQmVybGlufGVufDF8fHx8MTc2ODM3NTkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exhibitions: [
      { 
        title: "German Expressionism: The Bridge and The Blue Rider", 
        category: "Expressionism", 
        year: "2024",
        description: "독일 표현주의의 양대 산맥. 브뤼케와 청기사파가 보여준 감정의 폭발과 색채의 혁명.",
        image: "https://images.unsplash.com/photo-1763116147265-6f9fda3934da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBleHByZXNzaW9uaXNtJTIwYXJ0fGVufDF8fHx8MTc2ODM3NTkzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.neue-nationalgalerie.de"
      },
      { 
        title: "Bauhaus: Form Follows Function", 
        category: "Design", 
        year: "2024",
        description: "바우하우스의 유산. 형태는 기능을 따른다는 철학으로 세계 디자인을 혁신한 모더니즘의 요람.",
        image: "https://images.unsplash.com/photo-1759090901533-c2af53f08ee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXVoYXVzJTIwZGVzaWduJTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjgzNzU5Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.neue-nationalgalerie.de"
      },
      { 
        title: "Gerhard Richter: Painting After All", 
        category: "Contemporary", 
        year: "2024",
        description: "게르하르트 리히터 회고전. 추상과 구상, 사진과 회화의 경계를 넘나드는 현대미술의 거장.",
        image: "https://images.unsplash.com/photo-1688223368687-aa87b0d58840?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJoYXJkJTIwcmljaHRlciUyMHBhaW50aW5nfGVufDF8fHx8MTc2ODM3NTkzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.neue-nationalgalerie.de"
      },
      { 
        title: "Neo Rauch: The Leipzig School", 
        category: "Painting", 
        year: "2023",
        description: "네오 라우흐와 라이프치히 화파. 동독의 기억과 초현실적 상상력이 만나는 독특한 회화 세계.",
        image: "https://images.unsplash.com/photo-1632067694866-de074902e56f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW8lMjByYXVjaCUyMHBhaW50aW5nfGVufDF8fHx8MTc2ODM3NTkzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.neue-nationalgalerie.de"
      },
      { 
        title: "Modern German Sculpture: Beuys to Kiefer", 
        category: "Sculpture", 
        year: "2023",
        description: "독일 현대 조각의 거장들. 보이스부터 키퍼까지, 물질과 개념이 만나는 예술적 탐구.",
        image: "https://images.unsplash.com/photo-1763454787342-9bc86d1dac8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnZXJtYW4lMjBzY3VscHR1cmV8ZW58MXx8fHwxNzY4Mzc1OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.neue-nationalgalerie.de"
      }
    ]
  },
  {
    id: 4,
    country: "ITALY",
    city: "Florence",
    name: "Uffizi Gallery",
    shortName: "UFFIZI",
    description: "르네상스의 발상지. 보티첼리와 다빈치가 숨 쉬는 역사 그 자체.",
    image: "https://images.unsplash.com/photo-1667990435570-c801dc052f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVZmZpemklMjBHYWxsZXJ5JTIwRmxvcmVuY2UlMjBpbnRlcmlvciUyMHJlbmFpc3NhbmNlfGVufDF8fHx8MTc2ODM2NDQyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exhibitions: [
      { 
        title: "Botticelli and the Medici", 
        category: "Renaissance", 
        year: "2024",
        description: "보티첼리와 메디치 가문. 르네상스 예술의 황금기를 이끈 후원자와 화가의 관계를 조명하는 특별전.",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3R0aWNlbGxpJTIwcGFpbnRpbmd8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.uffizi.it"
      },
      { 
        title: "Caravaggio and the 17th Century", 
        category: "Baroque", 
        year: "2024",
        description: "카라바조의 극적인 빛. 바로크 시대를 연 혁명적 화가의 명암법과 사실주의가 만들어낸 강렬한 드라마.",
        image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJhdmFnZ2lvJTIwcGFpbnRpbmd8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.uffizi.it"
      },
      { 
        title: "Leonardo da Vinci's Annunciation", 
        category: "Masterpiece", 
        year: "2024",
        description: "레오나르도의 수태고지. 천재의 초기작에 담긴 완벽한 원근법과 섬세한 자연 묘사를 감상하세요.",
        image: "https://images.unsplash.com/photo-1578926078627-cf68d0566c24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW9uYXJkbyUyMGRhJTIwdmluY2klMjBwYWludGluZ3xlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.uffizi.it"
      },
      { 
        title: "Titian's Women", 
        category: "Portraiture", 
        year: "2023",
        description: "티치아노가 그린 여성들. 베네치아 거장이 포착한 르네상스 여성의 아름다움과 위엄.",
        image: "https://images.unsplash.com/photo-1577720643272-265f8c0ced57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5haXNzYW5jZSUyMHBvcnRyYWl0fGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.uffizi.it"
      },
      { 
        title: "The Art of Sculpture", 
        category: "Sculpture", 
        year: "2023",
        description: "조각의 예술. 미켈란젤로부터 베르니니까지, 대리석에 생명을 불어넣은 거장들의 3차원 걸작.",
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5haXNzYW5jZSUyMHNjdWxwdHVyZXxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.uffizi.it"
      }
    ]
  },
  {
    id: 5,
    country: "JAPAN",
    city: "Tokyo",
    name: "Mori Art Museum",
    shortName: "MORI",
    description: "도쿄 타워가 내려다보이는 하늘 위 미술관. 동시대 아시아 예술의 중심.",
    image: "https://images.unsplash.com/photo-1759782526827-5fecfb5f2d9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JpJTIwQXJ0JTIwTXVzZXVtJTIwVG9reW8lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjgzNzU5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exhibitions: [
      { 
        title: "Our Ecology: Toward a Planetary Living", 
        category: "Contemporary", 
        year: "2024",
        description: "지구적 생태계를 향한 여정. 환경 위기 시대, 예술가들이 제시하는 지속 가능한 미래에 대한 비전과 실천.",
        image: "https://images.unsplash.com/photo-1767460775045-a0bf02c997af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBqYXBhbmVzZSUyMGFydCUyMGV4aGliaXRpb258ZW58MXx8fHwxNzY4Mzc1OTMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mori.art.museum"
      },
      { 
        title: "teamLab: World Unleashed", 
        category: "Digital Art", 
        year: "2024",
        description: "팀랩의 디지털 유토피아. 빛과 소리, 인터랙티브 기술이 만들어내는 경계 없는 예술 세계.",
        image: "https://images.unsplash.com/photo-1761735490180-225200bd71a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtTGFiJTIwZGlnaXRhbCUyMGFydCUyMGluc3RhbGxhdGlvbnxlbnwxfHx8fDE3NjgzNzU5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mori.art.museum"
      },
      { 
        title: "Shodo: The Art of Japanese Calligraphy", 
        category: "Traditional", 
        year: "2024",
        description: "서예의 정신. 먹과 붓이 만나 탄생하는 일본 서예의 아름다움과 선의 미학.",
        image: "https://images.unsplash.com/photo-1767298003694-5fb561ef4b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGNhbGxpZ3JhcGh5JTIwYXJ0fGVufDF8fHx8MTc2ODM3NTkzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mori.art.museum"
      },
      { 
        title: "Manga and Anime: Revolution of Japanese Pop Culture", 
        category: "Pop Culture", 
        year: "2023",
        description: "만화와 애니메이션의 혁명. 전 세계를 사로잡은 일본 팝 컬처의 역사와 미학을 조명합니다.",
        image: "https://images.unsplash.com/photo-1716085487003-217f0e459f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGFuaW1lJTIwYXJ0JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjgzNzU5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mori.art.museum"
      },
      { 
        title: "Ma: The Aesthetics of Japanese Space", 
        category: "Design", 
        year: "2023",
        description: "마(間)의 미학. 비움과 여백, 침묵이 만들어내는 일본 미니멀리즘의 공간 철학.",
        image: "https://images.unsplash.com/photo-1755018237843-2f47f470cf11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwamFwYW5lc2UlMjBkZXNpZ258ZW58MXx8fHwxNzY4Mzc1OTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mori.art.museum"
      }
    ]
  },
  {
    id: 6,
    country: "SOUTH KOREA",
    city: "Seoul",
    name: "Leeum Museum",
    shortName: "LEEUM",
    description: "전통과 현대가 교차하는 시간의 경계. 붉은 벽돌과 스테인리스 스틸의 조화.",
    image: "https://images.unsplash.com/photo-1708179504036-0f952912eac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMZWV1bSUyME11c2V1bSUyMFNlb3VsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2ODM2NDQyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exhibitions: [
      { 
        title: "Maurizio Cattelan: WE", 
        category: "Contemporary", 
        year: "2024",
        description: "마우리치오 카텔란의 아시아 최대 규모 회고전. 도발적이고 유머러스한 작품들을 통해 현대 사회를 날카롭게 비판하는 거장의 예술 세계.",
        image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcnQlMjBpbnN0YWxsYXRpb258ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.leeum.org"
      },
      { 
        title: "Joseon White Porcelain", 
        category: "Traditional", 
        year: "2024",
        description: "조선 백자의 순백의 아름다움. 500년 역사를 지닌 한국 도자기 예술의 정수를 만나는 특별전.",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBwb3JjZWxhaW58ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.leeum.org"
      },
      { 
        title: "Cloud Walkers", 
        category: "Installation", 
        year: "2023",
        description: "구름 위를 걷는 경험. 빛과 공간, 소리가 어우러진 몰입형 인스톨레이션 작품으로 새로운 감각의 여행을 떠나보세요.",
        image: "https://images.unsplash.com/photo-1549887534-1541e9326642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGFydCUyMGluc3RhbGxhdGlvbnxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.leeum.org"
      },
      { 
        title: "Arts of Korea", 
        category: "Permanent", 
        year: "2023",
        description: "한국 미술의 정수. 고려 불화부터 조선 회화까지, 천 년을 아우르는 한국 전통 미술의 정수를 상설 전시합니다.",
        image: "https://images.unsplash.com/photo-1582637506008-335c7ca66e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFydHxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.leeum.org"
      },
      { 
        title: "Interlace: Textile Art", 
        category: "Craft", 
        year: "2023",
        description: "직조의 예술. 전통 섬유 공예와 현대 텍스타일 아트가 만나 만들어내는 새로운 조형 언어를 탐험합니다.",
        image: "https://images.unsplash.com/photo-1601924357840-3c6b0f1685c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwYXJ0fGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.leeum.org"
      }
    ]
  },
  {
    id: 7,
    country: "UK",
    city: "London",
    name: "Tate Modern",
    shortName: "TATE",
    description: "산업 유산 위에서 피어난 현대 미술. 거대한 터빈 홀이 주는 압도적 스케일.",
    image: "https://images.unsplash.com/photo-1760213928402-8a6f2d3a2f0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUYXRlJTIwTW9kZXJuJTIwTG9uZG9uJTIwdHVyYmluZSUyMGhhbGwlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjgzNjQ0MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exhibitions: [
      { 
        title: "Yayoi Kusama: Infinity Mirror Rooms", 
        category: "Installation", 
        year: "2024",
        description: "쿠사마 야요이의 무한 거울방. 끝없이 펼쳐지는 점과 빛의 우주 속으로 들어가는 몰입형 경험.",
        image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrdXNhbWElMjBpbmZpbml0eSUyMG1pcnJvcnxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.tate.org.uk"
      },
      { 
        title: "Capturing the Moment", 
        category: "Painting", 
        year: "2024",
        description: "순간을 포착하다. 동시대 화가들이 붓으로 담아낸 현대 생활의 찰나와 감정.",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBwYWludGluZ3xlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.tate.org.uk"
      },
      { 
        title: "Hilma af Klint & Piet Mondrian", 
        category: "Abstract", 
        year: "2023",
        description: "추상미술의 선구자들. 힐마 아프 클린트와 몬드리안이 개척한 정신적이고 기하학적인 추상의 세계.",
        image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydHxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.tate.org.uk"
      },
      { 
        title: "Philip Guston", 
        category: "Contemporary", 
        year: "2023",
        description: "필립 거스턴 회고전. 추상에서 구상으로, 그리고 다시 돌아온 미국 현대미술의 거장.",
        image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGV4cHJlc3Npb25pc20lMjBwYWludGluZ3xlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.tate.org.uk"
      },
      { 
        title: "Turbine Hall Commission", 
        category: "Large Scale", 
        year: "2023",
        description: "터빈 홀의 거대한 예술. 압도적인 공간을 채우는 대형 설치 작품으로 새로운 감각을 경험하세요.",
        image: "https://images.unsplash.com/photo-1549887534-1541e9326642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXJnZSUyMHNjYWxlJTIwaW5zdGFsbGF0aW9ufGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.tate.org.uk"
      }
    ]
  },
  {
    id: 8,
    country: "USA",
    city: "New York",
    name: "The MoMA",
    shortName: "MOMA",
    description: "현대 미술의 심장. 끊임없이 질문을 던지는 가장 진보적인 예술의 최전선.",
    image: "https://images.unsplash.com/photo-1647792845543-a8032c59cbdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb01BJTIwTmV3JTIwWW9yayUyMG11c2V1bSUyMGludGVyaW9yfGVufDF8fHx8MTc2ODM2NDQxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exhibitions: [
      { 
        title: "Ed Ruscha / Now Then", 
        category: "Pop Art", 
        year: "2024",
        description: "에드 루샤의 60년 예술 여정. 팝 아트의 선구자가 보여주는 언어와 이미지, 미국 문화에 대한 독특한 시각.",
        image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBhcnQlMjBnYWxsZXJ5fGVufDB8fHx8MTczNjg2Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.moma.org"
      },
      { 
        title: "Picasso in Fontainebleau", 
        category: "Modernism", 
        year: "2024",
        description: "피카소의 여름. 1921년 퐁텐블로에서 그린 신고전주의 시기 작품들을 통해 거장의 또 다른 면모를 발견하세요.",
        image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWNhc3NvJTIwcGFpbnRpbmd8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.moma.org"
      },
      { 
        title: "Emerging Ecologies", 
        category: "Architecture", 
        year: "2024",
        description: "생태와 건축의 새로운 대화. 지속 가능한 미래를 위한 혁신적인 건축 디자인과 도시 계획을 제시합니다.",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzM2ODYyODc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.moma.org"
      },
      { 
        title: "New Photography 2023", 
        category: "Photography", 
        year: "2023",
        description: "사진의 새로운 지평. 동시대 사진가들이 포착한 우리 시대의 모습과 사진 매체의 무한한 가능성.",
        image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.moma.org"
      },
      { 
        title: "Signals: How Video Transformed the World", 
        category: "Media Art", 
        year: "2023",
        description: "비디오 아트의 혁명. 1960년대부터 현재까지, 영상 매체가 어떻게 세계를 변화시켰는지 탐구합니다.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGFydCUyMGluc3RhbGxhdGlvbnxlbnwwfHx8fDE3MzY4NjI4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        website: "https://www.moma.org"
      }
    ]
  }
];

// --- COMPONENTS ---

// Exhibition Detail Card Component (Left Side)
const ExhibitionCard = ({ exhibition }: { exhibition: ExhibitionDetail | null }) => {
  if (!exhibition) {
    return (
      <div className="sticky top-32 h-fit bg-[#0a0a0a] border border-white/10 p-8">
        <div className="flex items-center justify-center h-64 text-white/30 text-sm">
          전시회를 선택해주세요
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-32 h-fit bg-[#0a0a0a] border border-white/10">
      {/* Category Badge and Year */}
      <div className="p-6 pb-0 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 px-3 py-1.5 border border-white/20">
          {exhibition.category}
        </span>
        <span className="text-xs font-mono text-white/70">{exhibition.year}</span>
      </div>

      {/* Exhibition Image */}
      <div className="p-6">
        <div className="w-full h-48 overflow-hidden">
          <img
            src={exhibition.image}
            alt={exhibition.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Exhibition Details */}
      <div className="px-6 pb-6">
        <h3 className="text-xl font-light text-white mb-4 leading-tight">
          {exhibition.title}
        </h3>

        <div className="text-sm text-white/60 leading-relaxed mb-6">
          {exhibition.description.split('. ').map((sentence, index, array) => (
            <span key={index}>
              {sentence}{index < array.length - 1 && '.'}
              {index < array.length - 1 && <br />}
            </span>
          ))}
        </div>

        {/* Visit Website Button */}
        <a
          href={exhibition.website}
          target="_blank"
          rel="noopener noreferrer"
          className="interactive inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 text-xs tracking-wide"
        >
          <span>웹사이트 방문</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('.interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-exclusion"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <div className={`w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center ${isHovering ? 'scale-[3] opacity-50' : 'scale-100'}`} />
    </div>
  );
};

// List Item Component for Exhibition (Table Style)
const ExhibitionItem = ({ 
  title, 
  category, 
  year, 
  onClick,
  isSelected,
  isLast
}: { 
  title: string, 
  category: string, 
  year: string,
  onClick: () => void,
  isSelected?: boolean,
  isLast?: boolean
}) => (
  <div 
    onClick={onClick}
    className={`group interactive flex items-center justify-between py-4 border-white/10 hover:bg-white/5 transition-all cursor-pointer ${isSelected ? 'bg-white/5' : ''} ${isLast ? '' : 'border-b'}`}
  >
    <div className="flex-1 px-4">
      <h4 className="text-sm font-light text-white/90 group-hover:text-white transition-colors">{title}</h4>
    </div>
    <div className="flex-1 text-center px-4">
      <span className="text-xs uppercase tracking-[0.15em] text-white/40">{category}</span>
    </div>
    <div className="w-20 text-right px-4">
      <span className="text-xs font-mono text-white/50">{year}</span>
    </div>
  </div>
);

// 홈페이지 컴포넌트
const HomePage = () => {
  const navigate = useNavigate();
  const [introMode, setIntroMode] = useState(false);
  const [selectedExhibitions, setSelectedExhibitions] = useState<{[key: number]: Exhibition}>({});
  const [zoomProgress, setZoomProgress] = useState<{[key: number]: number}>({});
  const [activeSection, setActiveSection] = useState<number>(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Supabase 데이터 훅
  const { museums, loading, error } = useMuseums();

  // Scroll to Top 버튼 표시 여부
  useEffect(() => {
    const handleScrollForFab = () => {
      setShowScrollTop(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScrollForFab, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollForFab);
  }, []);

  // Scroll to Top 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initialize with first exhibition of each museum
  useEffect(() => {
    if (museums.length > 0) {
      const initial: {[key: number]: Exhibition} = {};
      museums.forEach(museum => {
        if (museum.exhibitions.length > 0) {
          initial[museum.id] = museum.exhibitions[0];
        }
      });
      setSelectedExhibitions(initial);
      if (museums.length > 0) {
        setActiveSection(museums[0].id);
      }
    }
  }, [museums]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 인트로 모드에서 스크롤바 숨기기
  useEffect(() => {
    if (introMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [introMode]);

  // Image scale effect on scroll
  useEffect(() => {
    if (introMode) return;

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[data-museum]');
      const progressState: {[key: number]: number} = {};
      
      sections.forEach((section) => {
        const museumId = parseInt(section.getAttribute('data-museum') || '0');
        const rect = section.getBoundingClientRect();
        const visualArea = section.querySelector('.visual-scroll-area') as HTMLElement;
        const imageWrapper = section.querySelector('.image-scale-wrapper') as HTMLElement;
        const imageElement = section.querySelector('.image-scale-wrapper img') as HTMLElement;
        const contentArea = section.querySelector('.content-slide-up') as HTMLElement;
        const heroOverlay = section.querySelector('.hero-text-overlay') as HTMLElement;
        
        if (!visualArea || !imageElement || !contentArea) return;
        
        const visualAreaHeight = visualArea.clientHeight;
        const sectionTop = rect.top;
        
        // Calculate scroll progress within the visual area (0 to 1)
        const scrollProgress = Math.max(0, Math.min(1, -sectionTop / visualAreaHeight));
        
        // Phase 1: Zoom out (first 50% of scroll)
        const zoomProgress = Math.min(scrollProgress * 2, 1);
        const scale = 1.4 - (zoomProgress * 0.4);
        imageElement.style.transform = `scale(${scale})`;
        
        // 텍스트는 항상 100% opacity 유지 (페이드아웃 제거)
        // heroOverlay opacity는 변경하지 않음
        
        // Dim image slightly during zoom
        if (imageWrapper) {
          const dimOpacity = zoomProgress * 0.3;
          imageWrapper.style.filter = `brightness(${1 - dimOpacity})`;
        }
        
        // Phase 2: Content slides up naturally with scroll (no transform needed)
        // 콘텐츠는 자연스러운 스크롤로 위로 올라옴
        
        // Store zoom progress for progress bar
        progressState[museumId] = zoomProgress;
        
        // Detect active section (when section is in the middle of viewport)
        const viewportMiddle = window.innerHeight / 2;
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          setActiveSection(museumId);
        }
      });
      
      setZoomProgress(progressState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [introMode]);

  // Scroll to section function
  const scrollToSection = (museumId: number) => {
    const section = document.querySelector(`section[data-museum="${museumId}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 로딩 상태
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

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">데이터를 불러오는데 실패했습니다.</p>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-white w-full min-h-screen font-sans selection:bg-white selection:text-black">
      <CustomCursor />

      {/* NOISE & GRAIN OVERLAY */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-50 mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center p-8 pointer-events-none">
        <div className="text-xs uppercase tracking-widest font-bold pointer-events-auto text-white">
          The Living Archive
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors pointer-events-auto cursor-pointer"
        >
          ADMIN
        </button>
      </header>

      {/* RIGHT NAVIGATION */}
      <nav className="fixed top-1/2 right-8 -translate-y-1/2 z-40 flex flex-col items-end gap-6">
        {museums.map((museum) => (
          <button
            key={museum.id}
            onClick={() => scrollToSection(museum.id)}
            className="interactive group flex items-center gap-3 transition-all"
          >
            <span 
              className={`text-xs uppercase tracking-widest transition-all duration-300 ${
                activeSection === museum.id 
                  ? 'text-white opacity-100' 
                  : 'text-white/40 opacity-0 group-hover:opacity-100'
              }`}
            >
              {museum.country}
            </span>
            <div 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === museum.id 
                  ? 'bg-white scale-150' 
                  : 'bg-white/30 scale-100'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* ==================== INTRO OVERLAY - 3D GLOBE ==================== */}
      {introMode && (
        <GlobeIntro 
          museums={museums} 
          onExplore={() => setIntroMode(false)}
          onMuseumClick={(museumId) => {
            setTimeout(() => {
              scrollToSection(museumId);
            }, 100);
          }}
        />
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main className={`transition-opacity duration-1000 ${introMode ? 'opacity-0' : 'opacity-100'}`}>
        
        {museums.map((museum, index) => (
          <section key={museum.id} className="relative w-full" data-museum={museum.id}>
            
            {/* 1. IMAGE AREA - 줌아웃 효과 */}
            <div className="visual-scroll-area relative w-full" style={{ height: '400vh' }}>
              {/* 고정 이미지 배경 */}
              <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
                <div 
                  className="image-scale-wrapper w-full h-full flex items-center justify-center"
                  style={{
                    willChange: 'transform'
                  }}
                >
                  <img 
                    src={museum.image} 
                    alt={museum.name}
                    className="w-full h-full object-cover"
                    style={{
                      willChange: 'transform'
                    }}
                  />
                </div>
                
                {/* Dimmed overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                
                <div className="hero-text-overlay absolute inset-0 flex flex-col justify-center items-center text-center p-4 pointer-events-none" style={{ willChange: 'opacity' }}>
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6 flex flex-col items-center"
                  >
                    <h2 className="text-6xl md:text-8xl font-light tracking-tight uppercase text-white">
                      {museum.country}
                    </h2>
                    <p className="text-xs tracking-[0.2em] uppercase text-white/70 mt-4">
                      {museum.name} · {museum.city}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="max-w-md text-sm font-light text-white leading-relaxed mb-6 text-center">
                      {museum.description.split('. ').map((sentence, index, array) => (
                        <span key={index}>
                          {sentence}{index < array.length - 1 && '.'}
                          {index < array.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-64 flex flex-col items-center gap-2">
                      <div className="w-full h-[1px] bg-white/20 relative overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 h-full bg-white transition-all duration-100 ease-out"
                          style={{ 
                            width: `${(zoomProgress[museum.id] || 0) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* 2. CONTENT AREA - 줌아웃 완료 후 sticky하게 top에 고정 */}
            <div className="content-slide-up relative z-20" style={{ height: '200vh' }}>
              <div className="sticky top-0 min-h-screen bg-[#0a0a0a]">
              <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
                  {/* Header */}
                  <div className="mb-12">
                    <div className="flex items-baseline justify-between border-b border-white/20 pb-3">
                      <h3 className="text-xl md:text-2xl font-serif italic text-white">Current Exhibitions</h3>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">SELECTED WORKS 2024-2025</span>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column - Exhibition Card */}
                    <div className="lg:col-span-4">
                      <ExhibitionCard exhibition={selectedExhibitions[museum.id] || museum.exhibitions[0]} />
                    </div>

                    {/* Right Column - Exhibition List */}
                    <div className="lg:col-span-8">
                      <div className="bg-[#0a0a0a] border border-white/10">
                        {museum.exhibitions.map((exh, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                          >
                            <ExhibitionItem 
                              title={exh.title}
                              category={exh.category}
                              year={exh.year}
                              onClick={() => {
                                setSelectedExhibitions(prev => ({
                                  ...prev,
                                  [museum.id]: exh
                                }));
                              }}
                              isSelected={selectedExhibitions[museum.id]?.title === exh.title}
                              isLast={i === museum.exhibitions.length - 1}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>
        ))}

        {/* FOOTER */}
        <footer className="w-full py-20 bg-black border-t border-white/10 flex flex-col items-center justify-center text-center text-white/30">
          <p className="text-xs uppercase tracking-widest mb-4">The Living Archive © 2026</p>
          <p className="font-serif italic text-lg">Art is not what you see, but what you make others see.</p>
        </footer>

      </main>

      {/* Scroll to Top FAB */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 
                   flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300
                   ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="맨 위로 스크롤"
      >
        <ArrowUp size={20} />
      </button>

      <style>{`
        .text-shadow-sm {
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
        }
      `}</style>
    </div>
  );
};

// 로그인 페이지 래퍼
const LoginPageWrapper = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 이미 로그인된 경우 어드민으로 이동
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <LoginPage 
      onLoginSuccess={() => navigate('/admin')} 
      onGoHome={() => navigate('/')} 
    />
  );
};

// 어드민 페이지 래퍼 (인증 체크)
const AdminPageWrapper = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="animate-spin" size={24} />
          <span>인증 확인 중...</span>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    return (
      <LoginPage 
        onLoginSuccess={() => navigate('/admin')} 
        onGoHome={() => navigate('/')} 
      />
    );
  }

  return <AdminPage onGoHome={() => navigate('/')} />;
};

// 메인 App 컴포넌트 (라우팅)
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPageWrapper />} />
      <Route path="/admin" element={<AdminPageWrapper />} />
    </Routes>
  );
};

export default App;
