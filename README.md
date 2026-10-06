# 플레이션 가챠샵 홈페이지

건대 한아름 건물 1층 플레이션 가챠샵의 공식 홈페이지입니다. 서버 없이 동작하는 정적 사이트라서 깃허브에 올리고 Cloudflare Pages에 연결하면 바로 공개됩니다. 내용 수정은 `data/` 폴더의 파일 다섯 개만 고치면 됩니다.

## 1. 폴더 구성

```
index.html        홈 (H01)
products.html     상품 찾기 — 검색·필터·취향 찾기·기기 번호로 찾기 (P01)
product.html      상품 상세 — 가격·기기 위치·확인 시각·매장 도식 (P02)
events.html       행사 목록 + 첫 8주 프로그램 (E01)
event.html        행사 상세 + 신청 (E02·E03)
swap.html         중복 교환회 안내 + 교환 카드 만들기 (S01 소개)
club.html         컬렉터 클럽 — 한 칸 전시·게시판 4종·수집 패스포트 (C01)
story.html        전시 글 상세 (C02)
visit.html        방문 안내 (V01)
help.html         처음 오셨나요 — 이용 순서·용어·촬영소·FAQ·문의/고장 접수
notices.html      공지사항
privacy.html      개인정보 처리 안내
rules.html        컬렉터 클럽 운영 규칙
404.html          없는 주소로 들어왔을 때

data/config.js    ★ 매장 정보·연락 채널·서비스 스위치·신청 전송 주소
data/products.js  ★ 대표 상품 목록
data/events.js    ★ 행사 목록·8주 프로그램
data/stories.js   ★ 한 칸 전시 글
data/notices.js   ★ 공지 (맨 위 공지가 노란 띠로 전 화면에 표시)

assets/css/style.css   디자인
assets/js/app.js       공통 동작 (설정값 반영·공지 띠·푸터·검색엔진용 정보)
assets/js/pages.js     화면별 동작 (검색·필터·신청 폼·문의 폼)
assets/img/            매장 사진·아이콘·공유 미리보기 이미지
_headers, robots.txt, sitemap.xml, site.webmanifest, favicon.svg
```

★ 표시된 다섯 파일만 고치면 모든 화면에 반영됩니다. HTML 파일은 손대지 않아도 됩니다.

## 2. 깃허브에 올리기

1. github.com 에 로그인 → 오른쪽 위 `+` → **New repository**
2. Repository name에 `playtion-gacha` 입력, Public 선택, **Create repository**
3. 만들어진 저장소 화면에서 **uploading an existing file** 링크 클릭
4. 압축을 푼 폴더 **안의 내용물 전부**(index.html, assets, data 등)를 드래그해서 올립니다. 폴더 자체가 아니라 폴더 안의 파일들을 올려야 `index.html`이 최상위에 놓입니다.
5. 아래 **Commit changes** 클릭

이후 내용을 고칠 때는 저장소에서 파일을 열고 연필 아이콘(Edit)으로 수정한 뒤 Commit 하면, 1~2분 안에 사이트에 반영됩니다.

## 3. Cloudflare Pages에 연결하기

1. dash.cloudflare.com 로그인 → 왼쪽 **Workers & Pages** → **Create** → **Pages** 탭 → **Connect to Git**
2. 깃허브 계정을 연결하고 `playtion-gacha` 저장소 선택
3. 빌드 설정은 아래처럼 두고 **Save and Deploy**
   - Framework preset: `None`
   - Build command: (비움)
   - Build output directory: `/` (또는 비움)
4. 1분쯤 뒤 `https://playtion-gacha.pages.dev` 같은 주소가 생깁니다.
5. 실제 주소가 정해지면 아래 세 곳의 `https://playtion-gacha.pages.dev` 를 실제 주소로 바꿔 주세요.
   - `data/config.js` 의 `siteUrl`
   - `robots.txt` 맨 아래 Sitemap 줄
   - `sitemap.xml` 전체 (편집기에서 모두 바꾸기)
   - 각 HTML 파일 상단의 canonical·og:url (편집기 ‘모두 바꾸기’로 한 번에)

자체 도메인(예: gacha.playtion.kr)을 쓰려면 Pages 프로젝트의 **Custom domains**에서 추가합니다.

## 4. 내용 고치는 법

### 매장 정보·연락처 — `data/config.js`
- 따옴표 안의 글자만 바꿉니다. `hours: ""` 처럼 비워 두면 화면에 **“오픈 확정 후 안내”** 로 표시되고, 값을 넣으면 그 값이 보입니다.
- `openDate: "2026-10-25"` 처럼 오픈일을 넣으면 홈에 D-day가 자동으로 표시됩니다.
- `contact.kakao` 에 카카오톡 채널 주소를 넣으면 모든 “문의” 버튼이 그 채널로 연결됩니다.
- `features` 의 `true/false` 로 아직 운영하지 않는 서비스를 숨길 수 있습니다.

### 상품 — `data/products.js`
- 처음에는 문의가 많은 대표 상품 30~50종만 올리면 됩니다. 600대 전체를 올릴 필요가 없습니다.
- 지금 들어 있는 16개는 모두 **예시**(`sample: true`)입니다. 실제 상품으로 바꾸면서 `sample: true,` 줄을 지우면 ‘예시’ 표시와 안내문이 사라집니다.
- 한 상품의 형식:
  ```
  { id: "p001", name: "상품명", series: "시리즈명", ip: "분류", price: 3000,
    loc: "A-03-2", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00",
    themes: ["책상 위 작은 장면"], desc: "설명", image: "assets/img/products/p001.jpg" },
  ```
- `status` 는 `sale`(판매중) / `soldout`(품절) / `check`(확인 필요). `checkedAt` 에서 24시간이 지나면 자동으로 ‘확인 오래됨’으로 바뀌므로, 매장에서 확인할 때마다 시각을 갱신해 주세요.
- 사진은 `assets/img/products/` 폴더에 올리고 경로를 적습니다. 정사각형(1:1)에 가까운 사진이 가장 잘 보입니다. 사진이 없으면 캡슐 그림이 대신 나옵니다.
- 위치 코드는 **구역-열-단**(예 `A-12-2`)입니다. 구역 설명은 같은 파일 위쪽 `zones` 에서 고칩니다.

### 행사 — `data/events.js`
- `status` 를 `planned`(일정 확정 후 모집) → `open`(모집중) 으로 바꾸고 `date: "2026-11-08"` 을 넣으면 모집이 열립니다.
- 신청을 받는 방법 두 가지
  1. **외부 폼**: 네이버폼·구글폼 주소를 그 행사의 `applyUrl` 에 넣습니다. 가장 간단합니다.
  2. **사이트 안 신청 화면**: `config.js` 의 `endpoints.eventApply` 에 서버 주소(Cloudflare Worker 등)를 넣으면 신청 폼이 사이트 안에 열립니다. 서버는 JSON을 받아 `{ "status": "pending" | "confirmed" | "waitlist" | "full" | "duplicate", "id": "..." }` 로 답하면 됩니다. 이메일 인증과 정원 확인은 이 서버에서 처리합니다.
  - 둘 다 비어 있으면 “온라인 신청 준비 중”과 문의 채널이 표시됩니다. 작동하지 않는 버튼은 생기지 않습니다.
- 종료된 행사는 `status: "ended"` 로 바꾸면 ‘지난 행사’로 내려갑니다.

### 한 칸 전시 글 — `data/stories.js`
- 파일 안에 작성 예시가 주석으로 들어 있습니다. 게시 동의를 받은 작품만 올리고, 운영자가 쓴 글은 `isStaff: true` 로 표시합니다.
- 목록이 비어 있으면 “첫 전시를 준비하고 있어요”가 자동으로 표시됩니다.

### 공지 — `data/notices.js`
- 맨 위 항목이 최신입니다. `bar: true` 인 공지 하나가 모든 화면 위 노란 띠에 나옵니다. 띠를 없애려면 `bar: false` 로 바꿉니다.

### 문의·고장 접수 — `help.html`
- `config.js` 의 `endpoints.inquiry` 에 서버 주소가 있으면 사진 첨부와 함께 서버로 전송됩니다.
- 비어 있으면 작성 내용을 복사해 카카오톡 채널·메일로 보내도록 안내합니다(`contact.kakao`, `contact.email` 기준).

### 사진 바꾸기 — `assets/img/`
- `store-front.webp`(외관), `interior.webp`(내부 전경), `wall-play.webp`, `wall-collect.webp`(벽면) 네 장이 쓰입니다. 같은 이름으로 덮어쓰면 됩니다. 가로 1600~1800px, 500KB 이하를 권합니다.
- `og.jpg`(1200×630)는 카카오톡·인스타그램에 링크를 공유할 때 보이는 미리보기 이미지입니다.

## 5. 공개 전 확인

- [ ] `config.js` 의 운영시간·휴무·결제 방식·연락 채널을 실제 확정값으로 입력 (모르면 비워 두기 — 임의로 채우지 않기)
- [ ] 사업자 정보(`business`)와 개인정보 보호책임자 확인
- [ ] 예시 상품 16개를 실제 대표 상품으로 교체하고 `sample: true` 제거
- [ ] 위치 코드가 매장 라벨과 같은지 현장에서 표본 점검
- [ ] ‘서울 최대’ 같은 비교 표현은 동일 기준의 근거를 확보하기 전까지 쓰지 않기 (지금 사이트에는 들어 있지 않습니다)
- [ ] 행사는 일정·정원·담당자가 확정된 것만 `open` 으로
- [ ] 공유 미리보기 확인: 카카오톡 대화창에 사이트 주소를 보내 이미지·제목이 보이는지

## 6. 다음 단계에서 붙일 것

- 행사 신청·문의 서버(Cloudflare Workers + Supabase): 이메일 일회 링크 인증, 정원 확인, 대기 승급, 체크인 QR
- 회원 로그인과 개인 도감(2차): `features.login`, `features.ugc` 스위치를 켜면 관련 안내가 열립니다
- 상품 QR: 기기마다 `product.html?id=상품ID` 주소를 QR로 인쇄하면 현장에서 바로 그 상품 안내가 열립니다. 상품이 바뀌어도 QR은 그대로 두고 `products.js` 의 `loc` 만 고치면 됩니다
