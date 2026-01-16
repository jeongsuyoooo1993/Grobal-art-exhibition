# Global Art Exhibition Website - 백엔드 설정 가이드

이 문서는 Supabase 백엔드 설정과 Vercel 배포를 위한 단계별 가이드입니다.

---

## 📋 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [데이터베이스 설정](#2-데이터베이스-설정)
3. [인증 설정](#3-인증-설정)
4. [환경변수 설정](#4-환경변수-설정)
5. [로컬 개발 환경 실행](#5-로컬-개발-환경-실행)
6. [Vercel 배포](#6-vercel-배포)

---

## 1. Supabase 프로젝트 생성

### 1.1 Supabase 계정 생성
1. [https://supabase.com](https://supabase.com) 접속
2. **Start your project** 클릭
3. GitHub 계정으로 로그인 (권장) 또는 이메일로 가입

### 1.2 새 프로젝트 생성
1. **New Project** 버튼 클릭
2. 다음 정보 입력:
   - **Name**: `global-art-exhibition` (원하는 이름)
   - **Database Password**: 안전한 비밀번호 생성 (나중에 필요하므로 저장)
   - **Region**: 가장 가까운 지역 선택 (예: Northeast Asia - Tokyo)
3. **Create new project** 클릭
4. 프로젝트 생성까지 약 2분 소요

---

## 2. 데이터베이스 설정

### 2.1 SQL 에디터에서 테이블 생성
1. Supabase 대시보드에서 **SQL Editor** 클릭 (왼쪽 메뉴)
2. **New query** 클릭
3. `src/lib/database.sql` 파일의 전체 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭 (또는 `Cmd/Ctrl + Enter`)
5. "Success. No rows returned" 메시지 확인

### 2.2 데이터 확인
1. **Table Editor** 클릭 (왼쪽 메뉴)
2. `museums` 테이블 클릭 → 8개 미술관 데이터 확인
3. `exhibitions` 테이블 클릭 → 40개 전시회 데이터 확인

---

## 3. 인증 설정

### 3.1 관리자 계정 생성
1. **Authentication** 클릭 (왼쪽 메뉴)
2. **Users** 탭 선택
3. **Add user** → **Create new user** 클릭
4. 다음 정보 입력:
   - **Email**: 관리자 이메일 (예: `admin@yoursite.com`)
   - **Password**: 안전한 비밀번호
   - **Auto Confirm User**: ✅ 체크
5. **Create user** 클릭

### 3.2 이메일 인증 설정 (선택사항)
기본적으로 이메일 확인이 필요합니다. 개발 중에는 비활성화할 수 있습니다:

1. **Authentication** → **Providers** 클릭
2. **Email** 확장
3. **Confirm email**: 필요에 따라 OFF 설정

---

## 4. 환경변수 설정

### 4.1 API 키 확인
1. **Settings** 클릭 (왼쪽 메뉴 하단 톱니바퀴)
2. **API** 클릭
3. 다음 값을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** 키: `eyJhbGc...` (긴 문자열)

### 4.2 로컬 환경변수 파일 생성
프로젝트 루트에 `.env` 파일 생성:

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일 내용:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **중요**: `.env` 파일은 절대 Git에 커밋하지 마세요! (`.gitignore`에 포함되어 있음)

---

## 5. 로컬 개발 환경 실행

### 5.1 의존성 설치
```bash
npm install
```

### 5.2 개발 서버 시작
```bash
npm run dev
```

### 5.3 테스트
1. 브라우저에서 `http://localhost:5173` 접속
2. 메인 페이지에서 미술관/전시회 데이터 확인
3. **ADMIN** 버튼 클릭 → 로그인 테스트
4. 관리자 페이지에서 CRUD 기능 테스트

---

## 6. Vercel 배포

### 6.1 Vercel 계정 설정
1. [https://vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인

### 6.2 프로젝트 배포
1. **Add New** → **Project** 클릭
2. GitHub 저장소 연결 (또는 **Import Git Repository**)
3. 프로젝트 선택

### 6.3 환경변수 설정 (중요!)
배포 설정 화면에서:

1. **Environment Variables** 섹션 확장
2. 다음 변수 추가:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here` |

3. **Deploy** 클릭

### 6.4 배포 확인
1. 배포 완료 후 제공된 URL 접속
2. 모든 기능 정상 작동 확인

---

## 🔧 문제 해결

### "Missing Supabase environment variables" 오류
- `.env` 파일이 프로젝트 루트에 있는지 확인
- 환경변수 이름이 정확한지 확인 (`VITE_` 접두사 필수)
- 개발 서버 재시작 (`npm run dev`)

### 데이터가 표시되지 않음
- Supabase 대시보드에서 테이블에 데이터가 있는지 확인
- RLS(Row Level Security) 정책이 올바르게 설정되었는지 확인
- 브라우저 개발자 도구에서 네트워크 오류 확인

### 로그인이 안 됨
- Supabase Authentication에서 사용자가 생성되었는지 확인
- 이메일 확인 설정 확인
- 올바른 이메일/비밀번호 입력 확인

### Vercel 배포 실패
- 환경변수가 Vercel 프로젝트에 설정되었는지 확인
- 빌드 로그에서 오류 메시지 확인

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── App.tsx              # 메인 앱 컴포넌트
│   └── components/
│       ├── AdminPage.tsx    # 관리자 페이지 (Supabase CRUD)
│       ├── LoginPage.tsx    # 로그인 페이지 (Supabase Auth)
│       └── ui/              # UI 컴포넌트
├── contexts/
│   └── AuthContext.tsx      # 인증 컨텍스트
├── hooks/
│   └── useMuseums.ts        # 데이터 페칭 훅
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트
│   └── database.sql         # 데이터베이스 스키마
└── types/
    └── database.ts          # TypeScript 타입 정의
```

---

## 🔐 보안 참고사항

1. **anon key**는 클라이언트에서 사용해도 안전합니다 (RLS로 보호됨)
2. **service_role key**는 절대 클라이언트에 노출하지 마세요
3. RLS 정책이 올바르게 설정되어 있는지 항상 확인하세요
4. 프로덕션에서는 이메일 확인을 활성화하는 것을 권장합니다

---

## 📞 지원

문제가 발생하면:
1. [Supabase 문서](https://supabase.com/docs)
2. [Vercel 문서](https://vercel.com/docs)
3. 프로젝트 이슈 트래커
