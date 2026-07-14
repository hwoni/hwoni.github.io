# AORR State Machine for LoopEngine01

## 0. Scope

This document defines an executable AORR state machine for building a static professional website from the `hwoni/hwoni.github.io` repository, with a responsive layout and a Games tab containing a snake game that works on keyboard and mobile touch input.

This is a design-only document. No code is modified by this document itself.

## 1. Target

### 1.1 Project Goal
- Build a personal professional website as a static site.
- Support desktop and mobile layouts.
- Add a top-level `Games` tab.
- Implement a snake game that works with keyboard and mobile touch controls.
- Keep the entire solution runnable with HTML, CSS, and JavaScript only.

### 1.2 GitHub Pages Goal
- The final result must run on GitHub Pages without a backend.
- The root directory must contain at minimum:
  - `index.html`
  - `styles.css`
  - `script.js`
  - any additional JavaScript file required for the game, or game code inside `script.js`

### 1.3 Input Materials
- Cloned repository content from `hwoni/hwoni.github.io`.
- Existing static page structure, styles, scripts, images, and metadata.
- Personal content for the professional website [사람 확인 필요] such as:
  - name
  - introduction
  - career history
  - projects
  - contact information
- Game design preferences [사람 확인 필요] such as naming, difficulty, visual style, and control priority.

### 1.4 Required Pages and Sections
- Home or landing section
- About or profile section
- Projects or portfolio section
- Contact section
- `Games` section or page
- Snake game screen
- Basic footer and metadata

### 1.5 Games Tab and Snake Game Requirements
- `Games` must be visible in the top navigation.
- The snake game must support keyboard control.
- The snake game must support mobile touch control.
- The game must show score and game-over state.
- The game must restart without reloading the page.
- The game must remain usable on small screens.

### 1.6 Completion Criteria
Desktop:
- Navigation is readable and usable.
- Main content does not overflow horizontally.
- The site remains visually stable at common desktop widths.
- Snake game is playable with keyboard.

Mobile:
- Navigation is accessible on small screens.
- Text remains readable without layout breakage.
- Tap targets are usable.
- Snake game is playable with touch.
- No critical horizontal scrolling appears.

## 2. Act

### 2.1 Minimum Work Per Development Loop
- Change only one failure cause at a time.
- Edit only the smallest set of related files.
- Keep the loop outcome observable with a verifier.
- Prefer a single concern per loop such as structure, style, controls, or validation.

### 2.2 Editable File Scope
- During early loops, prefer only these files:
  - `index.html`
  - `styles.css`
  - `script.js`
- If the game logic is split later, add the smallest necessary JS file only.
- Avoid unrelated refactors during a fix loop.

### 2.3 Files That May Be Created
- `AORR.md`
- `index.html`
- `styles.css`
- `script.js`
- Additional small helper JS file only if needed for the snake game [사람 확인 필요]

### 2.4 Local Verification Commands
Use one or more of the following depending on the environment:
- `Get-ChildItem`
- `git status --short`
- `Test-Path index.html`
- `Test-Path styles.css`
- `Test-Path script.js`
- `python -m http.server 8000`
- `npx serve .`
- Browser console inspection in a local browser
- Manual desktop and mobile viewport checks

## 3. Observe

Each loop should observe the following where applicable:
- File creation or file presence.
- HTML errors.
- CSS responsiveness problems.
- JavaScript runtime errors.
- Local web server response.
- Browser console errors.
- Desktop and mobile rendering.
- Keyboard game controls.
- Touch game controls.
- GitHub Pages compatibility.

## 4. Reason

Map the observed failure to exactly one cause:
- `HTML_STRUCTURE`
- `CSS_RESPONSIVE`
- `JAVASCRIPT`
- `GAME_LOGIC`
- `GAME_CONTROL`
- `CONTENT`
- `TEST`
- `ENVIRONMENT`
- `GITHUB_PERMISSION`
- `DEPLOYMENT`
- `UNKNOWN`

Rules:
- Use only one primary reason per failed loop.
- If multiple issues appear, fix the earliest blocking issue first.
- If the cause cannot be determined, classify as `UNKNOWN`.

## 5. Repeat

- Fix only one failure cause per retry.
- Change only the minimum files needed for that cause.
- Re-run the same verifier after the fix.
- Also run regression checks on previously passing areas.
- Stop repeating once a loop passes or a stop condition is reached.

## 6. Stop

Stop the loop when any of the following is true:
- All tests pass.
- Maximum retry count is reached.
- The same error fingerprint repeats twice.
- Personal content must be confirmed.
- GitHub authentication or deployment permission is missing.
- Content or repository settings must be changed by a human.

## 7. Human-in-the-loop

Escalate to human confirmation when:
- Name, introduction, career, or project content is unclear [사람 확인 필요].
- Existing content would need deletion.
- External analysis tools or external services must be added.
- GitHub repository settings must be changed.
- Requirements conflict with each other.

## 8. AORR State Machine

### 8.1 State Definitions
- `READY`: Inputs are known, and the next action is clear.
- `ACTING`: A change is being made.
- `VERIFYING`: Verifiers are being run.
- `RETRYING`: A failure was found and a fix loop is being prepared.
- `PASSED`: The step succeeded.
- `DEPLOY_READY`: Build and validation passed; deployment can begin.
- `DEPLOYING`: GitHub Pages deployment is in progress.
- `DEPLOYED`: GitHub Pages deployment succeeded.
- `BLOCKED`: Progress cannot continue without an external fix.
- `HITL_REQUIRED`: Human input is required before proceeding.

### 8.2 State Transitions
- `READY -> ACTING` when the next change is defined.
- `ACTING -> VERIFYING` after the intended edit or setup is complete.
- `VERIFYING -> PASSED` when checks succeed.
- `VERIFYING -> RETRYING` when checks fail.
- `RETRYING -> ACTING` after selecting one primary reason and preparing a minimal fix.
- `RETRYING -> HITL_REQUIRED` when content or decision input is missing.
- `RETRYING -> BLOCKED` when environment, permissions, or deployment cannot proceed.
- `PASSED -> READY` for the next loop.
- `PASSED -> DEPLOY_READY` after all implementation and validation steps are complete.
- `DEPLOY_READY -> DEPLOYING` when deployment starts.
- `DEPLOYING -> DEPLOYED` when GitHub Pages deployment succeeds.
- `DEPLOYING -> BLOCKED` when deployment fails due to permission or environment issues.

### 8.3 Stop Conditions in State Terms
- `PASSED` means the current loop is done.
- `BLOCKED` means the loop cannot continue without external change.
- `HITL_REQUIRED` means a human decision is required.
- `DEPLOYED` means the final publish step is complete.

## 9. Loop Plan

The project should be executed in the following small loops:
1. Repository and existing file check
2. Static site base structure
3. Professional content area
4. Responsive navigation
5. Games tab
6. Snake game core logic
7. Keyboard controls
8. Mobile touch controls
9. Game UI and score
10. Accessibility and responsive validation
11. GitHub Pages compatibility validation
12. Deployment

## 10. Loop Table

| Step | Input | Act | Observe | Output | Test Criteria | Next State |
|---|---|---|---|---|---|---|
| 1. Repository and existing file check | Cloned repo, current tree, README, existing assets, branch state | Inspect files, identify entry points, detect framework or build assumptions | File presence, current branch, existing HTML/CSS/JS structure, asset inventory | Known workspace map and risk list | Can describe the current repo structure and main edit targets | `PASSED` or `HITL_REQUIRED` if content decisions are needed |
| 2. Static site base structure | Repo map, target pages, current layout conventions | Create or adjust base `index.html`, `styles.css`, `script.js` structure | HTML validity, basic layout rendering, file creation | Minimal static site shell | Root files exist and page opens locally without fatal errors | `PASSED` |
| 3. Professional content area | Personal content [사람 확인 필요], site shell, target sections | Add intro, profile, projects, contact, and footer sections | Content placement, section order, readability | Professional website content skeleton | Sections are present and visible on desktop and mobile | `HITL_REQUIRED` if content is missing, otherwise `PASSED` |
| 4. Responsive navigation | Site shell and section IDs | Build top navigation with mobile-friendly behavior | Menu layout, overflow, tap target size, active state | Usable navigation bar | Navigation works at desktop and mobile widths without overflow | `PASSED` or `RETRYING` |
| 5. Games tab | Navigation and section routing | Add `Games` tab and connect it to the game section or page | Tab visibility, click/tap routing, section activation | Reachable `Games` area | `Games` is accessible from the top navigation | `PASSED` or `RETRYING` |
| 6. Snake game core logic | Game container, canvas/grid, spawn rules | Implement snake movement, food, collision, score, restart | Game state updates, collision behavior, restart behavior | Playable snake game core | Game starts, food appears, score changes, collisions end the game correctly | `PASSED` or `RETRYING` |
| 7. Keyboard controls | Game core and focus handling | Add arrow key or WASD input, direction locking, pause if needed [사람 확인 필요] | Input responsiveness, invalid reverse prevention, browser shortcut conflicts | Keyboard-controlled game | A full game round is possible using keyboard only | `PASSED` or `RETRYING` |
| 8. Mobile touch controls | Game core, touch surface, mobile layout | Add swipe or button-based touch controls | Gesture recognition, accidental scroll behavior, hit area usability | Touch-controlled game | A full game round is possible on mobile by touch | `PASSED` or `RETRYING` |
| 9. Game UI and score | Game core, layout, overlay states | Add score display, start/restart UI, game-over messaging | Visibility, alignment, text wrapping, state transitions | Clear game UI | Score and game state are always visible and readable | `PASSED` or `RETRYING` |
| 10. Accessibility and responsive validation | Completed site and game | Check contrast, semantic HTML, focus order, small-screen layout | Mobile screenshots, keyboard focus, overflow, console errors | Validation findings and fixes | No critical accessibility or responsive failures remain | `PASSED` or `RETRYING` |
| 11. GitHub Pages compatibility validation | Final static site files | Confirm relative paths, static-only assets, no backend assumptions | Console/network checks, 404 checks, local static hosting behavior | GitHub Pages-safe build state | Site works under a static file server and GitHub Pages constraints | `DEPLOY_READY` or `RETRYING` |
| 12. Deployment | `DEPLOY_READY` state, repo access, GitHub auth [사람 확인 필요] | Publish to GitHub Pages | Deployment success, public URL availability | Deployed static website | Public URL loads with no fatal errors | `DEPLOYED` or `BLOCKED` |

## 11. Failure Classification Guidance

### HTML_STRUCTURE
Use when the DOM order, missing tags, or section layout prevents the page from rendering correctly.

### CSS_RESPONSIVE
Use when the page renders but breaks at mobile or desktop widths, or overflow and spacing cause usability issues.

### JAVASCRIPT
Use when script load, runtime exceptions, or event wiring fails outside the game rules themselves.

### GAME_LOGIC
Use when the snake rules, scoring, spawning, collision, or restart behavior is wrong.

### GAME_CONTROL
Use when keyboard or touch input does not move the snake correctly, or input handling is unreliable.

### CONTENT
Use when the issue is missing, unclear, or incorrect personal/professional content.

### TEST
Use when validation cannot be run, the verifier is missing, or the test setup is insufficient.

### ENVIRONMENT
Use when the local machine, browser, or static server prevents progress.

### GITHUB_PERMISSION
Use when repository access, token availability, or GitHub auth is missing.

### DEPLOYMENT
Use when GitHub Pages setup or publishing fails.

### UNKNOWN
Use only when the problem cannot be confidently classified.

## 12. Recommended First Loop

The safest first loop is:
- `Repository and existing file check`

Reason:
- It has the lowest risk.
- It clarifies whether the repo already contains a framework, build step, or existing design system.
- It prevents unnecessary edits to the wrong files.
- It reduces the chance of guessing on the site architecture.

## 13. Notes for Execution

- Do not delete existing content unless a human confirms it [사람 확인 필요].
- Keep all fixes minimal and local.
- Prefer static HTML/CSS/JS implementations that work on GitHub Pages.
- If the same failure repeats twice, stop and re-evaluate the loop.
- If deployment credentials are required, stop and request human help rather than guessing.

## 14. Self-Correcting TDD Loop

This section defines a Verifier-first self-correcting TDD loop for the static website project.

### 14.1 Verified Local Tooling

The following tools are present in the current environment:
- `Get-ChildItem`
- `Get-Content`
- `Get-Command`
- `Test-Path`
- `git`
- `node`
- `npm`
- `python`
- `python3`
- `claude`
- `codex`

Available local verification commands confirmed by inspection:
- `git status --short`
- `Get-ChildItem -Force -Recurse`
- `Test-Path index.html`
- `Test-Path styles.css`
- `Test-Path script.js`
- `python -m http.server 8000`
- `claude --help`
- `claude --version`

Confirmed repository structure at the time of this design:
- The workspace root contains `AORR.md`.
- No implementation files exist yet in the root.
- `index.html`, `styles.css`, and `script.js` are not present yet.

### 14.2 Claude Code CLI Model Check

Observed from `claude --help`:
- The CLI supports `--model`.
- The help text mentions aliases such as `sonnet` and full model names such as `claude-fable-5`.
- The help output does not explicitly confirm a distinct `sonnet-5` or `claude-sonnet-5` identifier.

Model policy for the verifier:
- If a future runtime check confirms a Sonnet 5 identifier, use that exact model.
- If Sonnet 5 cannot be confirmed, use the currently available Sonnet-family model exposed by the CLI and record the exact identifier used at runtime.
- If model selection or auth fails, classify as `ENVIRONMENT` or `GITHUB_PERMISSION` only after confirming the failure is not caused by project code.

### 14.3 Verifier Order

Use the following verifier order in each implementation loop:
1. File existence verifier.
2. Static HTML structure verifier.
3. CSS responsiveness verifier.
4. JavaScript syntax and runtime verifier.
5. Snake game behavior verifier.
6. Browser console verifier.
7. Local HTTP server verifier.
8. GitHub Pages compatibility verifier.
9. Claude Code CLI independent review verifier, if available.

### 14.4 Self-Correcting Loop States

`READY`
- Input files and expected behavior are known.
- The next smallest failing concern is selected.

`ACTING`
- Only the minimal related files are edited.
- No unrelated refactor is allowed.

`VERIFYING`
- The relevant verifier set is executed.
- The output is captured exactly, including exit code and error text.

`RETRYING`
- One primary failure reason is chosen.
- A minimal fix is prepared for that single reason.

`PASSED`
- The targeted concern has passed its verifier set.
- Previously passing checks are re-run when the fix could affect them.

`HITL_REQUIRED`
- Personal content, design preference, or repo settings require a human decision.

`BLOCKED`
- The environment, permissions, or external service prevents further progress.

`DEPLOY_READY`
- All implementation verifiers pass.
- GitHub Pages compatibility checks are green.

`DEPLOYING`
- Deployment commands are running.

`DEPLOYED`
- The GitHub Pages deployment is complete.

### 14.5 TDD Loop Table

| Loop | Goal | Input | Act | Verifier | Observe | Output | Failure Fingerprint | Primary Reason | Next State |
|---|---|---|---|---|---|---|---|---|---|
| 0. Repo bootstrap | Confirm the workspace can support a static site | Current tree, `git status`, `Test-Path` results | Check whether root files exist and whether the repo is empty or partially populated | `Get-ChildItem -Force -Recurse`, `Test-Path index.html`, `Test-Path styles.css`, `Test-Path script.js` | Missing files, unexpected build tools, existing content, path casing issues | Known starting point and file plan | Missing root files or unexpected structure | `HTML_STRUCTURE` or `ENVIRONMENT` | `READY` or `HITL_REQUIRED` |
| 1. HTML skeleton | Create the minimum valid static page shell | Repo map, target sections, GitHub Pages rules | Add or adjust `index.html` only as needed for a valid document shell | HTML file existence, syntax scan, browser open, local HTTP response | `title`, `meta viewport`, semantic landmarks, nav, Games placeholder | Loadable page shell | Missing document structure, broken links, bad paths | `HTML_STRUCTURE` | `VERIFYING` |
| 2. CSS baseline | Make the shell responsive | HTML shell and layout requirements | Edit `styles.css` only for layout, spacing, typography, and breakpoints | Viewports around 375px, 768px, 1440px; horizontal overflow check | Layout stability, navigation wrapping, tap target size | Responsive static site baseline | Mobile overflow, cramped nav, unreadable text | `CSS_RESPONSIVE` | `VERIFYING` |
| 3. JS bootstrap | Attach site behavior without runtime errors | HTML hooks and interaction targets | Edit `script.js` only for DOM hookup and navigation behavior | Browser console, page-load execution, null-reference scan | No runtime exceptions, no duplicate listeners | Safe client-side behavior layer | DOM null, duplicate listeners, load-time crashes | `JAVASCRIPT` | `VERIFYING` |
| 4. Games tab wiring | Expose Games area from navigation | Completed shell and nav | Add the `Games` entry and connect it to the game surface | Link click, section visibility, back navigation, console | Tab opens the correct area without breaking layout | Reachable Games area | Missing link target, incorrect routing | `HTML_STRUCTURE` or `JAVASCRIPT` | `VERIFYING` |
| 5. Snake core TDD | Build the game rules incrementally | Game canvas/grid, score element, restart hooks | Implement one rule at a time: start, move, food, collision, restart | Unit-like behavior checks via browser interaction and console state | Score increments, food spawns, collision ends game | Playable core game loop | Broken movement, bad collision, bad restart | `GAME_LOGIC` | `VERIFYING` |
| 6. Keyboard control TDD | Make the game playable by keyboard | Game core and focusable game surface | Add arrow keys and WASD, prevent reverse-turn glitches | Keypress simulation or manual keyboard checks, browser console | Direction changes, no illegal reverse on same tick | Keyboard playable game | Key handling ignored or unstable | `GAME_CONTROL` | `VERIFYING` |
| 7. Mobile touch TDD | Make the game playable on touch devices | Game core and mobile UI affordance | Add touch buttons or swipe handling | Mobile viewport, touch interaction, scroll interference check | Touch input changes direction without accidental scroll | Touch playable game | Touch gestures fail or scroll blocks play | `GAME_CONTROL` | `VERIFYING` |
| 8. UI and score TDD | Make the game understandable | Game state and visual layout | Add score, pause or restart messaging, game-over overlay | Visual review, console, replay behavior | UI remains readable on small screens | Clear game UX | Score hidden, game state unclear | `CSS_RESPONSIVE` or `GAME_LOGIC` | `VERIFYING` |
| 9. HTML and link integrity | Eliminate broken structure | Final HTML/CSS/JS draft | Scan for broken internal links, invalid relative paths, missing alt text | File path checks, browser navigation, console 404s | No broken anchors or asset references | Link-safe static site | Missing assets, bad paths, case mismatch | `HTML_STRUCTURE` | `VERIFYING` |
| 10. GitHub Pages compatibility | Confirm static-only deployment safety | Final site files | Verify relative paths, no backend API use, no local filesystem dependence | Static-server response, path scan, page reloads | Same behavior under local HTTP as under file tree | GitHub Pages-safe build state | Absolute local paths, server-only code, API dependence | `DEPLOYMENT` or `ENVIRONMENT` | `DEPLOY_READY` |
| 11. Independent verifier pass | Reduce blind spots before deploy | All files and prior verifier outputs | Run an independent review with Claude Code CLI if available | `claude --help`, then runtime review only if auth/model is available | Additional failure findings or confirmation of pass | Extra confidence report | CLI unavailable, auth missing, or model unresolved | `TEST`, `ENVIRONMENT`, or `GITHUB_PERMISSION` | `PASSED` or `BLOCKED` |

### 14.6 Failure Log Format

Every failed verifier run should capture:
- Executed command.
- Exit code.
- Failed verification item.
- Core error message.
- Related file and line.
- Browser console message, if any.
- Error fingerprint.

Fingerprint format recommendation:
- `CAUSE|file|line|message-hash|verifier`

### 14.7 Retry Policy

Rules:
- Fix exactly one primary cause per retry.
- Touch only the minimal files associated with that cause.
- Do not weaken or delete tests.
- Re-run the same verifier set after the fix.
- Re-run a small regression subset for previously passing behavior.
- Stop after 3 retries for the same issue.
- Stop immediately if the same fingerprint repeats twice.

### 14.8 Practical Verifier Map for This Repository

Because the current workspace is still bootstrap-only, the first practical verifiers are:
- Root file presence checks.
- `index.html` document validity.
- `styles.css` responsive layout checks.
- `script.js` syntax and console checks.
- Static HTTP serving with `python -m http.server 8000`.
- Browser viewport checks at approximately 375px, 768px, and 1440px.
- Keyboard and touch game interaction checks once the game exists.

### 14.9 First Implementation Sequence

Recommended order for the first real implementation loop:
1. Create or confirm `index.html`.
2. Create or confirm `styles.css`.
3. Create or confirm `script.js`.
4. Validate document shell and local server response.
5. Add responsive layout.
6. Add Games tab.
7. Add snake game logic.
8. Add keyboard and touch controls.
9. Run compatibility and regression verifiers.

## 15. Change Request Loop Plan

This section tracks the next user-requested change batch after the first deployed version.

### 15.1 Change Request Baseline

- Change Request ID: `CRQ-2026-07-14-01`
- Baseline commit: `8a59b2b`
- Baseline URL: `https://hwoni.github.io/`
- Planning status: `CHANGE_PLANNED`

### 15.2 Loop States

- `CHANGE_INTAKE`: Request captured, baseline confirmed, and user text preserved.
- `CHANGE_PLANNED`: Request items decomposed and ordered.
- `READY`: A specific change item is ready for implementation.
- `ACTING`: The minimum related files are being edited.
- `VERIFYING`: The targeted verifier set is running.
- `RETRYING`: A single failure reason is being fixed.
- `PASSED`: The loop target passed and regressions are checked.
- `BLOCKED`: GitHub permission, environment, or external asset issue blocks progress.
- `HITL_REQUIRED`: Asset source, ambiguity, or approval is needed.
- `DEPLOY_APPROVAL_REQUIRED`: Local change set is ready for redeploy approval.
- `DEPLOYED`: Updated site is live.

### 15.3 Loop Table

| Loop ID | Linked Change Item | Target | Act | Observe | Reason | Verifier | Completion Criteria | Retry Policy | Stop | HITL | Expected Files | Predecessor | Next |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CRQ-L1 | CR-002 | Require Start button before gameplay begins | Gate game start behind the Start button | Start flow, state transitions | `GAME_STATE` / `GAME_CONTROL` | Game interaction verifier | Game does not begin until Start is pressed | One cause, max 3 retries | `PASSED` or `BLOCKED` | If start semantics conflict | `script.js`, `index.html` | Baseline | CRQ-L2 |
| CRQ-L2 | CR-001 | Slow snake movement to 0.5x | Reduce tick speed | Movement pace, timer interval | `GAME_LOGIC` | Runtime simulation and manual play | Snake speed is half of current pace | Same as above | `PASSED` or `RETRYING` | If pacing feels ambiguous | `script.js` | CRQ-L1 | CRQ-L3 |
| CRQ-L3 | CR-007 | Move Start/Pause/Stop above direction pad | Reposition control cluster | Layout, mobile touch reach | `UI_UX` / `GAME_CONTROL` | Responsive viewport checks | Buttons appear directly above the D-pad | Same as above | `PASSED` or `RETRYING` | If placement collides with layout | `index.html`, `styles.css` | CRQ-L1 | CRQ-L4 |
| CRQ-L4 | CR-006 | Make board cells smaller / denser | Tighten board resolution | Canvas board density | `GAME_RENDERING` | Viewport and render check | Board squares are visibly smaller / denser | Same as above | `PASSED` or `HITL_REQUIRED` | If interpretation is unclear | `script.js`, `styles.css` | CRQ-L1 | CRQ-L5 |
| CRQ-L5 | CR-005 | Show laugh/taunt mark on game over | Add game-over expression | Game-over overlay | `GAME_STATE` / `GAME_EFFECT` | Runtime + visual check | Game over clearly shows the requested expression | Same as above | `PASSED` or `HITL_REQUIRED` | If expression choice needs approval | `script.js`, `index.html`, `styles.css` | CRQ-L1 | CRQ-L6 |
| CRQ-L6 | CR-003 | Replace item visual with apple icon | Update item art | Food rendering | `GAME_ENTITY` | Runtime + visual check | Item appears as an apple icon | Same as above | `PASSED` or `HITL_REQUIRED` | If asset/license is unclear | `script.js`, `styles.css`, `index.html` | CRQ-L1 | CRQ-L7 |
| CRQ-L7 | CR-004 | Replace snake face with Croong-like face | Update snake head art | Head rendering | `GAME_ENTITY` / `CONTENT` | Runtime + visual check | Snake head face matches the requested vibe | Same as above | `PASSED` or `HITL_REQUIRED` | Exact likeness/licensing must be confirmed | `script.js`, `styles.css`, `index.html` | CRQ-L1 | CRQ-L8 |
| CRQ-L8 | CR-008 | Rewrite Selected work into one-line entries | Condense work card copy | Card text wrapping | `CONTENT` / `UI_UX` | HTML text and viewport checks | Each card is concise and line-stable | Same as above | `PASSED` | If wording needs confirmation | `index.html`, `styles.css` | CRQ-L1 | Regression |

### 15.4 Change Request Stop Conditions

- Stop when all Change Items pass and regression tests pass.
- Stop when a single item hits the retry limit.
- Stop when an item needs asset source confirmation.
- Stop when the user changes the requested scope.
