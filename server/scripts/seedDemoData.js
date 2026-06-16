/**
 * 포트폴리오 시연용 더미 데이터 시드 스크립트
 * ------------------------------------------------------------
 * - 기존 기능/모델/스키마를 수정하지 않고, 더미 데이터만 생성합니다.
 * - 모든 더미 문서는 결정적(deterministic) _id로 생성되어 중복 실행해도
 *   같은 문서를 upsert 하므로 중복이 쌓이지 않습니다.
 * - 실제 사용자가 만든 데이터는 건드리지 않습니다(데모 _id만 대상).
 *
 * 실행:
 *   node scripts/seedDemoData.js          # 데모 데이터 생성/갱신(upsert)
 *   node scripts/seedDemoData.js --reset  # 데모 데이터만 삭제 후 재생성
 *
 * 주의: 결제/소셜로그인/이메일 등 외부 API는 호출하지 않고 DB 문서만 생성합니다.
 */

require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 모델 로드 (capitalize 별칭 등록 위해 index.js도 함께 로드)
require('../models/index');
const User = require('../models/User');
const Location = require('../models/Location');
const Accommodation = require('../models/Accommodation');
const Room = require('../models/Room');
const TourTicket = require('../models/TourTicket');
const TravelItem = require('../models/TravelItem');
const Flight = require('../models/Flight');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const Coupon = require('../models/Coupon');
const UserCoupon = require('../models/UserCoupon');
const MileageHistory = require('../models/MileageHistory');

const RESET = process.argv.includes('--reset');
const DEMO_NS = 'ORT_DEMO::'; // 데모 데이터 식별용 네임스페이스

// 결정적 ObjectId 생성: md5(namespace+tag)의 앞 24 hex
const idFor = tag =>
  new mongoose.Types.ObjectId(
    crypto.createHash('md5').update(DEMO_NS + tag).digest('hex').slice(0, 24)
  );

// 유틸
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[rand(0, arr.length - 1)];
const pad = (n, len) => String(n).padStart(len, '0');
const round = (n, step = 1000) => Math.round(n / step) * step;
const ratingVal = () => Math.round((3.8 + Math.random() * 1.2) * 10) / 10; // 3.8~5.0
const daysAgo = d => new Date(Date.now() - d * 24 * 60 * 60 * 1000);
const randPastDate = (maxDays = 365) => daysAgo(rand(1, maxDays));
const picsum = (seed, w = 600, h = 400) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// ── 시연용 데이터 소스 ─────────────────────────────────────────
const DOMESTIC = [
  {name: '서울', country: '대한민국', lat: 37.5665, lng: 126.978, places: ['명동', '한강공원', '경복궁']},
  {name: '부산', country: '대한민국', lat: 35.1796, lng: 129.0756, places: ['해운대', '광안리', '감천문화마을']},
  {name: '제주', country: '대한민국', lat: 33.4996, lng: 126.5312, places: ['성산일출봉', '협재해변', '한라산']},
  {name: '강릉', country: '대한민국', lat: 37.7519, lng: 128.8761, places: ['경포대', '안목해변', '오죽헌']},
  {name: '여수', country: '대한민국', lat: 34.7604, lng: 127.6622, places: ['오동도', '돌산공원', '여수밤바다']},
  {name: '경주', country: '대한민국', lat: 35.8562, lng: 129.2247, places: ['불국사', '첨성대', '대릉원']},
  {name: '전주', country: '대한민국', lat: 35.8242, lng: 127.148, places: ['한옥마을', '경기전', '전주향교']},
  {name: '속초', country: '대한민국', lat: 38.207, lng: 128.5918, places: ['설악산', '속초해변', '아바이마을']},
  {name: '인천', country: '대한민국', lat: 37.4563, lng: 126.7052, places: ['차이나타운', '월미도', '송도']},
  {name: '가평', country: '대한민국', lat: 37.8315, lng: 127.5106, places: ['남이섬', '쁘띠프랑스', '아침고요수목원']},
  {name: '남해', country: '대한민국', lat: 34.8376, lng: 127.8924, places: ['독일마을', '다랭이마을', '상주은모래비치']},
  {name: '통영', country: '대한민국', lat: 34.8544, lng: 128.4331, places: ['동피랑', '케이블카', '소매물도']}
];
const OVERSEAS = [
  {name: '오사카', country: '일본', lat: 34.6937, lng: 135.5023, places: ['도톤보리', '오사카성', '신사이바시'], airport: 'KIX'},
  {name: '도쿄', country: '일본', lat: 35.6762, lng: 139.6503, places: ['시부야', '아사쿠사', '신주쿠'], airport: 'NRT'},
  {name: '후쿠오카', country: '일본', lat: 33.5904, lng: 130.4017, places: ['하카타', '캐널시티', '오호리공원'], airport: 'FUK'},
  {name: '다낭', country: '베트남', lat: 16.0544, lng: 108.2022, places: ['미케비치', '바나힐', '한시장'], airport: 'DAD'},
  {name: '방콕', country: '태국', lat: 13.7563, lng: 100.5018, places: ['카오산로드', '왕궁', '짜뚜짝시장'], airport: 'BKK'},
  {name: '싱가포르', country: '싱가포르', lat: 1.3521, lng: 103.8198, places: ['마리나베이', '센토사', '가든스바이더베이'], airport: 'SIN'},
  {name: '타이베이', country: '대만', lat: 25.033, lng: 121.5654, places: ['스린야시장', '101빌딩', '지우펀'], airport: 'TPE'},
  {name: '괌', country: '미국', lat: 13.4443, lng: 144.7937, places: ['투몬비치', '사랑의절벽', 'KMART'], airport: 'GUM'}
];

const STAY_ADJ = ['오션뷰', '감성', '시티', '프리미엄', '힐링', '가족', '럭셔리', '아늑한', '모던'];
const STAY_TYPE = {Hotel: '호텔', Pension: '펜션', Resort: '리조트', Motel: '모텔'};
const ROOM_TYPES = ['스탠다드룸', '디럭스룸', '트윈룸', '스위트룸', '온돌룸'];
const AMENITIES = ['Wifi', '주차장', '조식포함', '수영장', '바다전망', '에어컨', 'TV', '욕조', '반려동물동반'];
const TOUR_ACT = ['스노클링 체험', '시티 투어', '맛집 투어', '카약 체험', '야경 투어', '전통문화 체험', '크루즈 투어', '테마파크 입장권'];
const REVIEW_TEXT = [
  '가성비 최고였어요. 다음에 또 이용하고 싶네요.',
  '사진보다 실물이 훨씬 좋았습니다. 강추합니다!',
  '직원분들이 친절해서 기분 좋게 여행했어요.',
  '위치가 좋아서 이동이 편했습니다.',
  '청결도가 아주 만족스러웠어요.',
  '뷰가 정말 예술이었습니다. 인생샷 건졌어요.',
  '아이와 함께하기 좋은 곳이었어요.',
  '조식이 알차서 든든하게 시작했습니다.',
  '재방문 의사 100%입니다. 추천해요.',
  '조용하고 깔끔해서 푹 쉬다 갑니다.'
];
const PKG_NAME_DOM = ['감성 여행', '미식 투어', '힐링 패키지', '가족 여행', '커플 여행', '뚜벅이 자유여행'];
const PKG_NAME_OVS = ['자유여행', '리조트 휴양', '시티 투어 패키지', '미식 탐방', '쇼핑 투어', '핵심 일정'];
const TRAVEL_ITEMS = [
  '여행용 캐리어 28인치', '목베개 메모리폼', '여권 케이스', '여행용 어댑터', '보조배터리 20000mAh',
  '기내용 파우치', '압축 여행팩', '휴대용 가습기', '여행용 세면도구 세트', '캐리어 벨트',
  '목쿠션 슬리퍼 세트', '방수 보조가방'
];
const AIRLINES = [
  {ko: '대한항공', en: 'Korean Air', code: 'KE'},
  {ko: '아시아나항공', en: 'Asiana Airlines', code: 'OZ'},
  {ko: '제주항공', en: 'Jeju Air', code: '7C'},
  {ko: '티웨이항공', en: 'Tway Air', code: 'TW'}
];

// bulkWrite upsert 헬퍼 (결정적 _id 기준, pre-save 훅 미동작 → 데이터를 명시적으로 채움)
async function upsertAll(Model, docs) {
  if (!docs.length) return 0;
  const ops = docs.map(d => ({
    updateOne: {filter: {_id: d._id}, update: {$set: d}, upsert: true}
  }));
  await Model.bulkWrite(ops, {ordered: false});
  return docs.length;
}

async function deleteDemo(Model, ids) {
  if (!ids.length) return;
  await Model.deleteMany({_id: {$in: ids}});
}

async function run() {
  if (!process.env.DB_URI) {
    console.error('DB_URI 환경변수가 없습니다. server/.env 를 확인하세요.');
    process.exit(1);
  }
  await mongoose.connect(process.env.DB_URI);
  console.log('MongoDB Connected (seed)');

  const passwordHash = await bcrypt.hash('12341234', 10);
  const counts = {};

  // ── 1) Locations ─────────────────────────────────────────
  const allCities = [...DOMESTIC, ...OVERSEAS];
  const locations = allCities.map(c => ({
    _id: idFor('loc:' + c.name),
    name: c.name,
    country: c.country,
    latitude: c.lat,
    longitude: c.lng,
    popularPlaces: c.places,
    createdAt: randPastDate(300)
  }));
  const locIdByName = {};
  locations.forEach(l => (locIdByName[l.name] = l._id));

  // ── 2) Users (admin, test, user001~user100) ──────────────
  const users = [];
  let phoneSeq = 0;
  const mkUser = (idTag, userid, email, name, roles) => {
    phoneSeq += 1;
    return {
      _id: idFor('user:' + idTag),
      userid,
      email,
      phone: `010-${pad(1000 + phoneSeq, 4)}-${pad(phoneSeq, 4)}`,
      password: passwordHash,
      username: name,
      address: `${pick(allCities).name}시 데모로 ${rand(1, 200)}`,
      provider: 'local',
      roles,
      profileImage: '',
      mileage: rand(0, 50000),
      totalSpent: 0,
      createdAt: randPastDate(360)
    };
  };
  const SURNAME = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
  const GIVEN = ['민준', '서연', '도윤', '하은', '시우', '지우', '예준', '수아', '주원', '지호', '하준', '서윤', '지안', '유진', '현우'];
  // 관리자/일반 테스트 계정: 로그인 아이디(userid)를 이메일로 설정 → 이메일로 로그인 가능
  users.push(mkUser('test1', 'test1@test.com', 'test1@test.com', '관리자', ['admin']));
  users.push(mkUser('test', 'test@test.com', 'test@test.com', '홍길동', ['user']));
  for (let i = 1; i <= 100; i++) {
    const uid = 'user' + pad(i, 3);
    const name = pick(SURNAME) + pick(GIVEN);
    users.push(mkUser(uid, uid, `${uid}@test.com`, name, ['user']));
  }
  const adminId = idFor('user:test1');
  const normalUserIds = users.filter(u => u.roles.includes('user')).map(u => u._id);

  // ── 3) Flights (해외 노선) ───────────────────────────────
  const flights = OVERSEAS.map((c, idx) => {
    const al = AIRLINES[idx % AIRLINES.length];
    return {
      _id: idFor('flight:' + c.name),
      airline: al.en,
      airlineKorean: al.ko,
      airlineHomepageUrl: '',
      departure: {airport: 'ICN', city: '서울', date: randPastDate(30), time: pad(rand(6, 11), 2) + '00'},
      arrival: {airport: c.airport, city: c.name, date: randPastDate(30), time: pad(rand(12, 18), 2) + '30'},
      flightNumber: `${al.code}${rand(100, 999)}`,
      operatingDays: ['Mon', 'Wed', 'Fri', 'Sun'],
      price: round(rand(180000, 650000), 5000),
      seatsAvailable: rand(20, 180),
      seatClass: pick(['일반석', '비즈니스석', '특가석'])
    };
  });
  const flightIdByCity = {};
  flights.forEach((f, i) => (flightIdByCity[OVERSEAS[i].name] = f._id));

  // ── 4) TourTickets ───────────────────────────────────────
  const tourTickets = [];
  for (let i = 0; i < 30; i++) {
    const city = pick(allCities);
    tourTickets.push({
      _id: idFor('tour:' + i),
      title: `${city.name} ${pick(TOUR_ACT)}`,
      description: `${city.name}에서 즐기는 인기 투어 상품입니다.`,
      location: city.name,
      price: round(rand(15000, 120000), 1000),
      stock: rand(20, 300),
      images: [picsum('tour' + i)],
      views: rand(0, 5000),
      createdAt: randPastDate(300)
    });
  }

  // ── 5) TravelItems ───────────────────────────────────────
  const travelItems = TRAVEL_ITEMS.map((nm, i) => ({
    _id: idFor('item:' + i),
    name: nm,
    description: `${nm} - 여행 필수 아이템`,
    category: '여행용품',
    price: round(rand(8000, 90000), 1000),
    stock: rand(0, 500),
    soldOut: false,
    images: [picsum('item' + i)],
    rating: ratingVal(),
    parentCategory: null,
    views: rand(0, 3000),
    createdAt: randPastDate(300)
  }));

  // ── 6) Accommodations + Rooms ────────────────────────────
  const accommodations = [];
  const rooms = [];
  const accRoomIds = {}; // accId -> [roomId...]
  const catKeys = Object.keys(STAY_TYPE);
  for (let i = 0; i < 100; i++) {
    const city = pick(allCities);
    const cat = catKeys[i % catKeys.length];
    const accId = idFor('acc:' + i);
    const roomCount = (i % 3) + 1; // 결정적(1~3) → 재실행 시 객실 _id 집합 고정
    const myRooms = [];
    let minP = Infinity;
    let maxP = 0;
    for (let r = 0; r < roomCount; r++) {
      const price = round(rand(60000, 480000), 5000);
      minP = Math.min(minP, price);
      maxP = Math.max(maxP, price);
      const roomId = idFor(`room:${i}:${r}`);
      myRooms.push(roomId);
      rooms.push({
        _id: roomId,
        accommodation: accId,
        name: pick(ROOM_TYPES),
        description: '편안한 휴식을 위한 객실입니다.',
        pricePerNight: price,
        maxGuests: rand(2, 6),
        images: [picsum(`room${i}_${r}`)],
        amenities: [pick(AMENITIES), pick(AMENITIES)],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        available: true,
        availableCount: rand(3, 20),
        reservedDates: [],
        createdAt: randPastDate(300)
      });
    }
    accRoomIds[accId.toString()] = myRooms;
    accommodations.push({
      _id: accId,
      name: `${city.name} ${pick(STAY_ADJ)} ${STAY_TYPE[cat]}`,
      description: `${city.name}에 위치한 ${STAY_TYPE[cat]}입니다. ${pick(city.places)} 인근.`,
      location: locIdByName[city.name],
      address: `${city.country} ${city.name} ${pick(city.places)}로 ${rand(1, 300)}`,
      coordinates: {type: 'Point', coordinates: [city.lng + (Math.random() - 0.5) * 0.05, city.lat + (Math.random() - 0.5) * 0.05]},
      images: [picsum('acc' + i), picsum('acc' + i + '_b')],
      minPrice: minP === Infinity ? 0 : minP,
      maxPrice: maxP,
      amenities: [pick(AMENITIES), pick(AMENITIES), pick(AMENITIES)],
      rating: ratingVal(),
      category: cat,
      host: adminId,
      rooms: myRooms,
      views: rand(0, 8000),
      createdAt: randPastDate(300)
    });
  }

  // ── 7) Packages (연관 데이터 연결: 프론트 가격 계산이 동작하도록) ──
  const packages = [];
  for (let i = 0; i < 100; i++) {
    const overseas = i % 2 === 0;
    const cityPool = overseas ? OVERSEAS : DOMESTIC;
    const city = pick(cityPool);
    const acc = accommodations[rand(0, accommodations.length - 1)];
    const roomId = accRoomIds[acc._id.toString()][0];
    const room = rooms.find(rm => rm._id.equals(roomId));
    const nights = rand(2, 4);
    const start = randPastDate(rand(10, 120) + 30);
    const end = new Date(start.getTime() + nights * 24 * 60 * 60 * 1000);
    const tourPick = [tourTickets[rand(0, tourTickets.length - 1)]._id];
    const flightArr = overseas && flightIdByCity[city.name]
      ? [{flightId: flightIdByCity[city.name], seatsToUse: rand(1, 2)}]
      : [];

    // 프론트/스토어 표시용 가격 (연관 데이터 합산과 동일한 방식)
    const roomTotal = (room ? room.pricePerNight : 0) * nights;
    const tourTotal = tourTickets.find(t => t._id.equals(tourPick[0])).price;
    let flightTotal = 0;
    if (flightArr.length) {
      const f = flights.find(fl => fl._id.equals(flightArr[0].flightId));
      flightTotal = (f ? f.price : 0) * flightArr[0].seatsToUse;
    }
    const basePrice = roomTotal + tourTotal + flightTotal;
    const discountRate = pick([0, 5, 10, 15, 20]);
    const finalPrice = Math.round(basePrice - (basePrice * discountRate) / 100);

    packages.push({
      _id: idFor('pkg:' + i),
      name: `${city.name} ${nights - 1}박 ${nights}일 ${overseas ? pick(PKG_NAME_OVS) : pick(PKG_NAME_DOM)}`,
      description: `${city.name} 인기 코스를 담은 패키지. ${pick(city.places)} 포함.`,
      type: 'Basic',
      price: basePrice,
      discountRate,
      finalPrice,
      accommodations: [acc._id],
      flights: flightArr,
      tours: tourPick,
      roomIds: [roomId],
      startDates: [start],
      endDates: [end],
      images: [], // 패키지 카드는 SERVER_URL을 강제 prefix → 외부URL 불가, 기본이미지 사용
      startDate: start,
      endDate: end,
      duration: nights,
      availableDates: [start],
      category: overseas ? 'Tour Package' : 'Self-Guided',
      minPeople: 1,
      maxPeople: rand(4, 20),
      status: 'Available',
      createdBy: adminId,
      createdAt: randPastDate(200)
    });
  }

  // ── 8) Bookings + Payments ───────────────────────────────
  const bookings = [];
  const payments = [];
  const PAY_METHODS = ['card', 'vbank', 'trans', 'point'];
  for (let i = 0; i < 100; i++) {
    const userId = pick(normalUserIds);
    const usePackage = i % 2 === 0;
    const prod = usePackage ? packages[rand(0, packages.length - 1)] : accommodations[rand(0, accommodations.length - 1)];
    const count = rand(1, 4);
    const unit = usePackage ? prod.finalPrice : (prod.minPrice || 100000);
    const total = unit * count;
    const discount = pick([0, 0, 5000, 10000]);
    const finalPrice = Math.max(0, total - discount);
    const merchantUid = `demo_mid_${pad(i, 4)}`;
    const bId = idFor('booking:' + i);
    const created = randPastDate(rand(1, 350));
    bookings.push({
      _id: bId,
      types: [usePackage ? 'package' : 'accommodation'],
      productIds: [prod._id],
      roomIds: usePackage ? prod.roomIds : [],
      startDates: [created],
      endDates: [new Date(created.getTime() + 2 * 86400000)],
      counts: [count],
      merchant_uid: merchantUid,
      totalPrice: total,
      discountAmount: discount,
      finalPrice,
      usedMileage: 0,
      userId,
      paymentStatus: 'CONFIRMED',
      reservationInfo: {name: '홍길동', email: 'test@test.com', phone: '010-0000-0000', address: '데모 주소'},
      createdAt: created,
      updatedAt: created
    });
    payments.push({
      _id: idFor('pay:' + i),
      bookingId: bId,
      imp_uid: `demo_imp_${pad(i, 4)}`,
      merchant_uid: merchantUid,
      userId,
      amount: finalPrice,
      status: 'PAID',
      paymentMethod: pick(PAY_METHODS),
      paidAt: created
    });
  }

  // ── 9) Reviews (120개, 예약 기반) ────────────────────────
  const reviews = [];
  for (let i = 0; i < 120; i++) {
    const b = bookings[i % bookings.length];
    reviews.push({
      _id: idFor('review:' + i),
      bookingId: b._id,
      userId: b.userId,
      productId: b.productIds[0],
      rating: ratingVal(),
      content: pick(REVIEW_TEXT),
      images: [],
      likes: rand(0, 80),
      likedBy: [],
      comments: [],
      createdAt: randPastDate(300),
      updatedAt: randPastDate(120)
    });
  }

  // ── 10) Favorites (찜) ───────────────────────────────────
  const favorites = [];
  const favTargets = [
    {type: 'Accommodation', list: accommodations},
    {type: 'TourTicket', list: tourTickets},
    {type: 'TravelItem', list: travelItems}
  ];
  for (let i = 0; i < 150; i++) {
    const u = pick(normalUserIds);
    const t = pick(favTargets);
    const item = pick(t.list);
    favorites.push({
      _id: idFor(`fav:${i}`),
      user: u,
      item: item._id,
      itemType: t.type,
      createdAt: randPastDate(200)
    });
  }

  // ── 11) Coupons + UserCoupons + MileageHistory ───────────
  const coupons = [
    {name: '신규가입 1만원 할인', discountType: 'fixed', discountValue: 10000, minPurchaseAmount: 50000, memberships: ['길초보', '길잡이', '모험왕']},
    {name: '여름 시즌 10% 할인', discountType: 'percentage', discountValue: 10, maxDiscountAmount: 30000, minPurchaseAmount: 100000, memberships: ['길초보', '길잡이', '모험왕']},
    {name: '길잡이 등급 5% 쿠폰', discountType: 'percentage', discountValue: 5, maxDiscountAmount: 20000, minPurchaseAmount: 0, memberships: ['길잡이', '모험왕']},
    {name: '모험왕 전용 5만원 할인', discountType: 'fixed', discountValue: 50000, minPurchaseAmount: 300000, memberships: ['모험왕']},
    {name: '주말특가 15% 할인', discountType: 'percentage', discountValue: 15, maxDiscountAmount: 50000, minPurchaseAmount: 150000, memberships: ['길초보', '길잡이', '모험왕']}
  ].map((c, i) => ({
    _id: idFor('coupon:' + i),
    name: c.name,
    description: c.name,
    discountType: c.discountType,
    discountValue: c.discountValue,
    maxDiscountAmount: c.discountType === 'fixed' ? 0 : c.maxDiscountAmount,
    minPurchaseAmount: c.minPurchaseAmount,
    applicableMemberships: c.memberships,
    expiresAt: new Date(Date.now() + 90 * 86400000),
    createdAt: randPastDate(60),
    updatedAt: randPastDate(30)
  }));

  const userCoupons = [];
  for (let i = 0; i < 40; i++) {
    const u = i === 0 ? idFor('user:test') : pick(normalUserIds);
    const c = pick(coupons);
    userCoupons.push({
      _id: idFor(`ucoupon:${i}`),
      user: u,
      coupon: c._id,
      issuedAt: randPastDate(40),
      expiresAt: new Date(Date.now() + 60 * 86400000),
      isUsed: Math.random() < 0.3,
      createdAt: randPastDate(40),
      updatedAt: randPastDate(20)
    });
  }

  const mileageHistory = [];
  for (let i = 0; i < 60; i++) {
    const u = i < 5 ? idFor('user:test') : pick(normalUserIds);
    const type = Math.random() < 0.6 ? 'earn' : 'use';
    const amount = round(rand(500, 30000), 100);
    mileageHistory.push({
      _id: idFor(`mileage:${i}`),
      userId: u,
      type,
      amount,
      description: type === 'earn' ? '예약 적립' : '결제 사용',
      balanceAfter: rand(0, 80000),
      createdAt: randPastDate(300)
    });
  }

  // ── 실행: reset 시 데모 _id만 삭제 후 재생성 ───────────────
  const groups = [
    [Location, locations], [User, users], [Flight, flights],
    [TourTicket, tourTickets], [TravelItem, travelItems],
    [Accommodation, accommodations], [Room, rooms], [Package, packages],
    [Booking, bookings], [Payment, payments], [Review, reviews],
    [Favorite, favorites], [Coupon, coupons], [UserCoupon, userCoupons],
    [MileageHistory, mileageHistory]
  ];

  if (RESET) {
    console.log('--reset: 기존 데모 데이터(데모 _id) 삭제 중...');
    for (const [Model, docs] of groups) {
      await deleteDemo(Model, docs.map(d => d._id));
    }
    // Room 은 과거 랜덤 생성으로 남은 잔여 데모 객실까지 정리 (가능한 _id superset)
    const roomSuperset = [];
    for (let i = 0; i < 100; i++) for (let r = 0; r < 3; r++) roomSuperset.push(idFor(`room:${i}:${r}`));
    await deleteDemo(Room, roomSuperset);
  }

  for (const [Model, docs] of groups) {
    counts[Model.modelName] = await upsertAll(Model, docs);
  }

  console.log('=== 생성/갱신 완료 ===');
  console.table(counts);

  await mongoose.disconnect();
  console.log('완료. 연결 종료.');
}

run().catch(async err => {
  console.error('시드 실행 오류:', err.message);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
