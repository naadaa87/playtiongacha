/* =====================================================================
   대표 상품 목록 (P01·P02 화면)
   ---------------------------------------------------------------------
   - 처음에는 문의가 많은 대표 상품 30~50종만 등록합니다. 600대 전체를 올리지 않아도 됩니다.
   - 아래 항목은 모두 "예시"입니다(sample: true). 실제 상품으로 바꾸면 sample 줄을 지우세요.
     예시 상태에서는 화면에 '예시' 표시가 붙고, 상단에 안내문이 나옵니다.
   - 위치 코드 = 구역-열-단.  예) "A-12-2" → A구역 12열 두 번째 단
       구역 A: 입구 왼쪽 벽 / B: 안쪽 벽(GOOD TOYS, GOOD DAY) / C: 오른쪽 벽 / D: 입구 앞 기둥·창가
       (실측 배치가 확정되면 아래 zones 설명을 함께 고치세요)
   - status: "sale"(판매중) · "soldout"(품절) · "check"(확인 필요)
   - checkedAt: 매장에서 직접 확인한 시각. 24시간이 지나면 자동으로 '확인 오래됨'으로 표시됩니다.
   - themes 에 쓸 수 있는 값: "가방에 달기" "책상 위 작은 장면" "친구와 함께 고르기" "처음 수집하기"
   - image: 사진 파일 경로(예 "assets/img/products/p001.jpg"). 비우면 캡슐 그림이 대신 표시됩니다.
   ===================================================================== */
window.PLT_PRODUCTS = {

  zones: {
    A: { name: "A구역", desc: "입구 왼쪽 벽면" },
    B: { name: "B구역", desc: "안쪽 벽면 (GOOD TOYS, GOOD DAY)" },
    C: { name: "C구역", desc: "오른쪽 벽면" },
    D: { name: "D구역", desc: "입구 앞 기둥·창가" }
  },

  /* 가격대 필터 구간 */
  priceBands: [
    { id: "p1", label: "1,000원", min: 0, max: 1000 },
    { id: "p2", label: "2,000~3,000원", min: 1001, max: 3000 },
    { id: "p3", label: "4,000원 이상", min: 3001, max: 999999 }
  ],

  items: [
    { id: "p001", name: "말랑 고양이 소프비 피규어", series: "동물 친구들 1탄", ip: "동물·생물", price: 3000, loc: "A-03-2", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["책상 위 작은 장면", "처음 수집하기"], desc: "손바닥에 쏙 들어오는 말랑한 소프비 고양이. 6종 중 1종이 무작위로 나옵니다.", color: "#F6A5A0", sample: true },
    { id: "p002", name: "미니 포장마차 세트", series: "작은 거리 풍경", ip: "미니어처·생활 소품", price: 5000, loc: "B-07-1", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["책상 위 작은 장면"], desc: "조명이 들어간 포장마차와 접이식 의자. 책상 위 작은 장면을 만들기 좋아요.", color: "#FFC46B", sample: true },
    { id: "p003", name: "레트로 게임기 키링", series: "픽셀 오락실", ip: "레트로·게임", price: 2000, loc: "A-01-3", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["가방에 달기", "친구와 함께 고르기"], desc: "버튼이 눌리는 미니 게임기 키링. 색상 5종.", color: "#7FB3F2", sample: true },
    { id: "p004", name: "빵 굽는 곰 베이커리", series: "동물 친구들 2탄", ip: "동물·생물", price: 3000, loc: "A-05-1", status: "soldout", checkedAt: "2026-10-04T11:30:00+09:00", themes: ["책상 위 작은 장면", "처음 수집하기"], desc: "앞치마를 두른 곰과 식빵·크루아상 소품. 세트 구성이 아니라 1개씩 나옵니다.", color: "#D9B48F", sample: true },
    { id: "p005", name: "우주 비행사 캡슐 피규어", series: "달 기지 탐사대", ip: "SF·로봇", price: 2000, loc: "B-12-2", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["친구와 함께 고르기", "처음 수집하기"], desc: "헬멧이 열리는 비행사 피규어. 친구와 색을 맞춰 뽑기 좋아요.", color: "#9DA8C7", sample: true },
    { id: "p006", name: "젤리 곰 투명 키링", series: "젤리 컬렉션", ip: "음식·디저트", price: 1000, loc: "C-02-3", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["가방에 달기"], desc: "빛을 통과시키는 투명 젤리 곰. 7가지 맛(색) 중 1개.", color: "#8FE3B8", sample: true },
    { id: "p007", name: "책상 위 미니 화분", series: "작은 정원", ip: "미니어처·생활 소품", price: 2000, loc: "C-09-1", status: "check", checkedAt: "2026-10-03T19:10:00+09:00", themes: ["책상 위 작은 장면"], desc: "손톱만 한 화분과 식물 5종. 모니터 아래 두기 좋은 크기.", color: "#A9D18E", sample: true },
    { id: "p008", name: "구름 토끼 마스코트", series: "하늘 친구들", ip: "캐릭터·마스코트", price: 3000, loc: "D-01-2", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["가방에 달기", "처음 수집하기"], desc: "구름 위에 앉은 토끼. 볼체인이 함께 들어 있어 바로 달 수 있어요.", color: "#C8CFF8", sample: true },
    { id: "p009", name: "미니 라면 컵 피규어", series: "편의점 야식", ip: "음식·디저트", price: 2000, loc: "B-03-3", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["친구와 함께 고르기", "책상 위 작은 장면"], desc: "뚜껑이 열리는 컵라면 미니어처. 젓가락 소품 포함.", color: "#F59A6A", sample: true },
    { id: "p010", name: "공룡 뼈 조립 키트", series: "작은 박물관", ip: "동물·생물", price: 5000, loc: "C-14-2", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["친구와 함께 고르기"], desc: "캡슐 안 부품을 조립하는 공룡 골격. 조립 안내지가 들어 있습니다.", color: "#E8DCC2", sample: true },
    { id: "p011", name: "야광 해파리 참", series: "심해 탐험", ip: "동물·생물", price: 1000, loc: "A-10-1", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["가방에 달기"], desc: "어두운 곳에서 은은하게 빛나는 해파리 참.", color: "#B9E6F5", sample: true },
    { id: "p012", name: "레트로 전화기 미니어처", series: "할머니 집", ip: "레트로·게임", price: 3000, loc: "B-15-1", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["책상 위 작은 장면"], desc: "다이얼이 돌아가는 옛날 전화기. 색상 4종.", color: "#F4D06F", sample: true },
    { id: "p013", name: "도넛 가게 점원 피규어", series: "달콤한 가게", ip: "음식·디저트", price: 3000, loc: "D-02-1", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["책상 위 작은 장면", "처음 수집하기"], desc: "도넛 상자를 든 점원 캐릭터와 미니 도넛 소품.", color: "#F7B6D2", sample: true },
    { id: "p014", name: "로봇 변신 캡슐", series: "캡슐 메카", ip: "SF·로봇", price: 5000, loc: "C-05-3", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["친구와 함께 고르기"], desc: "캡슐 자체가 로봇으로 변신합니다. 6종.", color: "#BFC7D5", sample: true },
    { id: "p015", name: "작은 책장과 책 세트", series: "작은 도서관", ip: "미니어처·생활 소품", price: 2000, loc: "A-08-2", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["책상 위 작은 장면"], desc: "손가락 두 마디 크기의 책장과 책 7권.", color: "#D2B7A3", sample: true },
    { id: "p016", name: "별 모양 반짝이 키링", series: "밤하늘 수집", ip: "캐릭터·마스코트", price: 1000, loc: "D-03-3", status: "sale", checkedAt: "2026-10-04T14:00:00+09:00", themes: ["가방에 달기", "처음 수집하기"], desc: "플레이션 별 캐릭터를 닮은 반짝이 키링. 첫 수집으로 가볍게 시작하기 좋아요.", color: "#FFE27A", sample: true }
  ]
};
