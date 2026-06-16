# Our_real_trip ✈️

항공권·숙소·투어티켓·여행용품·패키지 상품을 조회하고 예약·결제할 수 있는 **여행 예약 웹 애플리케이션**입니다.
React 클라이언트가 Axios로 Express REST API를 호출하고, 서버는 Controller–Service–Model 구조로 요청을 처리해 Mongoose로 MongoDB에 저장합니다.

> **Status:** ✅ 완료 (2025.02.03 ~ 2025.03.14)
> **Type:** 팀 프로젝트 (4명, 풀스택)

<!-- 기술 스택 뱃지 (실제 사용 기술 기준) -->
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-433E38)
![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8-880000?logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-OAuth-34E27A?logo=passport&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?logo=socketdotio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?logo=githubactions&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/AWS_EC2-Deploy-FF9900?logo=amazonec2&logoColor=white)

---

## 📌 프로젝트 배경

여행을 준비할 때 항공권·숙소·투어·여행용품을 각각 다른 곳에서 알아봐야 하는 번거로움을 하나의 플랫폼에서 해결해보자는 목표로 시작했습니다.
상품 조회부터 예약 생성, 실제 결제(포트원/아임포트) 검증, 쿠폰·마일리지 적립까지 이어지는 **end-to-end 예약 흐름**을 직접 구현하면서, 인증·결제·실시간 알림 같은 실서비스에 가까운 기능을 경험하는 데 중점을 두었습니다.

---

## ✨ 주요 기능

- 🔐 **인증/회원** — 회원가입·로그인·로그아웃·프로필 조회/수정·비밀번호 변경/재설정·아이디 찾기(이메일 인증코드)
- 🌐 **소셜 로그인** — Google · Kakao · Naver · Facebook (Passport 전략)
- 🛡️ **JWT 인증 유지** — Access/Refresh 토큰 + httpOnly 쿠키, 401 응답 시 클라이언트 Axios 인터셉터로 토큰 자동 갱신
- 👥 **역할 기반 접근 제어** — `user`/`admin` 역할 미들웨어로 관리자 API·페이지 제한
- 🏨 **상품** — 항공권 / 숙소·객실 / 투어티켓 / 여행용품 / 패키지 조회·검색·상세 및 관리자 CRUD, 이미지 업로드
- 🧾 **예약/결제** — 예약 생성 → 아임포트 결제 요청 → **서버에서 포트원 결제 금액 검증** → 재고·객실 예약일·결제 상태·마일리지·쿠폰 사용 상태 갱신, 예약 취소 시 복구
- 🎟️ **쿠폰/마일리지** — 쿠폰 생성·발급·멤버십별 조회·내 쿠폰 조회, 마일리지 적립/사용 내역 관리
- ⭐ **커뮤니티** — 즐겨찾기 토글, Q&A(댓글·첨부파일), 리뷰(댓글·좋아요·베스트 리뷰)
- 🔔 **실시간 알림** — Socket.IO 실시간 알림 수신/목록/전체 읽음, 관리자 전체 발송, 예약 리마인더 스케줄링
- 🗺️ **부가 기능** — Google Maps 숙소 지도, Daum 우편번호, ChannelTalk 상담, 이메일 발송(Nodemailer)

---

## 🛠️ 기술 스택

> 아래 항목은 모두 `package.json` 의존성 및 실제 코드 사용 기준입니다.

### Frontend
- **React 18** (Create React App + **CRACO**), **React Router DOM 7**
- **Zustand**(상태 관리), **Axios**(공통 인스턴스)
- **MUI 6** + **Emotion**, **Bootstrap 5** + React Bootstrap, FontAwesome, React Icons
- React Slick / Slick Carousel, React Slider, React Datepicker, React Modal
- `@react-google-maps/api`, `react-daum-postcode`, `@react-oauth/google`, `socket.io-client`

### Backend
- **Node.js 18**, **Express 4**
- **Mongoose 8** / MongoDB Driver 6
- 인증: **jsonwebtoken**, **bcrypt**, **cookie-parser** (httpOnly 쿠키 + Refresh Token)
- 소셜 로그인: **Passport** (`passport-google-oauth20`, `passport-kakao`, `passport-naver`, `passport-facebook`)
- 실시간: **Socket.IO**
- 파일 업로드: **multer**, **connect-busboy**
- 메일: **Nodemailer**, 스케줄러: **node-cron**, **node-schedule**
- 기타: cors, dotenv, morgan, body-parser, moment-timezone, uuid, axios

### Database
- **MongoDB** (Mongoose ODM) — 19개 모델 (User, Booking, Payment, Coupon, Review, Notification 등)

### 외부 API / 서비스
- **PortOne(아임포트)** 결제 — `api.iamport.kr` 토큰 발급 + 결제 금액 서버 검증
- **Google Maps API** (숙소 지도), **Daum Postcode** (주소 검색)
- **ChannelTalk** (상담), **Gmail SMTP** (Nodemailer)
- **공공데이터 공항 항공편 OpenAPI** — `server/scripts/fetchDomesticFlights.js`로 Flight 모델 적재 *(SERVICE_KEY 필요)*

### Infrastructure / DevOps
- **Docker** (`server/Dockerfile`, `node:18`) + **Docker Compose** (backend + MongoDB)
- **GitHub Actions** — `develop` 브랜치 push 시 SSH로 **AWS EC2** 배포 (`appleboy/ssh-action`)

---

## 📂 프로젝트 구조

```
our_real_trip/
├── client/                     # Frontend (React 18 + CRACO, 포트 3000)
│   └── src/
│       ├── api/                # 도메인별 API 모듈 + 공통 Axios 인스턴스(axios.js)
│       ├── components/         # 도메인별 UI 컴포넌트, 헤더/사이드바/알림/채널톡 등
│       ├── pages/              # 라우트 페이지 (auth, accommodations, booking, ...)
│       ├── routes/             # PrivateRoute (인증 보호 라우트)
│       ├── store/              # Zustand 스토어 (authStore, notificationStore)
│       ├── contexts/ hooks/ utils/ styles/
│       └── App.js
│
├── server/                     # Backend (Express + Mongoose, 포트 5000)
│   ├── index.js                # 진입점: app.listen + Socket.IO + node-cron 스케줄러
│   ├── app.js                  # Express 설정, CORS 화이트리스트, 라우트 등록
│   ├── config/                 # db, passport, socket, cookieConfig, emailConfig
│   ├── routes/                 # 도메인별 라우터 (auth, booking, accommodation, ...)
│   ├── controllers/            # 요청 처리 (Controller)
│   ├── services/               # 비즈니스 로직 (Service)
│   ├── models/                 # Mongoose 스키마 (Model)
│   ├── middleware/             # authMiddleware, authorizeRoles, uploadMiddleware
│   ├── scripts/                # fetchDomesticFlights.js, seedDemoData.js
│   ├── utils/                  # sendVerificationEmail 등
│   └── Dockerfile
│
├── docker-compose.yml          # backend + mongodb (client는 미포함)
└── .github/workflows/deploy.yml# EC2 배포 워크플로우
```

**아키텍처:** `React (Axios) → Express REST API → Controller → Service → Model(Mongoose) → MongoDB`

---

## 🚀 실행 방법

### 1) 사전 요구사항
- Node.js 18+ (Dockerfile 기준 18)
- Docker Desktop (MongoDB 실행용) — 또는 로컬 MongoDB

### 2) 저장소 클론 & 의존성 설치
```bash
git clone https://github.com/kimminhyuk-dev/our_real_trip.git
cd our_real_trip

# 서버
cd server && npm install

# 클라이언트
cd ../client && npm install
```

### 3) 환경변수 설정
`.env.example`을 복사해 `.env`를 만들고 값을 채웁니다. **실제 키/비밀번호는 절대 커밋하지 마세요** (`.env`는 `.gitignore` 처리됨).

**server/.env** (`server/.env.example` 참고)
```dotenv
# 기본 실행
SERVER_PORT=5000
CLIENT_PORT=3000
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# MongoDB (필수) — docker-compose 사용 시 계정 ort/ort
DB_URI=mongodb://ort:ort@localhost:27017/ort?authSource=admin

# JWT (필수)
JWT_SECRET=<YOUR_JWT_SECRET>
REFRESH_TOKEN_SECRET=<YOUR_REFRESH_TOKEN_SECRET>
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# 소셜 로그인 (서버 기동에 필수 — 비어 있으면 Passport 설정에서 크래시.
#               실제 사용 안 해도 더미 문자열로 채워야 서버가 뜸)
FACEBOOK_APP_ID=<PLACEHOLDER>
FACEBOOK_APP_SECRET=<PLACEHOLDER>
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
NAVER_CLIENT_ID=<PLACEHOLDER>
NAVER_CLIENT_SECRET=<PLACEHOLDER>
NAVER_REDIRECT_URI=http://localhost:5000/api/auth/naver/callback
KAKAO_CLIENT_ID=<PLACEHOLDER>
KAKAO_CLIENT_SECRET=<PLACEHOLDER>
KAKAO_REDIRECT_URI=http://localhost:5000/api/auth/kakao/callback
GOOGLE_CLIENT_ID=<PLACEHOLDER>
GOOGLE_CLIENT_SECRET=<PLACEHOLDER>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# 이메일 발송 (선택)
EMAIL_USER=<YOUR_EMAIL>
EMAIL_PASS=<YOUR_EMAIL_APP_PASSWORD>

# 포트원(아임포트) 결제 (선택)
PORTONE_API_KEY=<YOUR_PORTONE_API_KEY>
PORTONE_API_SECRET=<YOUR_PORTONE_API_SECRET>

# 항공편 OpenAPI 적재 스크립트 사용 시 (선택)
# SERVICE_KEY=<YOUR_PUBLIC_DATA_SERVICE_KEY>
```

**client/.env** (`client/.env.example` 참고)
```dotenv
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_GOOGLE_MAPS_API_KEY=<YOUR_GOOGLE_MAPS_API_KEY>
```

### 4) 실행

**방법 A — MongoDB만 Docker로 띄우고 서버/클라이언트는 로컬 (권장 개발 패턴)**
```bash
docker compose up -d mongodb     # MongoDB(27017)

cd server && npm run dev          # nodemon (또는 npm start)
cd client && npm start            # CRACO dev server (3000)
```

**방법 B — backend + MongoDB를 Docker로 함께 실행**
```bash
# 이 경우 server/.env 의 DB_URI host를 서비스명으로:
#   DB_URI=mongodb://ort:ort@mongodb:27017/ort?authSource=admin
docker compose up -d              # backend(5000) + mongodb(27017)

cd client && npm start            # client는 항상 로컬 실행 (compose 미포함)
```

접속: 프론트 `http://localhost:3000` · API `http://localhost:5000/api`

### 5) (선택) 시연용 더미 데이터
```bash
cd server
node scripts/seedDemoData.js          # 데모 데이터 생성/갱신 (upsert — 중복 실행 안전)
node scripts/seedDemoData.js --reset  # 데모 데이터만 삭제 후 재생성
```
> 결정적(deterministic) `_id`로 생성되어 재실행해도 중복이 쌓이지 않으며, 외부 API(결제/소셜로그인/이메일)는 호출하지 않고 DB 문서만 생성합니다.

---

## 🔒 보안 구현

> 코드에서 실제로 적용된 항목입니다.

- **비밀번호 해싱** — bcrypt(`saltRounds=10`)로 저장, 응답 시 `select('-password')`로 제외
- **JWT Access/Refresh 토큰** — Refresh 토큰은 DB(`RefreshToken`)에 저장·대조하여 무효화 가능, 재발급 시 회전(rotate)
- **httpOnly 쿠키** — `secure`/`sameSite`를 `NODE_ENV` 기준으로 분기(프로덕션 `secure: true`, `sameSite: 'None'`)
- **역할 기반 접근 제어** — `authMiddleware` + `authorizeRoles('admin')`로 관리자 API 보호
- **CORS 화이트리스트** — 허용 Origin만 통과, `credentials: true`로 쿠키 인증
- **결제 위변조 방지** — 클라이언트 결제 후 서버가 포트원 API로 실제 결제 금액을 재조회해 서버 계산 금액과 대조(불일치 시 예약 실패)
- **비밀번호 재설정 토큰** — `crypto.randomBytes`로 생성 후 bcrypt 해시 저장, 1시간 만료
- **시크릿 분리** — 모든 키/비밀번호는 `.env`(gitignore)로 관리, 저장소 이력에 미포함

---

## 🗺️ 구현 현황 / 로드맵

### 완료
- [x] 회원/인증 (가입·로그인·로그아웃·프로필·비밀번호·아이디 찾기)
- [x] 소셜 로그인 4종 (Google/Kakao/Naver/Facebook)
- [x] JWT Access/Refresh + Axios 인터셉터 토큰 자동 갱신
- [x] 역할 기반(user/admin) 라우팅·API 접근 제어
- [x] 항공권/숙소/투어/여행용품/패키지 조회·검색·상세 및 관리자 CRUD
- [x] 예약 생성/취소/상세 + 포트원 결제 서버 검증
- [x] 쿠폰·마일리지 적립/사용/복구
- [x] 즐겨찾기, Q&A, 리뷰(댓글·좋아요)
- [x] Socket.IO 실시간 알림 + 예약 리마인더 스케줄러
- [x] Docker Compose 구성 + GitHub Actions EC2 자동 배포

### 개선 예정 (회고 기반)
- [ ] 항공편 OpenAPI **주기적 배치 수집** + 관리자 화면에서 데이터 확인
- [ ] 관리자 등급(A/B/C) 세분화 및 권한별 기능 분리
- [ ] 삭제 등 주요 작업에 대한 **관리 로그(관리자 ID·IP·시각) 추적** 기능
- [ ] 반복되는 공통 코드 정리/리팩터링

---

## 🧩 트러블슈팅 — 배포 환경 API 통신 / 인증 오류

**문제**
로컬에서는 동작하던 로그인 등 Axios 요청이 배포 환경에서 인증·API 통신 과정에서 실패했습니다.

**원인**
각 API 파일이 `axios`를 직접 import해 사용하고 있어, 배포 환경에 맞는 **API 주소(baseURL)**·**인증 쿠키 전송(withCredentials)**·**공통 헤더** 설정을 일관되게 적용하기 어려웠습니다. 배포 과정의 요청 경로·쿠키 보안 설정·Docker 환경변수/포트 불일치도 겹쳐 문제가 발생했습니다.

**해결**
프로젝트 전용 **공통 Axios 인스턴스**([client/src/api/axios.js](client/src/api/axios.js))를 만들어 `baseURL`·`withCredentials: true`·인터셉터를 한 곳에서 관리하도록 정리했습니다. 이후 모든 API 모듈이 설치된 `axios`를 직접 import하지 않고 이 공통 모듈을 import하도록 변경했습니다.

```js
// client/src/api/axios.js (요약)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 20000,
  withCredentials: true, // httpOnly 쿠키 전송
});

// 401 발생 시 refresh-token으로 자동 재발급 후 원 요청 재시도 (요청 큐로 중복 갱신 방지)
api.interceptors.response.use(res => res, async error => { /* refresh & retry */ });
```

이를 통해 환경에 상관없이 동일한 요청 설정이 적용되도록 만들어 로그인 인증 및 API 통신 문제를 해결했습니다.

---

## 👤 팀 구성 / 담당

- **팀 구성:** 4명 (풀스택)
- **담당 (본인):** 로그인 및 계정 관리, 패키지 상품 관리, 상품 즐겨찾기, 공통 Axios 인스턴스 구성, 배포 환경 API 통신 오류 개선
- TODO: 위 항목별 세부 기여 내용·기간·협업 방식 보강

---

## 🖼️ 시연

TODO: 스크린샷 / 데모 영상 / 배포 링크 추가
- 배포 URL: TODO (운영 도메인 `https://ourrealtrip.shop` — 라이브 여부 확인 후 기재)
- 주요 화면 캡처: 메인 / 상품 상세 / 예약·결제 / 관리자 / 실시간 알림

---

## 💡 회고

프로젝트 기간이 짧아 핵심 기능 구현에 집중하다 보니 세부 완성도와 운영 관점의 기능을 충분히 보완하지 못한 점이 아쉬웠습니다. 시간이 더 주어진다면 항공편 API 데이터를 주기적으로 수집하는 배치 기능, 관리자 등급별 권한 분리, 삭제 등 주요 작업에 대한 추적 가능한 관리 로그 기능을 추가해 **단순 기능 구현을 넘어 실제 운영 환경의 안정성과 관리 편의성까지** 고려하는 방향으로 발전시키고 싶습니다.

---

## ⚠️ 면책 조항

- 본 저장소는 **개인 포트폴리오 및 학습 목적**으로 공개됩니다.
- 결제(포트원/아임포트), 소셜 로그인, 지도, 공공데이터 항공편 OpenAPI 등 **외부 API의 키는 포함되어 있지 않으며**, 해당 데이터의 무단 재배포를 금지합니다.
- 실제 결제·개인정보 처리를 위한 상용 서비스가 아니며, 시연 데이터는 더미 데이터입니다.

---

## 🔗 Link

- GitHub: https://github.com/kimminhyuk-dev/our_real_trip
