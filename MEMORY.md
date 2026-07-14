# MEMORY.md

## Goal
- GitHub Pages용 프로페셔널 웹사이트 완성
- 반응형 데스크톱 및 모바일 지원
- `Games` 탭 구현
- 키보드와 모바일 터치로 조작 가능한 지렁이 게임 구현
- GitHub Pages 최초 배포
- Step 1의 `[게임 추가 기능:]` 요구사항 반영

## Required Deliverables
- 프로젝트 루트의 `index.html`
- `styles.css`
- `script.js`
- 필요한 경우 별도 `game.js`
- 필요한 이미지 및 정적 assets
- `AORR.md`
- `MEMORY.md`

## Current Scope
- 정적 HTML, CSS, JavaScript
- 프로페셔널 웹사이트 콘텐츠
- 반응형 레이아웃
- `Games` 탭
- 지렁이 게임
- GitHub Pages 배포

## Out of Scope
- 백엔드 서버
- 데이터베이스
- 로그인 및 회원가입
- 결제
- 사용자 개인정보 수집
- 별도 승인 없는 외부 API
- 별도 승인 없는 프레임워크 전환

## Current State

| Field | Value |
|---|---|
| 현재 상태 | 로컬 구현 및 검증 완료, 배포 승인 대기 |
| 완료한 루프 | 저장소 및 기존 파일 확인, 정적 사이트 기본 구조, 프로페셔널 섹션, 반응형 내비게이션, Games 탭, 지렁이 게임 핵심 기능 |
| 다음 루프 | GitHub Pages 배포 승인 요청 |
| 현재 Retry 횟수 | 0 |
| 현재 오류 fingerprint | `ENVIRONMENT|browser-headless|9222|chrome-headless-exit` |
| Blocker | 배포 승인 필요 [사람 확인 필요] |
| 마지막 정상 상태 | 로컬 서버 200 응답, 게임 초기화/점수/일시정지/재시작/반대방향 방지 검증 완료 |

## Guardrails
- 기존 개인 콘텐츠 임의 삭제 금지
- 확인되지 않은 경력이나 프로젝트 정보 생성 금지
- 테스트 삭제 또는 완화 금지
- 토큰 출력 금지
- 토큰을 HTML, CSS, JavaScript에 저장 금지
- 토큰을 Git에 커밋 금지
- `github_token.txt` 커밋 금지
- `env_settings.txt` 커밋 금지
- 백엔드 기능 추가 금지
- 대규모 리팩토링 금지
- 테스트를 통과시키기 위한 기능 제거 금지

## Acceptance Criteria
- 루트 `index.html` 존재
- 로컬 정적 서버에서 정상 로드
- CSS와 JavaScript 정상 로드
- 콘솔 오류 없음
- 모바일 및 데스크톱에서 레이아웃 정상
- `Games` 탭 정상 이동
- 지렁이 게임 정상 실행
- 키보드 조작 정상
- 모바일 터치 조작 정상
- 점수 및 재시작 정상
- GitHub Pages에서 HTTP 200 응답
- 배포된 사이트에서도 동일 기능 정상

## Retry Policy
- 하나의 오류당 최대 3회
- 동일 오류 fingerprint 2회 반복 시 중지
- 한 번의 Retry에서 하나의 원인만 수정
- Retry마다 동일 Verifier 재실행

## HITL Conditions
- 개인 프로필 내용 불명확
- 기존 콘텐츠 삭제 필요
- 요구사항 충돌
- GitHub 저장소 권한 부족
- GitHub Pages 설정 변경 필요
- 외부 서비스 추가 필요
- Retry 한계 도달

## Tool Policy
- Codex는 작업 제어, 파일 수정, 테스트 실행 담당
- 가능하면 Claude Code CLI를 독립 Verifier로 사용
- 실제 사용한 Claude 모델명 기록
- 토큰 값은 어떠한 실행 기록에도 남기지 않음

## Execution Log Template

| Field | Value |
|---|---|
| Loop ID | |
| 시작 시각 | |
| 목표 | |
| 시작 상태 | |
| 가설 | |
| Act | |
| 변경 파일 | |
| Verifier | |
| 테스트 결과 | |
| exit code | |
| 오류 fingerprint | |
| Retry 횟수 | |
| 종료 상태 | |
| 다음 작업 | |
| 사람 확인 필요 항목 | |

## Notes
- 현재 프로젝트는 루트에 설계 문서와 메모리 문서만 존재하는 초기 상태다.
- `github_token.txt`는 존재할 수 있으나, 토큰 값은 읽기/출력/저장/커밋 대상으로 사용하지 않는다.
- 구현 작업은 `AORR.md`의 상태 머신과 `MEMORY.md`의 가드레일을 함께 따른다.

## Latest Execution Log

| Field | Value |
|---|---|
| Loop ID | 2026-07-14-01 |
| 시작 시각 | 2026-07-14 14:07:31 +09:00 |
| 목표 | GitHub Pages에서 실행 가능한 정적 웹사이트의 가장 안전한 기본 구조 생성 |
| 시작 상태 | READY |
| 가설 | 루트에 `index.html`, `styles.css`, `script.js`를 최소 구조로 추가하면 정적 서버에서 안전하게 열릴 것이다 |
| Act | 최소 정적 사이트 골격 생성, 기본 반응형 내비게이션 추가, Games 섹션 자리 마련 |
| 변경 파일 | `index.html`, `styles.css`, `script.js` |
| Verifier | `node --check script.js`; Python HTML/CSS import assertions; `python -m http.server 8000` + `Invoke-WebRequest`; `claude -p --output-format json --model sonnet ...` |
| 테스트 결과 | HTML/CSS 연결 확인됨, `index.html` 존재 확인됨, 로컬 서버에서 `index.html`/`styles.css`/`script.js` 모두 HTTP 200, 모의 DOM에서 시작/일시정지/재시작/점수/반대방향 방지 검증 완료, 실제 브라우저 헤드리스 자동화는 환경 문제로 즉시 종료됨 |
| exit code | `node --check` 0; HTML/CSS 검증 0; HTTP 검증 0; 모의 DOM 검증 0; Claude CLI 124; 브라우저 헤드리스 종료 1 |
| 오류 fingerprint | `ENVIRONMENT|browser-headless|9222|chrome-headless-exit` |
| Retry 횟수 | 0 |
| 종료 상태 | DEPLOY_APPROVAL_REQUIRED |
| 다음 작업 | 사용자에게 GitHub Pages 최초 배포 승인 요청 |
| 사람 확인 필요 항목 | 개인 소개, 경력, 프로젝트, 연락처 문구, 배포 승인 |

## Current Execution Log

| Field | Value |
|---|---|
| Loop ID | 2026-07-14-02 |
| 시작 시각 | 2026-07-14 14:07:31 +09:00 |
| 목표 | 정적 개인 웹사이트의 필수 영역, 반응형 디자인, Games 탭, 지렁이 게임 핵심 기능 완성 |
| 시작 상태 | READY |
| 가설 | 기존 골격에 프로페셔널 섹션과 게임 구현을 더하면 로컬에서 완전한 정적 사이트로 동작할 것이다 |
| Act | `index.html`, `styles.css`, `script.js`를 전면 구성하고 게임 로직과 반응형 UI를 구현 |
| 변경 파일 | `index.html`, `styles.css`, `script.js`, `.gitignore` |
| Verifier | `node --check script.js`; 정적 HTML/CSS 연결 확인; `python -m http.server 8000` + `Invoke-WebRequest`; 모의 DOM 기반 게임 런타임 검증; 헤드리스 브라우저 자동화 시도 |
| 테스트 결과 | HTML/CSS/JS 연결 확인됨, 로컬 서버에서 세 파일 모두 HTTP 200, 모의 DOM에서 시작/일시정지/재시작/점수/반대방향 방지/점수 증가 검증 완료, `git commit` 성공, `git push`는 네트워크 연결 실패 |
| exit code | `node --check` 0; HTML/CSS 검증 0; HTTP 검증 0; 모의 DOM 검증 0; `git commit` 0; `git push` 1 |
| 오류 fingerprint | `ENVIRONMENT|git-push|github.com:443|connect-failed` |
| Retry 횟수 | 0 |
| 종료 상태 | BLOCKED |
| 다음 작업 | GitHub 네트워크 또는 접근 문제 해결 후 push 재시도 |
| 사람 확인 필요 항목 | 개인 소개, 경력, 프로젝트, 연락처, GitHub 연결 문제 해결 |
