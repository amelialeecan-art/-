# MODE — 0단계 개발 계획서

> 개인 리듬 분석 앱 MODE의 구현 전 설계 문서.
> 이 문서는 **계획서**이며, 본격 구현은 "1단계 시작" 지시 후에만 진행한다.
> 기술 스택은 현재 저장소에 이미 구성된 **Expo + React Native + TypeScript + AsyncStorage + react-native-svg + expo-linear-gradient** 를 그대로 재사용한다.

---

## 0. 제품 원칙 (모든 설계의 기준선)

이 원칙을 위반하는 화면/함수/문구는 만들지 않는다.

1. 사용자는 **원인을 추측하지 않는다**. 사실(상태·사건·몸·회복 행동)만 기록한다.
2. **"이유 같았던 건?" 입력 방식은 폐기**한다. 대신 "오늘 있었던 일"(사건/상황 기록)을 쓴다.
3. 생리/주기는 **사용자가 요인으로 고르지 않는다**. 사용자는 생리 시작/종료/출혈량/생리통/증상만 기록하고, **앱이 날짜 기반으로** 생리 중·n일째·예정 n일 전·월경 전 구간·배란 추정을 계산한다.
4. 앱은 단정하지 않는다. **"원인입니다" 금지**. "함께 나타나는 경향", "가능성", "비슷한 패턴", "신뢰도", "데이터 부족"으로 말한다.
5. **원인 미상일(미제 사건)**은 1급 시민이다. 설명 안 되는 날도 데이터로 보관한다.
6. **회복 행동 분석은 트리거 분석만큼 중요**하다. "뭘 했더니 나아졌는지"를 동등하게 다룬다.
7. 모드 이름은 명확하게(예: "식욕 변동일"), 괄호 보조 문구는 **그날 상황에 따라 동적 생성**(고정 문구 금지).
8. 의료 진단 앱이 아니다. 진단/병명 단정 금지.

---

## 1. 디자인 파일에서 참고할 요소 vs 수정할 요소

참고 파일: `mode-design-concept.html` (v6/v8 시안)

### 1-A. 그대로 유지(=토큰화해서 RN으로 옮길 것)

| 요소 | 시안 위치 | RN 이식 방법 |
|---|---|---|
| 컬러 팔레트 (lav/coral/mint/teal/sky/rose/butter + ink 단계) | `:root` CSS 변수 | `src/theme/colors.ts` 토큰으로 이관 |
| 부드러운 라디얼 그라데이션 배경 | `body` background | `expo-linear-gradient` + 화면별 톤(`s-emotion`, `s-recovery`) |
| 둥근 카드 (radius 24/30), 글래스 카드 | `.card`, `.glass` | `Card` 컴포넌트 + 반투명/그림자 토큰 |
| 모찌 캐릭터(모드 친구) + 표정 6종(happy/teary/sleepy/hungry/focus/confused) | `.m`, `FACES` | `react-native-svg`로 `<MoodMochi mood face size>` 컴포넌트화 |
| 모드 카드(큰 그라데이션 헤더 + 캐릭터 + 괄호 pill) | `.modecard` | `TodayModeCard` |
| 4줄 설계(일정/식사/운동/관계 태그 행) | `.plan`, `.planrow`, `.plantag` | `DayPlanList` (태그색 c1~c4) |
| 캘린더: 아이콘 대신 **색 진함 + 짧은 라벨**, 렌즈 전환(전체/감정/식욕/수면/몸/주기/회복) | `.grid`, `.lens`, `RAMP` | `RhythmCalendar` + 렌즈별 색 램프 |
| 부드러운 스플라인 라인그래프 + 슬라이드 카드형 | `.gscroll`, `spline()` | `react-native-svg` Path + 가로 스크롤 |
| 하단 5탭 | `.tabbar` | 이미 있는 `CustomTabBar` 패턴 재사용 |
| 신뢰도/효과 막대, 공범 벤다이어그램, "나를 살린 것들" 칩 | `.bar`, `.overlap`, `.savechips` | 분석 화면 컴포넌트들 |
| 예보 카드(가능성 % 미터 + 주간 흐름 dot) | `.fcard`, `.meter`, `.weekrow` | `ForecastCard` |
| 넉넉한 여백, 큰 읽기 쉬운 글자(Pretendard 계열) | 전역 | `src/theme/typography.ts` |

### 1-B. 반드시 수정/폐기(시안의 오래된 로직)

| 시안 현재 | 문제 | 변경 |
|---|---|---|
| 빠른기록 2번 질문 **"이유 같았던 건?"** + `생리·주기` 칩 | 원인 추측 + 주기 수동 선택 = 절대 규칙 위반 | **"오늘 있었던 일"**(사건 기록)로 교체, `생리·주기` 칩 제거 → 생리는 별도 **생리 기록** 섹션 |
| 칩 `단짠`, `식욕폭발` 같은 모호/자극 표현 | 타입명으로 부적절 | 상태 라벨 정규화(안정/예민/우울/불안/식욕 변동/방전/몸 불편/사회 피로/충동 증가/이유 모름) |
| 모드 괄호 문구 고정(예: "오늘 다 진심임") | 고정 문구 금지 | 점수 기반 **동적 서브라벨** 생성 |
| 4줄 설계 "긴 답장은 내일의 일로" 등 하드코딩 | 고정 문구 금지 | `buildDayPlan()`이 그날 위험 방향으로 생성 |
| "범인/현행범/용의자" 톤이 강함 | 톤 과함(선택적) | `userSettings.toneMode`로 톤 강도 조절(기본은 부드럽게), 단정 금지 유지 |
| 캘린더에 단어 라벨 다수 | 규칙: 아이콘 적게, 색+짧은 라벨 | 전체 렌즈에서만 짧은 라벨, 나머지 렌즈는 색 진함 위주 |

> 시안은 **비주얼 레퍼런스로만** 신뢰하고, **로직/문구는 본 명세를 최우선**으로 한다.

---

## 2. 추천 프로젝트 구조

현재 군월급 앱 스캐폴드와 **동일한 폴더 규칙**(검증된 패턴)을 유지하되 MODE 도메인으로 채운다.

```
App.tsx                      진입점: SafeAreaProvider → AppProvider → AppNavigator
src/
  types/
    index.ts                 모든 도메인 타입 (dailyLogs/eventLogs/cycleLogs/recoveryLogs/scores/insights/settings)
    enums.ts                 상태코드/사건코드/회복코드/모드타입/카테고리 상수 + 라벨맵
  constants/
    defaultConfig.ts         기본 userSettings, 빈 상태 팩토리
    factorCatalog.ts         "오늘 있었던 일" 사건 카탈로그(코드↔라벨↔카테고리↔mappedFactorGroup)
    recoveryCatalog.ts       회복 행동 카탈로그
    weights.ts               점수 가중치 상수(공식 한 곳 집중 — 튜닝 용이)
  storage/
    db.ts                    날짜 인덱스 기반 로컬 저장(아래 3-D 참고)
    migrations.ts            스키마 버전/마이그레이션
  state/
    AppContext.tsx           전역 상태 + 영속화 + 파생값 셀렉터
    selectors.ts             오늘 점수/오늘 모드/최근 인사이트 메모이즈 셀렉터
  lib/
    scoring/                 점수 계산 (순수 함수)
      emotionalLoad.ts  appetiteLoad.ts  sleepLoad.ts  bodyLoad.ts  cycleLoad.ts  eventLoad.ts  rhythmLoad.ts
      normalize.ts           0~100 보정 유틸
      dailyScore.ts          위 모듈 조합 → dailyScores 1건 생성
    cycle/
      cyclePredict.ts        평균/중앙값 주기, 다음 예정일
      cyclePhase.ts          생리 중/n일째/예정 n일 전/월경 전 구간/배란 추정
      cycleStrength.ts       개인 데이터 기준 주기-상태 상관 강도
    mode/
      classifyDayType.ts     점수 → 모드 타입
      subLabel.ts            모드+점수 → 동적 괄호 문구
    analysis/
      baseline.ts            최근 30일 개인 기준선
      factorEffect.ts        요인 효과(당일/전날/3일/7일 창)
      confidence.ts          신뢰도 점수 + 등급
      combo.ts               공범(조합) 효과
      unexplained.ts         원인 미상 판정
      recovery.ts            회복 전후/다음날 효과 + 회복 점수 + 랭킹
      customFactor.ts        커스텀 요인 매핑/유사 묶기
    forecast/
      forecastTomorrow.ts    내일 모드 가능성(%)
      dayPlan.ts             4줄 설계 생성
      similarDays.ts         비슷한 과거 날 검색 → 회복 추천
    date/
      dateUtils.ts           ISO 날짜/범위/요일/D-day
  hooks/
    useToday.ts              오늘 점수+모드+추천 묶음
    useTimeWindow.ts         분석 시간창 헬퍼
  components/
    common/                  Card, Screen, ScreenHeader, AppButton, Chip, Segmented, Field, ToggleSwitch ...
    mochi/MoodMochi.tsx      SVG 캐릭터 + 표정
    today/                   TodayModeCard, FactorSuspectList, DayPlanList, RecoveryRecommendCard
    record/                  StateChips, EventChips, CycleRecordSheet, RecoverySheet, CustomFactorModal
    calendar/                RhythmCalendar, LensBar, ColorScaleLegend
    analysis/                FlowGraph, RepeatReport, ComboCard, SaviorChips, ColdCaseCard, ConfidenceBar
    forecast/                ForecastCard, WeekFlowRow, PrepPlanList
  navigation/
    AppNavigator.tsx         Stack(온보딩/설정) + BottomTabs(오늘/기록/캘린더/분석/예보)
    CustomTabBar.tsx
    types.ts
  theme/
    colors.ts  typography.ts  radius.ts
```

핵심 원칙: **`lib/`는 React 비의존 순수 함수**(테스트 쉬움), 화면은 셀렉터로 파생값만 읽는다.

---

## 3. 추천 데이터 모델 구조

스케일 규약: **입력 지표는 0~10 정수**(슬라이더/칩 강도), **부하 점수(load)는 0~100**으로 정규화. 날짜는 `YYYY-MM-DD` 로컬 ISO, id는 `날짜+종류+seq` 또는 uuid.

```ts
// src/types/index.ts (설계 스케치 — 1단계에서 확정)

type ISODate = string;        // 'YYYY-MM-DD'
type Score0to10 = number;     // 입력 지표
type Load0to100 = number;     // 파생 부하

// 1) 하루 상태 기록
interface DailyLog {
  id: string; date: ISODate;
  moodLow: Score0to10; anxiety: Score0to10; irritability: Score0to10; sadness: Score0to10;
  heaviness: Score0to10; calm: Score0to10; energy: Score0to10; focus: Score0to10;
  selfCriticism: Score0to10; impulsivity: Score0to10;
  appetite: Score0to10; sweetCraving: Score0to10; saltyCraving: Score0to10; bingeUrge: Score0to10;
  bodyDiscomfort: Score0to10; pain: Score0to10; bloating: Score0to10; fatigue: Score0to10;
  headache: Score0to10; digestion: Score0to10;
  memo?: string; createdAt: string; updatedAt: string;
}

// 2) 사건/상황 기록 ("오늘 있었던 일") — 하루에 여러 건
interface EventLog {
  id: string; date: ISODate;
  eventCode: string;            // 카탈로그 코드 (예: 'sleep_short')
  eventLabel: string;           // 표시 라벨
  category: FactorCategory;     // 수면/식사/관계/일/외모/환경/디지털/몸/기타
  timing: 'today' | 'yesterday' | 'recent';
  intensity: 'low' | 'mid' | 'high';
  isCustom: boolean;
  customLabel?: string;
  mappedFactorGroup: string;    // 분석 그룹키 (예: 'sleep_deficit', 'body_image_trigger')
  createdAt: string;
}

// 3) 생리 기록 (사용자는 사실만 기록)
interface CycleLog {
  id: string; date: ISODate;
  periodStart?: boolean; periodEnd?: boolean;
  flowLevel?: 'spotting' | 'light' | 'medium' | 'heavy';
  periodPain?: Score0to10;
  symptoms?: string[];
  createdAt: string;
}

// 4) 회복 행동 기록 (전후 비교 핵심)
interface RecoveryLog {
  id: string; date: ISODate;
  actionCode: string; actionLabel: string; category: string;
  beforeMood?: Score0to10; afterMood?: Score0to10;
  beforeAnxiety?: Score0to10; afterAnxiety?: Score0to10;
  beforeAppetite?: Score0to10; afterAppetite?: Score0to10;
  beforeBodyLoad?: Score0to10; afterBodyLoad?: Score0to10;
  effect: 'muchBetter' | 'slightlyBetter' | 'same' | 'worse';
  timeGap?: number;             // 분
  memo?: string; createdAt: string;
}

// 5) 일일 파생 점수 (앱이 계산, 캐시)
interface DailyScore {
  id: string; date: ISODate;
  emotionalLoad: Load0to100; appetiteLoad: Load0to100; sleepLoad: Load0to100;
  bodyLoad: Load0to100; cycleLoad: Load0to100; eventLoad: Load0to100; rhythmLoad: Load0to100;
  recoveryScore: number;
  dayType: DayType;             // 안정일 ... 복합 흔들림일
  dayTypeSubLabel: string;      // 동적 괄호 문구
  confidence: number;           // 그날 해석 신뢰도 0~100
  createdAt: string;
}

// 6) 패턴 인사이트 (분석 결과 캐시)
interface PatternInsight {
  id: string;
  insightType: 'factor' | 'combo' | 'recovery' | 'cycle' | 'coldCase';
  targetMetric: string;         // 'appetiteLoad' 등
  factorCodes: string[];        // 단일 또는 조합
  effectSize: number;
  confidence: number;           // 0~100
  confidenceTier: 'reference' | 'possible' | 'likely' | 'strong';
  supportCount: number;         // 근거 일수
  message: string;              // 단정 금지 문구
  createdAt: string;
}

// 7) 사용자 설정
interface UserSettings {
  cycleEnabled: boolean;
  averageCycleLength: number;   // 기본 28, 학습으로 갱신
  toneMode: 'soft' | 'playful'; // 톤 강도(범인 톤 on/off)
  reminderEnabled: boolean;
  privacyMode: boolean;
  onboardingCompleted: boolean;
  createdAt: string; updatedAt: string;
}

// 전역 상태
interface AppState {
  dailyLogs: Record<ISODate, DailyLog>;
  eventLogs: EventLog[];
  cycleLogs: CycleLog[];
  recoveryLogs: RecoveryLog[];
  dailyScores: Record<ISODate, DailyScore>;
  insights: PatternInsight[];
  settings: UserSettings;
  schemaVersion: number;
}
```

### 3-D. 저장 전략
- 군월급의 단일 키 패턴은 데이터가 누적되는 MODE엔 부적합. **날짜 인덱스 + 컬렉션 분리** 저장(`mode:dailyLogs`, `mode:eventLogs` ...) 또는 1단계 한정으로 단일 키 시작 후 데이터 증가 시 분할.
- `mergeWithDefaults` + `schemaVersion` 마이그레이션은 그대로 계승.
- `dailyScores`/`insights`는 **파생 캐시** — 원본(logs)만 진실, 언제든 재계산 가능해야 함.

---

## 4 & 5. 핵심 함수 목록 + 각 함수가 하는 일

### A. 점수 계산 (`lib/scoring`)
| 함수 | 하는 일 |
|---|---|
| `normalizeToLoad(raw, maxRaw)` | 가중합을 0~100으로 클램프/스케일 |
| `computeEmotionalLoad(d: DailyLog)` | `moodLow*1.2 + anxiety*1.1 + irritability*1.0 + sadness*1.1 + heaviness*1.3 + selfCriticism*1.0 + impulsivity*0.8 - calm*0.8` → 정규화 |
| `computeAppetiteLoad(d, events)` | `appetite*0.8 + sweetCraving*1.1 + saltyCraving*0.8 + bingeUrge*1.5 + mealSkipped*6 + lateNightEating*7` (mealSkipped/야식은 eventLogs에서 파생) |
| `computeSleepLoad(d, events)` | 수면시간·질·중간각성·늦게 잠·악몽 기반(입력 미존재 필드는 1단계에서 dailyLog/eventLog로 보강) |
| `computeBodyLoad(d, cycle)` | `pain*1.2 + bloating*1.0 + fatigue*1.3 + headache*0.9 + digestion*0.8 + periodPain*1.2` |
| `computeCycleLoad(date, cycleLogs, settings)` | **사용자 선택 아님**. 날짜+주기 위상으로 부하 산출(월경 전 구간·생리 중 가중) |
| `computeEventLoad(events)` | 그날 사건들의 category/intensity를 부하로 집계 |
| `computeRhythmLoad(loads)` | `emotional*0.30 + appetite*0.15 + sleep*0.15 + body*0.15 + cycle*0.10 + event*0.15` |
| `computeDailyScore(date, state)` | 위 전부 조합 → `DailyScore` 1건 생성(모드 분류·서브라벨·confidence 포함) |

### B. 생리 주기 (`lib/cycle`)
| 함수 | 하는 일 |
|---|---|
| `getPeriodStarts(cycleLogs)` | periodStart 표시일 목록 추출 |
| `predictCycle(starts, settings)` | 시작일 간격 → 평균/중앙값 주기, 다음 예정일 |
| `getCyclePhase(date, cycleLogs, settings)` | `{ inPeriod, periodDay, daysUntilNext, isPremenstrual, isOvulationEstimate }` |
| `computeCycleStrength(state)` | 개인 기록상 월경 전 구간과 감정/식욕/몸의 상관 강도 → `'strong'|'weak'|'insufficient'` (약하면 "강하지 않음" 표기) |

### C. 모드 분류 (`lib/mode`)
| 함수 | 하는 일 |
|---|---|
| `classifyDayType(score: DailyScore)` | 부하 조합 → 10개 모드 중 1개(안정/집중 가능/감정 민감/식욕 변동/신체 부하/사회 피로/충동 경계/회복 우선/원인 미상/복합 흔들림) |
| `generateSubLabel(dayType, score, topFactors)` | 동적 괄호 문구(예: 감정+자기비난↑→"자기평가 보류", 식욕+야식↑→"야식 경보", 원인미상→"미제 사건") |

### D. 패턴 분석 (`lib/analysis`)
| 함수 | 하는 일 |
|---|---|
| `computeBaseline(state, metric, days=30)` | 최근 30일 개인 기준선 평균 |
| `computeFactorEffect(factorGroup, metric, window)` | `요인 있던 날 결과평균 - 없던 날 결과평균`, window ∈ {당일,전날,최근3일,최근7일} |
| `computeConfidence({n, effect, consistency, recency, overlap})` | `기록수35% + 효과크기35% + 일관성20% + 최근성10% - 겹침패널티` |
| `classifyConfidence(c)` | 0~30 참고 / 31~55 가능성 / 56~75 유력 / 76~100 반복 강함 |
| `computeComboEffect(A, B, metric)` | `A&B 평균 - max(A만, B만, 평소)`; 데이터 부족 시 미표시 |
| `detectUnexplained(date, score, topFactors)` | rhythmLoad 높음 + 상위 후보 confidence 낮음 + 사건으로 설명 부족 → 원인 미상 판정 |
| `mapCustomFactorToGroup(input)` | 커스텀 라벨/카테고리 → mappedFactorGroup 추정 |
| `clusterSimilarCustomFactors(events)` | 유사 커스텀 요인 묶기(예: 체중 관련 → body_image_trigger) |

### E. 회복 분석 (`lib/analysis/recovery`)
| 함수 | 하는 일 |
|---|---|
| `computeRecoveryDelta(r: RecoveryLog)` | `기분개선=after-before`, `불안감소=before-after`, `식욕안정`, `몸부하감소` |
| `computeNextDayRecoveryEffect(action, state)` | 행동한 다음날 평균 상태 vs 안 한 다음날 평균 |
| `computeRecoveryScore(delta)` | `기분개선*1.2 + 불안감소*1.1 + 짜증감소*0.9 + 식욕안정*0.8 + 몸부하감소*0.7` |
| `rankRecoveryActions(state)` | "나를 살린 것들 / 효과 확인 중 / 개인 회복템" 분류 + 랭킹 |

### F. 예보 & 설계 (`lib/forecast`)
| 함수 | 하는 일 |
|---|---|
| `forecastTomorrow(state)` | 주기 위상 + 최근 추세 + 패턴 → 내일 모드 후보 + **가능성 %**(단정 금지) |
| `findSimilarPastDays(targetScore, state)` | 점수 벡터 유사도로 비슷한 과거 날 검색 |
| `recommendRecoveryForToday(score, state)` | 비슷한 날 효과 좋았던 회복 행동 추천 |
| `buildDayPlan(dayType, score, topFactors)` | 4줄 설계(일정/식사/운동/관계) 위험 방향별 동적 생성 |

> 모든 분석 함수는 **데이터 부족 시 결과 대신 "데이터 부족" 상태를 반환**해야 한다(빈 추정 금지).

---

## 6. 구현 단계 분해 (1단계 이후 로드맵)

| 단계 | 범위 | 산출물 |
|---|---|---|
| **1단계** | 타입 + enums + 카탈로그 + 가중치 상수 + 저장/마이그레이션 + AppContext 골격 | 컴파일되는 데이터 레이어, 더미 데이터 시드 |
| **2단계** | `lib/scoring` 전부 + `lib/date` + 단위 검증(샘플 입력→기대 점수) | `computeDailyScore` 동작 |
| **3단계** | `lib/cycle` 주기 계산 + cycleLoad 연동 + cycleStrength | 주기 위상 산출 |
| **4단계** | `lib/mode` 분류 + 동적 서브라벨 | 오늘 모드 결정 |
| **5단계** | 디자인 토큰(colors/typography/radius) + 공통 컴포넌트 + MoodMochi(SVG) + 탭 네비게이션 | 빈 화면 5탭 이동 |
| **6단계** | 기록 화면(상태/사건/생리/회복 + 커스텀 요인 추가) → 실제 쓰기 | 하루 기록 저장 가능 |
| **7단계** | 오늘 화면(모드카드/요인후보/4줄설계/회복추천/빠른기록 진입) | 오늘 해석 표시 |
| **8단계** | 캘린더(렌즈별 색 램프) | 월간 명암 뷰 |
| **9단계** | `lib/analysis` (기준선/요인효과/신뢰도/공범/원인미상/회복) | patternInsights 생성 |
| **10단계** | 분석 화면(흐름 그래프/상습 리포트/공범/나를 살린 것들/미제 사건) | 인사이트 시각화 |
| **11단계** | `lib/forecast` + 예보 화면(가능성%/주간 흐름/미리 챙길 것) | 내일 설계 |
| **12단계** | 온보딩 + 설정(톤/주기 on-off/프라이버시) + 빈/부족 상태 카피 + 접근성/리듀스모션 | 출시 후보 |

원칙: **데이터 레이어 → 계산(lib) → 화면** 순. 화면보다 lib을 먼저 끝내야 가짜 데이터 의존을 피한다.

---

## 7. 각 단계별 완료 기준 (Definition of Done)

- **1단계**: `npm run typecheck` 통과. 더미 상태 로드/저장/마이그레이션 왕복 무손실.
- **2단계**: 명세 공식과 일치하는 샘플 입력→출력 표 검증. 모든 load 0~100 보장(클램프 테스트).
- **3단계**: 시작일 3건 이상 → 평균 주기/다음 예정일/위상 정확. 데이터 1건이면 `insufficient` 반환.
- **4단계**: 10개 모드 각각을 트리거하는 점수 픽스처 존재. 서브라벨이 상황별로 달라짐(고정 아님) 확인.
- **5단계**: 5탭 이동 + 다크/라이트 토글 + 캐릭터 표정 6종 렌더. 리듀스모션 시 애니메이션 정지.
- **6단계**: 상태/사건/생리/회복 + 커스텀 요인 저장 후 재시작해도 유지. **생리가 사건 칩에 없음**(규칙 검증).
- **7단계**: 오늘 모드/괄호 문구/요인 후보(신뢰도 등급)/4줄 설계가 실제 기록 기반으로 표시. 기록 0일이면 "데이터 부족" 카피.
- **8단계**: 렌즈 7종 색 램프 전환. 미기록일은 비활성 셀. 아이콘 남발 없음(색+짧은 라벨).
- **9단계**: 요인효과 4창 계산 + confidence 등급 + 공범(데이터 부족 시 숨김) + 원인 미상 판정 동작.
- **10단계**: "원인입니다" 류 문구 0건(린트/카피 점검). 모든 인사이트에 신뢰도/근거일수 표기.
- **11단계**: 예보가 % 가능성으로만 표현(확정 표현 0건). 비슷한 날 기반 회복 추천 노출.
- **12단계**: 온보딩→첫 기록 플로우 완주. 톤/주기/프라이버시 설정 반영. 빈 상태/부족 상태 카피 전부 존재.

각 단계 공통: 절대 규칙(섹션 0) 위반 0건, `typecheck` 통과, 단정 표현 금지 카피 점검.

---

## 8. 위험한 구현 실수 목록 (사전 차단)

1. **원인 추측 UI 부활** — "이유 같았던 건?" 류 질문을 무심코 재도입. → 기록 화면 카피 리뷰 체크리스트화.
2. **생리를 사건 요인으로 노출** — 사용자가 주기를 요인 선택. → 사건 카탈로그에 주기 코드 자체를 넣지 않음.
3. **단정 문구** — "생리 때문입니다", "원인입니다", "내일은 회복 우선일입니다". → 문구는 템플릿 함수로만 생성, 금지어 린트.
4. **고정 괄호 문구** — 서브라벨/4줄 설계 하드코딩. → 반드시 `generateSubLabel`/`buildDayPlan` 경유.
5. **데이터 부족인데 자신 있게 분석** — 표본 적은데 효과 단정. → 모든 분석 함수 최소 표본 게이트 + "데이터 부족" 반환.
6. **점수 정규화 누락** — 0~100 넘거나 음수. → `normalizeToLoad` 단일 통과 + 클램프.
7. **파생 캐시를 진실로 취급** — dailyScores/insights를 직접 수정. → 원본은 logs뿐, 캐시는 재계산 가능 유지.
8. **시간창 혼동** — 당일/전날/3일/7일 효과를 섞음. → window를 명시 인자로, 셀렉터에서 분리.
9. **겹침(교란) 무시** — 수면부족과 월경전이 늘 같이 와서 효과 중복 계산. → confidence에 겹침 패널티 반영.
10. **주기 강제 적용** — 상관 약한 사용자에게도 주기 단정. → `cycleStrength`로 "강하지 않음" 분기.
11. **회복 분석 경시** — 트리거만 분석. → 회복은 동등 비중, 전후+다음날 두 방식 모두.
12. **타임존/날짜 경계 버그** — 자정 전후 기록이 다른 날로. → 로컬 ISODate 단일 유틸로 통일.
13. **AsyncStorage 비대화** — 단일 키에 전체 누적 → 느려짐. → 컬렉션 분리/지연 로드 설계.
14. **캐릭터/그래프 성능** — SVG 다수 + 애니메이션 프레임 드랍. → 메모이즈 + 리듀스모션 대응.
15. **의료적 오해 소지 카피** — 진단처럼 읽히는 표현. → 면책 카피 + 부드러운 톤 기본.

---

## 9. 다음 단계용 "1단계 프롬프트" 초안

> 아래는 사용자가 **"1단계 시작"** 시 그대로 쓰거나 다듬어 줄 프롬프트 초안입니다.

```
1단계 시작.

목표: MODE의 데이터 레이어를 구현한다. 화면/계산 로직은 아직 만들지 마라.
0단계 계획서(docs/PHASE_0_PLAN.md)의 데이터 모델과 폴더 구조를 따른다.

구현 범위:
1. src/types/index.ts — DailyLog, EventLog, CycleLog, RecoveryLog, DailyScore,
   PatternInsight, UserSettings, AppState 인터페이스. (계획서 3장 스케치 확정)
2. src/types/enums.ts — 상태코드/사건코드/회복코드/모드타입(DayType)/카테고리 상수와
   코드↔한글 라벨 맵.
3. src/constants/factorCatalog.ts — "오늘 있었던 일" 사건 카탈로그
   (명세의 항목 전체, 각 항목에 category와 mappedFactorGroup 부여). 생리/주기 항목은 넣지 않는다.
4. src/constants/recoveryCatalog.ts — 회복 행동 카탈로그(명세 항목 전체).
5. src/constants/weights.ts — 점수 공식 가중치 상수를 한 곳에 모은다(계획서 4장 공식).
6. src/constants/defaultConfig.ts — 기본 UserSettings + 빈 AppState 팩토리(createDefaultState).
7. src/storage/db.ts + migrations.ts — AsyncStorage 영속화, schemaVersion,
   mergeWithDefaults 패턴 계승(군월급 storage 참고). 컬렉션 분리 저장.
8. src/state/AppContext.tsx — 상태 보관 + 로드/저장 + 기록 추가/수정/삭제 액션 골격
   (addDailyLog, upsertEventLog, addCycleLog, addRecoveryLog, updateSettings 등).
   파생 계산은 다음 단계이므로 셀렉터 자리만 비워둔다.

제약:
- 한국어 JSDoc 주석, 기존 코드 컨벤션 유지.
- 생리/주기를 사용자가 요인으로 선택하는 경로를 만들지 마라.
- npm run typecheck 가 통과해야 한다.
- 더미 시드 데이터로 저장→재로드 왕복이 무손실인지 확인할 수 있게 해라.

완료 후: 만든 파일 목록과 타입 구조 요약, 그리고 2단계(점수 계산)에서
보강이 필요한 입력 필드(예: 수면시간/질/악몽, mealSkipped/야식 매핑)를 알려줘.
```

---

### 0단계 종료
계획만 수립했고 구현은 시작하지 않았다. **"1단계 시작"** 지시를 기다린다.
