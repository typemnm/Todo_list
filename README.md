# Stellar Observer

A space-themed full-stack Todo application with a cosmic UI.

## Tech Stack

**Frontend:** React 19 + TypeScript · Vite · Tailwind CSS · React Router · TanStack React Query

**Backend:** Express + TypeScript · MongoDB Atlas + Mongoose · REST API

**Testing:** Vitest + React Testing Library · Playwright (E2E) · Jest + Supertest

**Deployment:** Vercel (기본) · Docker (셀프호스트)

---

## 프로젝트 구조

```
Todo_list/
├── frontend/           # React 프론트엔드
│   ├── src/
│   │   ├── components/ # 재사용 UI 컴포넌트
│   │   ├── pages/      # 라우트 페이지
│   │   ├── hooks/      # 커스텀 훅
│   │   ├── services/   # API 클라이언트
│   │   └── types/      # TypeScript 타입
│   └── e2e/            # Playwright E2E 테스트
├── backend/            # Express 백엔드
│   └── src/
│       ├── config/     # DB 설정
│       ├── models/     # Mongoose 모델
│       └── routes/     # API 라우트
├── api/                # Vercel 서버리스 함수
├── vercel.json         # Vercel 배포 설정
└── docker-compose.yml  # Docker 로컬 실행
```

---

## 로컬 개발 환경 설정

### 사전 조건

- Node.js 18+
- npm 9+
- MongoDB Atlas 계정 (또는 로컬 MongoDB)

### 설치

```bash
# 1. 저장소 클론
git clone <repo-url>
cd Todo_list

# 2. 전체 의존성 설치 (npm workspaces)
npm install
```

### 환경변수 설정

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**`backend/.env`**
```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/stellar-observer
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3000/api
```

### 개발 서버 실행

```bash
# backend(:3000) + frontend(:5173) 동시 실행
npm run dev

# 개별 실행
npm run dev:backend
npm run dev:frontend
```

브라우저에서 http://localhost:5173 접속

---

## 테스트

```bash
# 전체 테스트
npm test

# 프론트엔드 단위 테스트
npm run test --workspace=frontend

# 백엔드 API 테스트
npm run test --workspace=backend

# E2E 테스트 (개발 서버 실행 상태에서)
cd frontend && npm run test:e2e
```

---

## 배포

### Vercel 배포 (권장)

`api/index.ts` 서버리스 함수와 `frontend/` 정적 빌드를 하나의 프로젝트로 배포합니다.

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포 (최초 1회 — 프로젝트 연결)
vercel

# 환경변수 등록
vercel env add MONGODB_URI       # MongoDB Atlas 연결 문자열
vercel env add ALLOWED_ORIGINS   # https://your-app.vercel.app
vercel env add NODE_ENV          # production

# 프로덕션 배포
vercel --prod
```

**Vercel 환경변수 (대시보드에서 설정해도 됨)**

| 변수 | 값 |
|------|----|
| `MONGODB_URI` | `mongodb+srv://...` |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `NODE_ENV` | `production` |
| `VITE_API_URL` | `/api` (상대 경로) |

**트래픽 흐름**
```
https://your-app.vercel.app/api/* → api/index.ts (서버리스)
https://your-app.vercel.app/*    → frontend/dist  (정적)
```

---

### Docker 배포 (셀프호스트)

```bash
# 1. 환경변수 준비
cp backend/.env.example backend/.env
# backend/.env의 MONGODB_URI 등 수정

# 2. 빌드 및 실행
docker compose up -d --build

# 3. 상태 확인
docker compose ps
docker compose logs -f backend
```

**포트**

| 서비스 | 포트 |
|--------|------|
| 프론트엔드 | `http://localhost:80` |
| 백엔드 API | `http://localhost:3000` |
| MongoDB | `localhost:27017` |

> `docker compose down -v` 로 컨테이너 + 볼륨 삭제

---

## API

Base URL: `/api/todos`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/todos` | 전체 목록 조회 |
| POST | `/api/todos` | 새 Todo 생성 |
| PATCH | `/api/todos/:id` | 완료 토글 |
| DELETE | `/api/todos/:id` | 삭제 |

**Todo 생성 예시**

```bash
POST /api/todos
Content-Type: application/json

{ "title": "Learn TypeScript", "priority": "high" }
```

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Learn TypeScript",
    "completed": false,
    "priority": "high",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 화면 구성

| 화면 | 경로 | 설명 |
|------|------|------|
| Dashboard | `/` | 별자리 시각화 + 통계 |
| List | `/list` | 할일 목록 (완료 토글, 삭제) |
| Add Todo | `/add` | 새 할일 추가 |
| Settings | `/settings` | UI 커스터마이징 |

---

## 디자인 시스템

| 항목 | 값 |
|------|----|
| Background | `#111417` |
| Primary | `#ccc6b4` |
| Secondary | `#bdc2ff` |
| Tertiary | `#d8bbf4` |
| Headline font | Manrope |
| Body font | Inter |
| Label font | Space Grotesk |
