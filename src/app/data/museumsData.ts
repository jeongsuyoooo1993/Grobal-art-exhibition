// Exhibition Detail Interface
export interface ExhibitionDetail {
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  website: string;
}

export interface Museum {
  id: number;
  country: string;
  city: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  exhibitions: ExhibitionDetail[];
}

export const MUSEUMS: Museum[] = [
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
  // ... 나머지 7개 미술관 데이터는 기존 App.tsx에서 그대로 사용
];
