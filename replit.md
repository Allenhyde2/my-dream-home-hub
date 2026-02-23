# Korean Real Estate Information App (부동산 정보)

## Overview
A production-ready real estate information platform for the Korean market, featuring property listings, regional information, and user authentication.

## Tech Stack
- **Frontend**: Next.js 15 with React 18 and TypeScript (port 5000)
- **Backend**: Fastify with TypeScript (port 3001)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Replit Auth (supports Google, GitHub, email)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Next.js (Turbopack for dev)
- **State Management**: TanStack React Query
- **Routing**: Next.js App Router

## Project Structure
```
frontend/
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── layout.tsx  # Root layout with providers
│   │   ├── page.tsx    # Home page (/)
│   │   ├── onboarding/ # Onboarding page
│   │   ├── profile/    # Profile page
│   │   ├── creator/[id]/ # Creator profile page
│   │   ├── course/[courseId]/ # Course detail and lecture pages
│   │   └── ...         # Other pages
│   ├── components/     # Reusable UI components
│   │   └── ui/        # shadcn/ui components
│   ├── pages/         # Legacy page components (used by app router)
│   ├── hooks/         # Custom React hooks
│   │   ├── use-auth.ts    # Authentication hook
│   │   └── use-navigate.ts # Navigation compatibility layer
│   ├── lib/           # Utility functions
│   ├── data/          # Static data files
│   └── index.css      # Global styles
├── public/            # Static assets
├── next.config.mjs    # Next.js configuration
├── tailwind.config.ts # Tailwind configuration
└── package.json       # Frontend dependencies

backend/
├── prisma/
│   └── schema.prisma  # Database schema with User and Session models
├── src/
│   ├── server.ts      # Fastify server entry point (port 3001)
│   ├── routes/
│   │   ├── auth.ts    # Authentication routes
│   │   └── user.ts    # User profile routes
│   └── replit_integrations/auth/  # Auth module
└── package.json       # Backend dependencies

package.json           # Root package.json with concurrently scripts
```

## Development Servers
- **Frontend (Next.js)**: Port 5000 (user-facing, exposed to internet)
- **Backend (Fastify)**: Port 3001 (API server)

## Running the App
Development server (frontend + backend simultaneously):
```bash
npm run dev
```

Individual servers:
```bash
cd frontend && npm run dev    # Frontend only
cd backend && npm run dev     # Backend only
```

Database commands:
```bash
cd backend && npx prisma db push     # Sync schema
cd backend && npx prisma generate    # Generate client
cd backend && npx prisma studio      # Database GUI
```

## Authentication
- Users can log in with Google, GitHub, or email via Replit Auth
- Login: `/api/login`
- Logout: `/api/logout`
- Get current user: `/api/auth/user`

## Onboarding Flow
The app includes an 8-step onboarding process for new users:
1. **닉네임 설정**: Nickname input (2+ characters)
2. **거주 지역 검색**: Residence location with autocomplete (시/도, 구/군, 동)
3. **관심 지역 선택**: Target area selection (max 3 with priority order)
4. **매수 희망 시기**: Purchase timeline slider (1-12 months)
5. **매수 가용 자금**: Available funds range slider
6. **가구 유형**: Family type chips (max 3 selections)
7. **관심 분야**: Interest topics chips (max 5 selections)
8. **완료 화면**: Completion with 3000 reward points popup

### Data Files
- `frontend/src/data/koreanDistricts.ts`: Comprehensive Korean district data (시/도 → 구/군 → 동)

### API Endpoints
- `PATCH /api/user/profile`: Update user profile with Zod validation

## Asset Handling
- Hero banners use CSS gradients instead of image imports
- Creator avatars use empty strings with AvatarFallback components for placeholder display
- No external image assets required

## Personalized Content (PersonalizedContent.tsx)
Three sections based on user profile:
1. **목표 지역 맞춤 콘텐츠**: Content based on user's primary target area (district/dong)
2. **가족 형태 맞춤 콘텐츠**: Content based on user's family type (신혼부부, 1인가구, etc.)
3. **자금 상황 맞춤 콘텐츠**: Content based on user's available funds range

Each section shows:
- Customized title based on user's profile data
- 3 relevant content items with views/comments
- Contextual subtitle showing the criteria

## Creators List (CreatorsList.tsx)
- Tag-based filtering system with 11 tags: 전체, 재건축, 청약, 시세분석, 실수요, 분양, 교통호재, 경매, 신도시, 절세, 대출
- Each creator has multiple tags for filtering
- Horizontal scrollable list with verified badges
- Shows follower count and specialty
- Clicking a creator navigates to their profile page

## Creator Profile Page (CreatorProfile.tsx)
- Route: `/creator/:id`
- Header section with:
  - Avatar with verified badge
  - Name, specialty, bio
  - Follower count, experience, rating
  - Follow and message buttons
  - Tags for specialty areas
  - Professional certifications
- Three tabs:
  1. **메인 페이지**: Latest free content with views, likes, dates
  2. **유료 컨텐츠**: Premium content with prices and purchase buttons
  3. **일대일 온라인 상담**: Consulting options with booking system

### Consulting Booking System
- Calendar-based date selection (next 30 days)
- Time slot selection based on product type:
  - **30분 기본 상담**: 30-minute interval time slots
  - **1시간 심층 상담**: 60-minute interval time slots
  - **프리미엄 컨설팅**: 60-minute interval selection, requires 2-hour consecutive availability
- Non-overlapping reservation validation
- Booking hours: 09:00 ~ 18:00
- Confirmation dialog with reservation summary

### Data Files
- `frontend/src/data/creators.ts`: Creator data with id, name, avatar, specialty, tags, followers, rating, verified status, bio, experience, certifications

## User Dashboard Features

### Target Area Tabs (RegionalDashboard.tsx)
- Displays tabs for each of user's selected target areas (max 3)
- Sorted by priority order (1순위, 2순위, 3순위)
- Each tab shows related posts for that area
- Posts are sorted by newest first
- Shows location details (시/도 구/군 동) in tab content

### Purchase Timeline Countdown (PurchaseGoals.tsx)
- Displays target purchase date based on user's purchaseTimeline setting
- Countdown calculation:
  - If remaining days >= 15: round up to next month (+1)
  - If remaining days < 15: truncate to current month
- Shows remaining months as "n개월"
- Progress bar based on completed mission phases

### Auto-generated Mission Checklist
Based on Korean real estate purchase process, organized by timeline:

1. **금전 준비** (D-12개월 ~ D-10개월)
   - 총 매수 예산 설정
   - 신용점수 확인 및 관리
   - 청약통장 납입 현황 확인
   - 추가 비용 계산 (취득세, 중개수수료 등)

2. **대출 준비** (D-9개월 ~ D-7개월)
   - 주택담보대출 사전 상담
   - DSR/LTV 규제 확인
   - 대출 서류 준비
   - 대출 승인 조건 확인

3. **서류 준비** (D-6개월 ~ D-4개월)
   - 등기부등본 열람
   - 건축물대장 확인
   - 실거래가 조회
   - 매매계약서 검토
   - 인감증명서/주민등록등본 발급

4. **입주 준비** (D-3개월 ~ D-1개월)
   - 잔금 전 최종 점검
   - 잔금 납부 및 소유권 이전
   - 취득세 납부
   - 전입신고 및 확정일자
   - 공과금 명의 변경

## LMS (Learning Management System)

### Course Data Structure (frontend/src/data/courses.ts)
- 15 courses total, divided by skill level:
  - **초보 (Beginner)**: 5 courses for newcomers to real estate investing
  - **중수 (Intermediate)**: 5 courses for practical investment strategies
  - **고수 (Advanced)**: 5 courses for expert-level strategies
- Each course includes:
  - Title, description, instructor
  - Price with discount info
  - Rating, review count, student count
  - Total duration and lesson count
  - Detailed lesson list with individual durations
  - Tags for categorization

### Course Listing Section (CoursesSection.tsx)
- Level-based tab filtering (초보/중수/고수)
- Color-coded level indicators (green/blue/purple)
- Course cards with:
  - Level badge and tags
  - Rating, student count, duration
  - Price with discount percentage

### Course Detail Page (CourseDetail.tsx)
- Route: `/course/:id`
- Course hero section with level-colored background
- Pricing card with discount display
- Curriculum accordion with lesson list
- "수강 신청" (Enroll) button with payment dialog
- Simulated payment flow:
  - Payment method selection (카드/계좌이체)
  - Payment confirmation
  - Redirect to lecture page

### Course Lecture Page (CourseLecture.tsx)
- Route: `/course/:courseId/lecture/:lessonId`
- Video player interface with:
  - Sample video placeholder
  - Play/pause, volume, fullscreen controls
  - Progress bar with time display
  - Previous/next lesson navigation
- Sidebar with curriculum (desktop):
  - Progress tracking (completed/not completed)
  - Overall course progress percentage
  - Lesson navigation with duration
- Mobile navigation footer

### Profile Page (Profile.tsx)
- Route: `/profile`
- User info card with avatar
- Two tabs:
  - **수강 내역 (Learning History)**:
    - 이어보기 (Continue watching): In-progress courses with progress bars
    - 시작 전 (Not started): Enrolled but not started courses
    - 완료 (Completed): Finished courses with completion badge
  - **수료증 (Certificates)**: List of earned certificates
- Mock enrolled courses data for demonstration

### Navigation Updates
- Added "내 프로필" and "내 강의" menu items in user dropdown
- Profile accessible from header user menu

## My Reservations Page (MyReservations.tsx)
- Route: `/my-reservations`
- Two tabs: 예약 목록 (upcoming) and 이전 예약 (past)
- Upcoming reservations can be cancelled with confirmation dialog
- Completed consultations are clickable to view consultation report
- Shows reservation date, time, creator name, product name, and price

## Consultation Report Page (ConsultationReport.tsx)
- Route: `/consultation/:id/report`
- Displays comprehensive consultation summary with:
  - Creator info and consultation details (date, time, duration)
  - 상담 요약 (Summary)
  - 핵심 포인트 (Key Points) - numbered list
  - 추천 투자처 (Recommendations) - with location icons
  - 시장 분석 (Market Analysis)
  - 리스크 요인 (Risk Factors)
  - 실행 항목 (Action Items) - checklist style
  - 다음 단계 (Next Steps) - with follow-up consultation button
- PDF download button (mock functionality)

## My Certificates Page (MyCertificates.tsx)
- Route: `/my-certificates`
- Lists all earned certificates with course details
- Each certificate shows:
  - Course level badge with color
  - Certificate number and issue date
  - PDF download and verification link buttons
  - Option to review the course

## Recent Changes
- Jan 29, 2026: Fixed asset import errors by using CSS gradients for banners and empty strings for avatars
- Jan 29, 2026: Migrated to Next.js 15 + Fastify production architecture (from Vite + React + Express)
- Jan 29, 2026: Restructured project into separate frontend/ and backend/ directories
- Jan 29, 2026: Migrated from Drizzle ORM to Prisma ORM
- Jan 29, 2026: Added clickable stats in Profile (수강중/예약상담/수료증) with navigation to respective pages
- Jan 29, 2026: Added MyReservations page with upcoming/past tabs and cancellation
- Jan 29, 2026: Added ConsultationReport page with detailed consultation summary
- Jan 29, 2026: Added MyCertificates page for viewing earned certificates
- Jan 29, 2026: Enhanced Profile page with 4-tab structure (강의/상담/구매내역/수료증), refund for not-started courses, consultation cancellation, and purchase history detail page
- Jan 29, 2026: Added LMS with 15 courses, course detail page, lecture player, and profile learning history
- Jan 29, 2026: Added creator profile page with tabs (메인 페이지, 유료 컨텐츠, 일대일 온라인 상담)
- Jan 29, 2026: Added keyboard navigation for onboarding (Enter, Arrow keys, ESC)
- Jan 29, 2026: Added priority labels (1순위/2순위/3순위) to target area selection
- Jan 28, 2026: Added user dashboard with target area tabs, countdown, and mission checklist
- Jan 28, 2026: Implemented 8-step user onboarding with profile data collection
- Jan 28, 2026: Added Zod validation for profile API with max constraints
- Jan 28, 2026: Added redirect logic for users who haven't completed onboarding
- Jan 28, 2026: Added Google authentication with Replit Auth
- Jan 28, 2026: Migrated from Lovable to Replit environment

## User Preferences
- Language: Korean (한국어)
