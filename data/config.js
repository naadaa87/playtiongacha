/* =====================================================================
   플레이션 가챠샵 홈페이지 설정 파일
   ---------------------------------------------------------------------
   이 파일만 고치면 매장 정보, 연락 채널, 서비스 공개 여부가 모든 화면에 반영됩니다.
   - 따옴표("") 안의 글자만 바꾸세요. 비워 두면("") 해당 항목은 화면에서 숨기거나
     "확정 후 안내"로 표시됩니다. 임의의 시간·번호를 채우지 마세요.
   - true / false 는 스위치입니다. true = 켬, false = 끔.
   ===================================================================== */
window.PLT = {

  /* 브랜드 */
  brand: {
    name: "플레이션 가챠샵",
    nameEn: "PLAYTION CAPSULE TOY SHOP",
    slogan: "오늘의 최애를 만나고, 함께 즐기는 곳",
    sub: "좋아하는 가챠를 찾고, 사진으로 남기고, 같은 취향의 사람들과 나눠보세요.",
    club: "플레이션 컬렉터 클럽",
    hashtag: "#플레이션오늘의최애"
  },

  /* 사이트 주소 (Cloudflare Pages 배포 후 실제 주소로 바꾸세요. 공유 미리보기·사이트맵에 사용) */
  siteUrl: "https://playtion-gacha.pages.dev",

  /* 매장 정보 — 확정된 내용만 적습니다 */
  store: {
    address: "서울특별시 광진구 화양동 10-1",
    building: "건대 한아름 건물 1층",
    landmark: "건대입구역 일대",          // 가까운 역·출구가 확정되면 "건대입구역 ○번 출구 도보 ○분" 처럼 바꾸세요
    mapQuery: "서울특별시 광진구 화양동 10-1",
    hours: "",            // 예: "매일 10:00 – 24:00"  (비우면 "오픈 확정 후 안내")
    staffHours: "",       // 예: "직원 응대 13:00 – 21:00" (교환회·혜택 지급은 이 시간에만)
    holiday: "",          // 예: "연중무휴" 또는 "매월 첫째 주 월요일 휴무"
    payment: "",          // 예: "현금·카드·간편결제 (기기별 상이)"
    parking: "",          // 확인된 내용만. 비우면 표시하지 않음
    accessibility: "",    // 예: "1층 매장, 출입구 단차 없음" — 확인 후 작성
    machinesPlanned: "600대 이상",   // 설치 계획 수량. "서울 최대" 같은 비교 문구는 근거 확보 전 사용하지 않습니다
    openDate: ""          // 예: "2026-10-25" (오픈일이 확정되면 홈에 D-day가 표시됩니다)
  },

  /* 연락 채널 — 비워 두면 해당 버튼이 "준비 중"으로 표시됩니다 */
  contact: {
    phone: "",                     // 예: "02-000-0000"
    kakao: "",                     // 카카오톡 채널 주소 예: "https://pf.kakao.com/_xxxxx"
    instagram: "",                 // 예: "https://www.instagram.com/playtion_gacha"
    naverPlace: "",                // 네이버 플레이스 주소
    email: "",                     // 문의 메일 (비우면 메일 문의 버튼 숨김)
    responseNote: "운영시간 내 문의는 1영업일 안에 1차 답변드립니다."   // 실제 근무표에 맞춰 수정
  },

  /* 외부 링크 */
  links: {
    partyRoom: "https://playtion.pages.dev",   // 플레이션 게임파티룸 홈페이지
    exhibitForm: "",      // 한 칸 전시회 참여 신청 폼(네이버폼·구글폼 등) 주소
    swapForm: "",         // 교환품 접수 폼 주소 (비우면 행사 신청 안내로 연결)
    inquiryForm: ""       // 문의·고장 접수 외부 폼 주소 (비우면 사이트 내 문의 화면 사용)
  },

  /* 서비스 공개 스위치 — 실제로 운영 준비가 된 것만 true */
  features: {
    products: true,       // 상품 소개(대표 상품 목록)
    events: true,         // 행사 목록·상세
    swap: true,           // 중복 교환회 안내
    exhibit: true,        // 한 칸 전시회 안내
    photoSpot: true,      // 최애 촬영소 안내
    passport: true,       // 수집 패스포트 안내
    inquiry: true,        // 문의·고장 접수 화면
    login: false,         // 회원 로그인 (백엔드 연결 후 true)
    ugc: false,           // 회원 글쓰기 (2차)
    trade: false          // 온라인 거래 (3차·별도 사업)
  },

  /* 신청·문의 전송 주소
     - Cloudflare Worker 등 서버 주소를 넣으면 JSON으로 전송합니다.
     - 비워 두면 외부 폼(links.*) 또는 카카오 채널·메일로 안내합니다. */
  endpoints: {
    eventApply: "",       // 예: "https://playtion-api.example.workers.dev/apply"
    inquiry: ""           // 예: "https://playtion-api.example.workers.dev/inquiry"
  },

  /* 사업자 정보 (푸터) — 확정된 내용만 */
  business: {
    company: "주식회사 소셜패밀리",   // 운영 법인 확인 후 수정
    ceo: "최시준",
    regNo: "",                        // 사업자등록번호
    address: "서울특별시 광진구 화양동 10-1",
    privacyOfficer: ""                // 개인정보 보호책임자 (이름·연락처)
  },

  /* 분석 도구 (비우면 로드하지 않음). 이름·연락처 등 개인정보는 절대 전송하지 않습니다 */
  analytics: {
    ga4: "",              // 예: "G-XXXXXXXXXX"
    metaPixel: ""         // 예: "1234567890"
  }
};
