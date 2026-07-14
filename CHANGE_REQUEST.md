# Change Request

## Change Request ID
- `CRQ-2026-07-14-01`

## Baseline
- Last normal deployed commit: `8a59b2b`
- Last normal deployed URL: `https://hwoni.github.io/`
- Current local branch: `main`
- Current local HEAD: `8a59b2b`

## Current Status
- `CHANGE_IN_PROGRESS`

## User Request Original
> #게임
> 지렁이가 움직이는 속도를 지금 보다 0.5배로 줄여주세요.
> "Start" 버튼을 눌러야 시작할 수 있도록 해주세요.
> 아이템은 사과아이콘로 바꿔주세요.
> 지렁이는 얼굴은 크롱으로 바꿔주세요.
> 게임에 실패 했을 경우는 "비웃음 표시" 가 보이도록 해주세요
> 게임판의 해상도는 조금더 적게 되도록 해주세요. (네모칸이 좀더 작아야합니다.)
> "방향키판" 바로 위에 Start Pause Stop 버튼이 있어야합니다.
>
> #웹사이트
> "Selected work" 의 3개의 탭에는 각각의 항목별로 한줄씩 잘 정리되도록 해주세요.

## Reference Files
- [AORR.md](./AORR.md)
- [MEMORY.md](./MEMORY.md)
- Deployed GitHub Pages site: `https://hwoni.github.io/`
- Repository: `https://github.com/hwoni/hwoni.github.io`

## Change Items

| ID | Request | Summary | Categories | Current Behavior | Expected Behavior | Files | Risk | Deploy |
|---|---|---|---|---|---|---|---|---|
| CR-001 | 지렁이가 움직이는 속도를 지금 보다 0.5배로 줄여주세요. | Slow snake speed by half. | `GAME_LOGIC`, `SPEC_CHANGE` | Snake currently advances at the current tick rate. | Snake movement becomes 0.5x the current speed. | `script.js`, `styles.css` [사람 확인 필요] | MEDIUM | No |
| CR-002 | "Start" 버튼을 눌러야 시작할 수 있도록 해주세요. | Require Start button before gameplay begins. | `GAME_STATE`, `GAME_CONTROL`, `UI_UX` | Game can begin from current input flow and may start without the Start button being the only entry point. | Snake only starts after pressing `Start`. | `script.js`, `index.html` | MEDIUM | No |
| CR-003 | 아이템은 사과아이콘로 바꿔주세요. | Replace food/item visual with an apple icon. | `GAME_ENTITY`, `GAME_EFFECT`, `UI_UX` | Current food uses the existing non-apple visual. | Food is rendered as an apple icon. | `script.js`, `styles.css`, `index.html` [사람 확인 필요] | MEDIUM | No |
| CR-004 | 지렁이는 얼굴은 크롱으로 바꿔주세요. | Replace snake face with a Croong-like face. | `GAME_ENTITY`, `UI_UX`, `CONTENT` | Snake head uses the current generic visual. | Snake head face is changed to a Croong-like face. | `script.js`, `styles.css`, `index.html` [사람 확인 필요] | HIGH | No |
| CR-005 | 게임에 실패 했을 경우는 "비웃음 표시" 가 보이도록 해주세요 | Show a taunting/laughing indicator on game over. | `GAME_STATE`, `GAME_EFFECT`, `UI_UX` | Game over overlay exists but does not show the requested expression. | Game over displays a visible laughing/taunting mark. | `script.js`, `index.html`, `styles.css` | MEDIUM | No |
| CR-006 | 게임판의 해상도는 조금더 적게 되도록 해주세요. (네모칸이 좀더 작아야합니다.) | Reduce board cell size / change grid density. | `GAME_RENDERING`, `SPEC_CHANGE`, `UI_UX` | Current board cell size and grid density are larger than requested. | Board uses smaller squares, matching the requested tighter resolution. | `script.js`, `styles.css` | MEDIUM | No |
| CR-007 | "방향키판" 바로 위에 Start Pause Stop 버튼이 있어야합니다. | Move controls above the D-pad area. | `GAME_CONTROL`, `UI_UX`, `INFORMATION_ARCHITECTURE` | Control buttons sit above the game body, not directly above the direction pad. | `Start`, `Pause`, `Stop` buttons appear directly above the direction pad. | `index.html`, `styles.css` | LOW | No |
| CR-008 | "Selected work" 의 3개의 탭에는 각각의 항목별로 한줄씩 잘 정리되도록 해주세요. | Rewrite the three work cards as concise one-line entries. | `CONTENT`, `UI_UX`, `INFORMATION_ARCHITECTURE` | Work cards are longer and wrap across multiple lines. | Each selected work card is concise and fits as a single clear line entry. | `index.html`, `styles.css` | LOW | No |

## Request Analysis Notes
- The request is executable as a set of independent change items.
- CR-003 and CR-004 involve visual assets or character likeness. Exact asset source/licensing should be confirmed before implementation. `[사람 확인 필요]`
- CR-006 is somewhat ambiguous because "해상도" and "네모칸이 좀더 작아야합니다" may imply different technical interpretations. The most conservative interpretation is smaller grid cells / denser board rendering. `[사람 확인 필요]`
- The current page structure can remain unchanged while the requested text and game-behavior updates are applied.

## Execution Order
1. Baseline validation and reproduce current behavior
2. CR-002 start gating
3. CR-001 movement speed
4. CR-007 control placement
5. CR-006 board density
6. CR-005 game-over expression
7. CR-003 apple icon
8. CR-004 Croong-like face
9. CR-008 Selected work one-line rewrite
10. Regression test suite
11. GitHub Pages compatibility verification
12. Redeploy approval

## Completion Criteria
- Each Change Item has an objectively verifiable pass condition.
- No existing non-targeted page layout regressions.
- No regression in navigation, responsive layout, keyboard control, touch control, or deployment compatibility.
- All requested text and visual updates are present on the deployed site.

## Test Plan

### Baseline
- Open the current deployed site and compare it with the repository source.
- Confirm current game speed, control flow, board density, and existing content layout.

### Change-By-Change
- Reproduce the current behavior before each item.
- Modify the smallest relevant files only.
- Re-run the same verifier after the fix.
- Run regression checks for the site shell, responsive layout, navigation, and game controls.

### Regression
- Home / About / Experience / Projects / Contact layout
- Mobile navigation
- Games tab
- Keyboard input
- Mobile touch input
- Score, restart, and game over behavior
- GitHub Pages relative paths

## Dependencies
- CR-002 should be implemented before CR-001, CR-003, CR-004, CR-005, CR-006, and CR-007 because the game start flow affects the rest of the gameplay experience.
- CR-007 depends on the existing game UI structure.
- CR-008 is independent from the game loop.

## Rollback Criteria
- Any targeted change breaks existing site navigation or responsive layout.
- Any targeted game change introduces unhandled runtime errors.
- The new asset or face choice cannot be sourced or confirmed.
- GitHub Pages deployment diverges from local behavior.
