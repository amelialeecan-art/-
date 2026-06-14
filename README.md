# 군월급 (Gunwolgup)

> 지금 이 순간에도 월급은 쌓이는 중 — 육군 병사 월급 실시간 카운터 + 군적금 + 전역 예상 자산 앱

군 복무 중인 병사의 **월급이 실시간으로 쌓이는 모습**을 보여주고, **군적금(장병내일준비적금)**과 **전역 예상 자산**까지 한눈에 계산해주는 모바일 앱입니다. Expo + React Native + TypeScript 로 구현되어 iOS / Android 양쪽에서 동작합니다.

## 실행 방법

```bash
npm install
npx expo start
```

- 터미널의 QR 코드를 **Expo Go** 앱(iOS App Store / Google Play)으로 스캔하면 실기기에서 바로 실행됩니다.
- 시뮬레이터: `npx expo start` 후 `i`(iOS) 또는 `a`(Android) 키 입력.
- 타입 검사: `npm run typecheck`

> 외부 서버 없이 100% 로컬로 동작하며, 모든 설정은 기기(AsyncStorage)에 저장됩니다. 앱을 닫았다 켜도 데이터가 유지됩니다.

## 화면 구성 (14)

1. 스플래시 · 2~4. 온보딩(입대정보 / 월급·계급 / 군적금) · 5. 홈(실시간 카운터) ·
6. 실시간 상세 · 7. 군적금 · 8. 전역 예상 자산 · 9. 월별 타임라인 · 10. 목표 ·
11. 통계 · 12. 설정 · 13. 알림 · 14. 전역 축하(콘페티)

## 핵심 계산 로직

실시간 월급은 다음 공식으로 계산합니다 (`src/lib/salaryCalculator.ts`):

```
적립액 = 현재 계급 월급 ÷ 현재 월급 구간 총 초 × 경과한 초
```

- **계급**: 입대일 + 계급별 기간(이병 2 / 일병 6 / 상병 6 / 병장 4 개월, 수정 가능)으로 현재 계급 산출
- **월급 구간**: 월급 지급일(기본 매월 10일) 기준 직전~다음 월급일
- **군적금**: 납입 원금 + 정부 매칭지원금(원금 × 비율) + 단순 적금 이자
- **전역 예상 자산**: 복무 전체 월급 + 군적금 원금 + 매칭지원금 + 예상 이자

소수점 표시 자리수(0/2/5/10)는 설정에서 변경할 수 있고, 카운터는 `requestAnimationFrame`
기반 30fps 루프로 부드럽게 갱신됩니다.

## 폴더 구조

```
App.tsx                  앱 진입점
index.ts                 Expo 루트 등록
src/
  components/            공통 UI (MoneyCounter, Card, ProgressBar, StatCard ...)
  screens/               14개 화면
  navigation/            스택 + 커스텀 하단 탭 네비게이터
  lib/                   계산 로직 (salaryCalculator / savingsCalculator / assets / timeline / dateUtils / formatters)
  storage/               AsyncStorage 영속화
  state/                 전역 상태 컨텍스트 (테마 포함)
  hooks/                 useNow (초 단위 시계)
  types/                 도메인 타입 정의
  constants/             기본 설정값
  theme/                 컬러 / 타이포그래피 토큰
```

## 디자인

프로토타입의 **다크 테마 + 라임 그린 포인트**, 카드형 UI, 둥근 모서리, 하단 탭바를
React Native 컴포넌트로 재구현했습니다. 라이트 모드도 지원합니다 (설정 → 다크 모드 토글).

## 앱스토어 / 플레이스토어 출시 준비

`app.json` 에 `ios.bundleIdentifier`, `android.package` 가 설정되어 있습니다.
스토어 제출용 빌드는 EAS 로 생성합니다:

```bash
npm install -g eas-cli
eas build --platform all
```

> 출시 전 `assets/` 에 앱 아이콘 / 스플래시 이미지를 추가하고 `app.json` 의
> `icon`, `splash` 항목을 연결하세요. (현재는 아이콘 미지정 = Expo 기본값 사용)

## 주의

실제 수령액은 정책, 금리, 납입 여부에 따라 달라질 수 있습니다. 본 앱의 금액은 입력값
기반 **예상치**입니다.
