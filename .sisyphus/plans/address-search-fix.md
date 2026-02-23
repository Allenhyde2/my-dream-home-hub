# Fix Address Search Bugs in Onboarding

## TL;DR

> **Quick Summary**: Fix address search bugs in Onboarding Step 2 residence input - search returns no results for space-separated queries, wrong result ordering, keyboard navigation crashes, and selection not working properly.
>
> **Deliverables**:
> - Fixed `searchAddress()` function with query tokenization
> - Sorted results (full matches before partial)
> - Guarded keyboard navigation with bounds checking
> - Debounced search input (300ms)
> - Comprehensive test coverage (TDD approach)
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Test infrastructure setup → Refactor searchAddress → Fix keyboard/nav bugs → Test complete flow

---

## Context

### Original Request
User reported address search bugs in onboarding residence input screen (회원가입 입력 정보 거주지 입력 화면) where 읍/면/동 검색으로 주소 완성시킬 수 있게 업데이트 해줘.

### Reported Issues
1. **Search returns no results** - User types "서울 강남구" but no dropdown appears
2. **Wrong search results** - Relevant addresses not appearing first
3. **Selection not working** - Clicking result doesn't update form
4. **UI not displaying** - Dropdown doesn't show or selection doesn't appear

### Interview Summary
**Key Discussions**:
- Address search feature ALREADY EXISTS in Onboarding.tsx Step 2 (lines 341-471)
- Uses client-side search with koreanDistricts.ts data (2,065 lines)
- No test infrastructure exists
- User confirmed all 4 bug types are occurring
- TDD approach requested for fixing with tests

**Research Findings**:
- Metis analysis identified root causes for all 4 bug types
- Search logic has fundamental flaw: requires full query string match, so space-separated queries fail
- No sorting by match type (full before partial)
- Keyboard navigation lacks array bounds checking
- No debouncing on search input
- Complex state updates may cause race conditions

### Metis Review
**Identified Gaps** (addressed):
- **Gap 1**: Search tokenization - Fixed by splitting queries on spaces
- **Gap 2**: Result sorting - Fixed by explicit matchType ordering
- **Gap 3**: Keyboard safety - Fixed by array bounds guards
- **Gap 4**: Performance - Fixed by adding 300ms debounce
- **Gap 5**: Test coverage - Fixed by TDD approach with test infrastructure setup

---

## Work Objectives

### Core Objective
Fix all address search bugs in Onboarding Step 2 residence input to enable proper 읍/면/동 address lookup.

### Concrete Deliverables
- `frontend/src/data/koreanDistricts.ts`: Updated `searchAddress()` function
- `frontend/src/pages/Onboarding.tsx`: Fixed keyboard navigation and selection handlers
- Test infrastructure setup: bun test configuration
- Test files: Address search unit tests and Playwright E2E tests

### Definition of Done
- [ ] Space-separated queries (e.g., "서울 강남구") return matching results
- [ ] Full matches appear before partial matches in dropdown
- [ ] Keyboard navigation works without errors (Arrow keys, Enter, Escape)
- [ ] Clicking search result properly updates residenceCity/residenceDistrict/residenceDong
- [ ] All tests pass (unit + E2E)
- [ ] Dev server runs without console errors

### Must Have
- Fix search tokenization logic in koreanDistricts.ts
- Sort results by match type (full before partial)
- Add array bounds checking to keyboard navigation
- Add 300ms debounce to search input
- Comprehensive test coverage for all fixed bugs
- Maintain existing API interface (`searchAddress` function signature)

### Must NOT Have (Guardrails)
- NO changes to data structure (KOREAN_DISTRICTS constant)
- NO external API integration (keep client-side search)
- NO new features beyond bug fixes (no fuzzy search, no address favorites)
- NO changes to Step 3 target areas (focus on Step 2 only)
- NO modifications to database schema or backend API

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.
> This is NOT conditional — it applies to EVERY task, regardless of test strategy.
>
> **FORBIDDEN** — acceptance criteria that require:
> - "User manually tests..." / "사용자가 직접 테스트..."
> - "User visually confirms..." / "사용자가 눈으로 확인..."
> - "User interacts with..." / "사용자가 직접 조작..."
> - "Ask user to verify..." / "사용자에게 확인 요청..."
> - ANY step where a human must perform an action
>
> **ALL verification is executed by the agent** using tools (Playwright, interactive_bash, curl, etc.). No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: TDD (RED-GREEN-REFACTOR)
- **Framework**: bun test

### If TDD Enabled

Each TODO follows RED-GREEN-REFACTOR:

**Task Structure:**
1. **RED**: Write failing test first
   - Test file: `frontend/src/__tests__/address-search.test.ts`
   - Test command: `bun test address-search.test.ts`
   - Expected: FAIL (test exists, implementation doesn't match requirements)
2. **GREEN**: Implement minimum code to pass
   - Command: `bun test address-search.test.ts`
   - Expected: PASS
3. **REFACTOR**: Clean up while keeping green
   - Command: `bun test address-search.test.ts`
   - Expected: PASS (still)

**Test Setup Task** (if infrastructure doesn't exist):
- [ ] 0. Setup Test Infrastructure
  - Install: `bun add -d bun @types/bun`
  - Config: Add test script to package.json
  - Verify: `bun --version` → shows version
  - Example: Create `frontend/src/__tests__/example.test.ts`
  - Verify: `bun test example.test.ts` → 1 test passes

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

> Whether TDD is enabled or not, EVERY task MUST include Agent-Executed QA Scenarios.
> - **With TDD**: QA scenarios complement unit tests at integration/E2E level
> - **Without TDD**: QA scenarios are the PRIMARY verification method
>
> These describe how the executing agent DIRECTLY verifies the deliverable
> by running it — opening browsers, executing commands, sending API requests.
> The agent performs what a human tester would do, but automated via tools.

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| **Frontend/UI** | Playwright (playwright skill) | Navigate, interact, assert DOM, screenshot |
| **CLI/TUI** | interactive_bash (tmux) | Run command, send keystrokes, validate output |
| **API/Backend** | Bash (curl/httpie) | Send requests, parse responses, assert fields |
| **Library/Module** | Bash (bun/node REPL) | Import, call functions, compare output |
| **Config/Infra** | Bash (shell commands) | Apply config, run state checks, validate |

**Each Scenario MUST Follow This Format:**

```
Scenario: [Descriptive name — what user action/flow is being verified]
  Tool: [Playwright / interactive_bash / Bash]
  Preconditions: [What must be true before this scenario runs]
  Steps:
    1. [Exact action with specific selector/command/endpoint]
    2. [Next action with expected intermediate state]
    3. [Assertion with exact expected value]
  Expected Result: [Concrete, observable outcome]
  Failure Indicators: [What would indicate failure]
  Evidence: [Screenshot path / output capture / response body path]
```

**Scenario Detail Requirements:**
- **Selectors**: Specific CSS selectors (`.residence-search`, not "the search input")
- **Data**: Concrete test data (`"서울 강남구"`, not `"[query]"`)
- **Assertions**: Exact values (`text contains "역삼동"`, not "verify it works")
- **Timing**: Include wait conditions where relevant (`Wait for .popover-content (timeout: 10s)`)
- **Negative Scenarios**: At least ONE failure/error scenario per feature
- **Evidence Paths**: Specific file paths (`.sisyphus/evidence/task-N-{scenario-slug}.png`)

**Anti-patterns (NEVER write scenarios like this):**
- ❌ "Verify the search works correctly"
- ❌ "Check that the API returns the right data"
- ❌ "Test the address selection"
- ❌ "User opens browser and confirms..."

**Write scenarios like this instead:**
- ✅ `Type "서울 강남구" → Wait for .popover-content → Assert result count > 0 → Assert "강남구" appears in results`
- ✅ `Click first result → Assert input value equals "서울 강남구 역삼동" → Assert residenceCity/district/dong states updated`
- ✅ `Press ArrowDown 3 times → Press Enter → Assert highlight index = 2 → Assert state updated correctly`
- ✅ `Type "invalidxyz" → Assert dropdown closes or shows "no results" → Assert no error in console`

**Evidence Requirements:**
- Screenshots: `.sisyphus/evidence/` for all UI verifications
- Terminal output: Captured for CLI/TUI verifications
- Response bodies: Saved for API verifications
- All evidence referenced by specific file path in acceptance criteria

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.

```
Wave 1 (Start Immediately):
├── Task 1: Setup test infrastructure (bun test)
└── Task 2: Write RED tests for searchAddress function

Wave 2 (After Wave 1):
├── Task 3: Refactor searchAddress to pass tests
├── Task 4: Write RED tests for keyboard navigation
└── Task 5: Fix keyboard navigation bugs

Wave 3 (After Wave 2):
├── Task 6: Write RED tests for UI rendering
└── Task 7: Fix UI display and selection bugs

Critical Path: Task 1 → Task 2 → Task 3 → Task 5 → Task 7
Parallel Speedup: ~35% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2 | None (infrastructure) |
| 2 | 1 | 3 | None (must be RED first) |
| 3 | 1, 2 | 4, 5 | None (must pass tests) |
| 4 | 1 | 5 | Task 2 (both test writing) |
| 5 | 1, 3 | 4, 7 | Task 6 (UI tests) |
| 6 | 1 | 7 | Task 4 (keyboard tests) |
| 7 | 1, 3, 5, 6 | None (final) | None (final integration) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | task(category="quick", load_skills=[], run_in_background=false) |
| 2 | 3, 4, 5 | dispatch parallel after Wave 1 completes |
| 3 | 6, 7 | dispatch parallel after Wave 2 completes |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info.

- [ ] 1. Setup Test Infrastructure

  **What to do**:
  - Install bun and @types/bun as dev dependencies
  - Add test script to package.json in frontend directory
  - Create example test file to verify setup
  - Configure TypeScript for test files if needed

  **Must NOT do**:
  - Install other test frameworks (vitest, jest) - using bun test only
  - Setup CI/CD integration (not requested)

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Simple setup task with minimal complexity
  - **Skills**: `[]`
    - No specialized skills needed for package installation

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 2 (test writing)
  - **Blocked By**: None

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Package References**:
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/package.json` - Current dependencies and scripts to modify

  **External References** (libraries and frameworks):
  - Official docs: `https://bun.sh/docs/testing` - bun test configuration and usage

  **WHY Each Reference Matters** (explain the relevance):
  - Package.json: Need to add devDependencies and test script
  - Bun docs: Reference for correct test setup syntax

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] bun test installed in devDependencies
  - [ ] package.json test script added: "bun test"
  - [ ] `bun test` command runs successfully without errors
  - [ ] Example test file passes (frontend/src/__tests__/example.test.ts)

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  \`\`\`
  Scenario: Verify bun test infrastructure is working
    Tool: Bash (bash)
    Preconditions: Dev dependencies installed, package.json updated
    Steps:
      1. cd /Users/allen-pierce/Downloads/my-dream-home-hub\ 3/frontend
      2. bun --version
      3. Assert output contains "1.x.x" (version exists)
      4. Create src/__tests__/example.test.ts with: `test("example", () => { expect(true).toBe(true); })`
      5. bun test
      6. Assert output contains "1 pass"
    Expected Result: Bun test infrastructure working, example test passes
    Failure Indicators: "bun: command not found", "Cannot find module", "0 tests"
    Evidence: Terminal output captured
  \`\`\`

  **Evidence to Capture:**
  - [ ] Terminal output showing bun version
  - [ ] Terminal output showing test run success
  - [ ] Example test file content

  **Commit**: YES
  - Message: `chore(frontend): setup bun test infrastructure`
  - Files: `frontend/package.json`
  - Pre-commit: `bun test`

- [ ] 2. Write RED Tests for searchAddress Function

  **What to do**:
  - Create test file: frontend/src/__tests__/koreanDistricts.test.ts
  - Write tests that document current broken behavior (RED)
  - Test cases:
    * Space-separated query returns no results (e.g., "서울 강남구")
    * Full matches not sorted before partial matches
    * Empty query returns empty array
    * Max 50 results returned

  **Must NOT do**:
  - Implement any fixes yet (tests must fail first in TDD)
  - Modify KOREAN_DISTRICTS data structure

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Test writing task, minimal complexity, following TDD pattern
  - **Skills**: `[]`
    - No specialized skills needed for test file creation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3 (implementation)
  - **Blocked By**: Task 1 (test setup)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Implementation References** (existing code to understand current behavior):
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/data/koreanDistricts.ts:2011-2065` - Current searchAddress() function logic with bugs

  **Test References** (testing patterns to follow):
  - Bun test docs: `https://bun.sh/docs/testing` - Test syntax and assertions

  **External References** (libraries and frameworks):
  - None needed for test writing

  **WHY Each Reference Matters** (explain the relevance):
  - koreanDistricts.ts lines 2011-2065: Understanding current search logic bug where `includes(lowerQuery)` fails for space-separated queries
  - Bun test docs: Reference for correct test/assertion syntax

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] Test file created: frontend/src/__tests__/koreanDistricts.test.ts
  - [ ] Test covers: space-separated query ("서울 강남구") - expects empty array
  - [ ] Test covers: result ordering - expects unsorted results
  - [ ] Test covers: max results limit - expects max 50
  - [ ] bun test frontend/src/__tests__/koreanDistricts.test.ts → FAIL (current implementation fails)

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  \`\`\`
  Scenario: Verify current broken behavior for space-separated queries
    Tool: Bash (bun test)
    Preconditions: Test file created, koreanDistricts.ts unchanged
    Steps:
      1. cd /Users/allen-pierce/Downloads/my-dream-home-hub\ 3/frontend
      2. bun test src/__tests__/koreanDistricts.test.ts
      3. Assert output contains "fail" or "FAILED" (space-separated query test should fail)
      4. Assert test name contains "space-separated" or "tokenized"
    Expected Result: Tests fail, documenting current broken behavior
    Failure Indicators: All tests pass (unexpected), "Cannot find module"
    Evidence: Test output captured
  \`\`\`

  **Evidence to Capture:**
  - [ ] Test run output showing failures
  - [ ] Test file content (koreanDistricts.test.ts)

  **Commit**: NO (group with Task 3)

- [ ] 3. Refactor searchAddress to Fix Search Logic

  **What to do**:
  - Modify searchAddress() function in koreanDistricts.ts (lines 2011-2065)
  - Add query tokenization: split on whitespace to support multi-term searches
  - Add result sorting: full matches before partial matches
  - Maintain existing function signature and return type
  - Ensure max 50 results still enforced

  **Must NOT do**:
  - Change data structure of KOREAN_DISTRICTS
  - Add new search features (fuzzy match, etc.)
  - Modify other search functions (searchDong, etc.)

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Algorithm refactoring task, localized changes, TDD approach (test already written)
  - **Skills**: `[]`
    - No specialized skills needed for function refactoring

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 4, 5
  - **Blocked By**: Task 2 (tests must pass)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to fix):
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/data/koreanDistricts.ts:2011-2065` - Full searchAddress function with tokenization and sorting logic to add
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/data/koreanDistricts.ts:2030-2036` - Current logic requiring full query match (causes bug)
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/data/koreanDistricts.ts:2013-2018` - Expected result structure to maintain

  **Test References** (tests to pass):
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/__tests__/koreanDistricts.test.ts` - Tests written in Task 2 that must now pass

  **External References** (libraries and frameworks):
  - Bun test docs: `https://bun.sh/docs/testing` - Assertion and test patterns

  **WHY Each Reference Matters** (explain the relevance):
  - searchAddress lines 2011-2065: Full function to refactor, understanding the `includes()` bug that fails for "서울 강남구"
  - Lines 2030-2036: Current matching logic where each component requires the full query string - this is the root cause
  - Lines 2013-2018: Result format that must be maintained with added matchType sorting

  **Implementation Details** (from Metis analysis):
  ```typescript
  // Add tokenization at line 2030
  const tokens = lowerQuery.trim().split(/\s+/).filter(Boolean);

  // Update matching logic (lines 2030-2058)
  // For each result, check if ANY token matches city, district, OR dong
  // Full match: all tokens match city AND (district OR dong)
  // Partial match: any token matches city AND (district OR dong)

  // Add sorting (lines 2062-2063)
  results.sort((a, b) => {
    if (a.matchType === 'full' && b.matchType !== 'full') return -1;
    if (a.matchType !== 'full' && b.matchType === 'full') return 1;
    return 0;
  });
  ```

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] bun test frontend/src/__tests__/koreanDistricts.test.ts → PASS (all tests green)
  - [ ] Search with "서울 강남구" returns results (not empty)
  - [ ] Full matches appear before partial matches in results
  - [ ] Max 50 results returned
  - [ ] searchAddress function signature unchanged

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  \`\`\`
  Scenario: Space-separated query returns matching results
    Tool: Bash (bun test)
    Preconditions: searchAddress function refactored
    Steps:
      1. cd /Users/allen-pierce/Downloads/my-dream-home-hub\ 3/frontend
      2. bun test src/__tests__/koreanDistricts.test.ts --grep "space-separated"
      3. Assert test output contains "pass" (not "fail")
      4. Run manual test: node -e "console.log(require('./src/data/koreanDistricts.ts').searchAddress('서울 강남구').slice(0,3))"
    Expected Result: Space-separated query returns results, tests pass
    Failure Indicators: Tests still fail, manual test returns empty array
    Evidence: Test output captured, manual test output captured

  Scenario: Full matches appear first in results
    Tool: Bash (bun test)
    Preconditions: searchAddress function refactored
    Steps:
      1. bun test src/__tests__/koreanDistricts.test.ts --grep "sort" or "order"
      2. Assert test contains "pass"
    Expected Result: Full match sorting test passes
    Failure Indicators: Test fails, results appear unsorted
    Evidence: Test output captured
  \`\`\`

  **Evidence to Capture:**
  - [ ] Test run output showing all tests passing
  - [ ] Manual test results for specific queries

  **Commit**: YES
  - Message: `fix(frontend): tokenize query and sort search results by match type`
  - Files: `frontend/src/data/koreanDistricts.ts`
  - Pre-commit: `bun test src/__tests__/koreanDistricts.test.ts`

- [ ] 4. Write RED Tests for Keyboard Navigation

  **What to do**:
  - Create test file: frontend/src/__tests__/keyboard-navigation.test.ts
  - Write tests that document current keyboard bugs (RED)
  - Test cases:
    * ArrowDown on empty results doesn't crash (index out of bounds)
    * ArrowDown/Up correctly updates highlight index
    * Enter key selects highlighted result
    * Escape key closes search popover
    * searchHighlight resets to -1 on close

  **Must NOT do**:
  - Implement fixes yet (tests must fail first in TDD)

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Test writing task, keyboard event handling is React behavior
  - **Skills**: `[]`
    - No specialized skills needed for test file creation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: Task 5 (implementation)
  - **Blocked By**: Task 1 (test setup)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Implementation References** (existing code to understand):
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:136-172` - Keyboard navigation handlers (handleSearchKeyDown)
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:98-109` - State variables (searchHighlight)
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:140-159` - searchHighlight set logic (lines 140, 159)

  **Test References** (testing patterns to follow):
  - Bun test docs: `https://bun.sh/docs/testing` - Test syntax and assertions

  **External References** (libraries and frameworks):
  - React keyboard event types: `https://react.dev/reference/react-dom/components/common#keyboard-event` - Key codes and properties

  **WHY Each Reference Matters** (explain the relevance):
  - Onboarding.tsx lines 136-172: Current keyboard handlers that set searchHighlight without bounds checking - this causes crash on empty results
  - Lines 98-109: State variables to test - searchHighlight should be within [0, results.length - 1] or -1
  - Lines 140, 159: searchHighlight set to 0 when results empty - this is the bug causing index out of bounds

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] Test file created: frontend/src/__tests__/keyboard-navigation.test.ts
  - [ ] Test covers: ArrowDown on empty results - expects no crash
  - [ ] Test covers: ArrowDown updates highlight correctly
  - [ ] Test covers: Enter selects highlighted result
  - [ ] bun test frontend/src/__tests__/keyboard-navigation.test.ts → FAIL (current implementation crashes)

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  \`\`\`
  Scenario: Verify current keyboard navigation crashes on empty results
    Tool: Bash (bun test)
    Preconditions: Test file created, Onboarding.tsx unchanged
    Steps:
      1. cd /Users/allen-pierce/Downloads/my-dream-home-hub\ 3/frontend
      2. bun test src/__tests__/keyboard-navigation.test.ts
      3. Assert output contains "fail" or "error" or "out of bounds"
      4. Assert test name references "empty" or "bounds"
    Expected Result: Tests fail, documenting crash bug
    Failure Indicators: All tests pass (unexpected), test file not found
    Evidence: Test output captured
  \`\`\`

  **Evidence to Capture:**
  - [ ] Test run output showing failures
  - [ ] Test file content (keyboard-navigation.test.ts)

  **Commit**: NO (group with Task 5)

- [ ] 5. Fix Keyboard Navigation Bugs

  **What to do**:
  - Fix handleSearchKeyDown function in Onboarding.tsx (lines 136-172)
  - Add array bounds checking before setting searchHighlight
  - Guard ArrowDown/Up operations with results.length > 0 check
  - Reset searchHighlight to -1 on popover close
  - Ensure Escape key works correctly

  **Must NOT do**:
  - Change keyboard event handling pattern (Arrow keys, Enter, Escape)
  - Modify other keyboard handlers in the file

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: React keyboard event handling fix, TDD approach (test already written)
  - **Skills**: `[]`
    - No specialized skills needed for React event handler fixes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3, 4)
  - **Blocks**: Task 7 (UI integration)
  - **Blocked By**: Task 4 (tests must pass)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to fix):
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:136-172` - handleSearchKeyDown function with bounds checking to add
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:142-150` - ArrowDown case that needs results.length > 0 guard
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:152-159` - ArrowUp case that needs results.length > 0 guard
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:98-109` - searchHighlight state variable

  **Test References** (tests to pass):
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/__tests__/keyboard-navigation.test.ts` - Tests written in Task 4 that must now pass

  **WHY Each Reference Matters** (explain the relevance):
  - Lines 136-172: Full keyboard handler to add array bounds checking at lines 142, 149, 152, 159
  - Lines 142-150: ArrowDown case needs `if (searchResultsMemo.length > 0)` guard before setting searchHighlight = 0
  - Lines 152-159: ArrowUp case needs similar guard and bounds checking

  **Implementation Details** (from Metis analysis):
  ```typescript
  // Line 140: Add guard
  if (searchResultsMemo.length === 0) return;

  // Line 142: Add guard in ArrowDown case
  case 'ArrowDown':
    if (searchResultsMemo.length === 0) return;
    setSearchHighlight(prev => Math.min(prev + 1, searchResultsMemo.length - 1));

  // Line 152: Add guard in ArrowUp case
  case 'ArrowUp':
    if (searchResultsMemo.length === 0) return;
    setSearchHighlight(prev => Math.max(prev - 1, 0));

  // Line 162: Reset to -1 when closing
  case 'Escape':
    setSearchHighlight(-1);
    setSearchOpen(false);
  ```

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] bun test frontend/src/__tests__/keyboard-navigation.test.ts → PASS (all tests green)
  - [ ] ArrowDown/Up on empty results doesn't crash
  - [ ] searchHighlight stays within bounds [0, results.length - 1] or -1
  - [ ] Escape key resets to -1

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  \`\`\`
  Scenario: Keyboard navigation works on empty results
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3001, onboarding page loaded
    Steps:
      1. Navigate to: http://localhost:3001/onboarding
      2. Complete Step 1 (nickname) to reach Step 2
      3. Wait for: .residence-search input visible (timeout: 5s)
      4. Focus: input[data-testid="input-residence-search"]
      5. Type: "xyz" (no matches expected)
      6. Wait for: dropdown visible (timeout: 5s)
      7. Send key: ArrowDown
      8. Assert: No error in console (Playwright captures errors)
      9. Send key: Escape
      10. Assert: popover-content not visible
    Expected Result: No crashes, keyboard events handled gracefully
    Failure Indicators: Console error "Cannot read property", TypeError, dropdown stays open
    Evidence: .sisyphus/evidence/task-5-empty-results-nav.png, console log captured

  Scenario: Keyboard navigation works with results
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, Step 2 loaded, results exist
    Steps:
      1. Type in residence search: "서울 강남"
      2. Wait for: at least 3 results in dropdown (timeout: 5s)
      3. Send key: ArrowDown (3 times)
      4. Assert: 3rd result is highlighted (has background color change)
      5. Send key: Enter
      6. Wait for: selection made (timeout: 3s)
      7. Assert: selected-residence div visible with "서울특별시 강남구" text
    Expected Result: Keyboard navigation highlights and selects correctly
    Failure Indicators: Highlight index out of sync, Enter doesn't select, selection doesn't appear
    Evidence: .sisyphus/evidence/task-5-keyboard-selection.png
  \`\`\`

  **Evidence to Capture:**
  - [ ] Screenshots for empty results navigation (no crash)
  - [ ] Screenshots for keyboard selection (highlight and select)
  - [ ] Console log capture (no errors)

  **Commit**: YES
  - Message: `fix(frontend): add array bounds checking to keyboard navigation`
  - Files: `frontend/src/pages/Onboarding.tsx`
  - Pre-commit: `bun test src/__tests__/keyboard-navigation.test.ts`

- [ ] 6. Write RED Tests for UI Rendering and Selection

  **What to do**:
  - Create test file: frontend/src/__tests__/residence-ui.test.tsx
  - Write tests that document current UI/selection bugs (RED)
  - Test cases:
    * Dropdown appears when typing (searchOpen state)
    * Selected address displays correctly
    * Remove button clears selection
    * Search results display with correct data

  **Must NOT do**:
  - Implement fixes yet (tests must fail first in TDD)
  - Change UI structure (Popover, Input components)

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: UI rendering tests require Playwright for DOM verification
  - **Skills**: `["playwright"]`
    - `playwright`: Browser automation for UI testing - verifying DOM elements, visibility, state changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 7)
  - **Blocks**: Task 7 (implementation)
  - **Blocked By**: Task 1 (test setup)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Implementation References** (existing code to understand):
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:341-471` - Residence input UI to test
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:362-383` - Popover component rendering
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:174-187` - handleSelectResidence function to test
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:431-468` - Selected residence display card

  **Test References** (testing patterns to follow):
  - Playwright docs: `https://playwright.dev/docs/locators` - Element selection and assertions
  - Bun test docs: `https://bun.sh/docs/testing` - Test file structure

  **WHY Each Reference Matters** (explain the relevance):
  - Lines 341-471: Complete residence UI component - dropdown, input, selected display - to test rendering
  - Lines 174-187: handleSelectResidence function that updates residenceCity/residenceDistrict/residenceDong states - to verify selection logic
  - Lines 431-468: Selected address display showing user's choice - to verify selection persistence

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] Test file created: frontend/src/__tests__/residence-ui.test.tsx
  - [ ] Test covers: searchOpen state on typing
  - [ ] Test covers: selection updates all state variables
  - [ ] Test covers: remove button clears selection

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  \`\`\`
  Scenario: Verify current selection not working bug
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, Step 2 loaded, results exist
    Steps:
      1. Navigate to: http://localhost:3001/onboarding
      2. Complete Step 1 to reach Step 2
      3. Type: "서울 강남"
      4. Wait for: first result in dropdown (timeout: 5s)
      5. Click: first result button (not highlighted one)
      6. Wait for: 1s after click
      7. Assert: input[data-testid="input-residence-search"] value equals selected address
      8. Assert: selected-residence div contains "서울특별시"
    Expected Result: Selection should fail or update incorrectly (documenting bug)
    Failure Indicators: Selection works correctly on first try (unexpected)
    Evidence: .sisyphus/evidence/task-6-selection-bug.png

  Scenario: Verify current UI not displaying bug
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, Step 2 loaded
    Steps:
      1. Navigate to Step 2
      2. Type: "서울" (2+ chars)
      3. Wait for: dropdown popover-content (timeout: 5s)
      4. Assert: popover-content is visible
      5. Count: result items in dropdown
    Expected Result: Dropdown may not appear or show "no results" incorrectly
    Failure Indicators: Dropdown appears correctly with expected results (not a bug)
    Evidence: .sisyphus/evidence/task-6-ui-display-bug.png
  \`\`\`

  **Evidence to Capture:**
  - [ ] Screenshots for selection bug (state not updating)
  - [ ] Screenshots for UI display bug (dropdown visibility)

  **Commit**: NO (group with Task 7)

- [ ] 7. Fix UI Display and Selection Bugs

  **What to do**:
  - Fix searchOpen state management in Onboarding.tsx (lines 362-383)
  - Fix handleSelectResidence function to update all state variables correctly
  - Ensure debounce is applied to search input (300ms)
  - Add empty query handling (trim, treat as empty)
  - Verify selected address display shows correctly

  **Must NOT do**:
  - Change Popover component API
  - Modify other onboarding steps

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: UI state management and rendering fixes, requires Playwright for verification
  - **Skills**: `["playwright"]`
    - `playwright`: Browser automation for UI testing - verifying state updates, DOM visibility, interaction feedback

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: None (final task)
  - **Blocked By**: Task 6 (tests must pass)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to fix):
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:98-109` - State variables (residenceSearch, searchOpen)
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:362-383` - Popover open state logic
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/pages/Onboarding.tsx:174-187` - handleSelectResidence function with 4 state calls (bug source)

  **Test References** (tests to pass):
  - `/Users/allen-pierce/Downloads/my-dream-home-hub 3/frontend/src/__tests__/residence-ui.test.tsx` - Tests written in Task 6 that must now pass

  **WHY Each Reference Matters** (explain the relevance):
  - Lines 98-109: State variables that need proper updates - searchOpen should toggle correctly when typing
  - Lines 174-187: handleSelectResidence with 4 state calls - may cause race conditions, needs batching or proper sequencing

  **Implementation Details** (from Metis analysis):
  ```typescript
  // Fix searchOpen state (lines 362-383)
  // Ensure searchOpen is true when residenceSearch.length > 0

  // Add debounce (line 369)
  const debouncedSetResidenceSearch = useDebounce(setResidenceSearch, 300);

  // Fix handleSelectResidence state batching (lines 174-187)
  setData(prev => ({
    ...prev,
    residenceCity: city,
    residenceDistrict: district,
    residenceDong: dong,
  })); // Single update instead of multiple calls
  ```

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] bun test frontend/src/__tests__/residence-ui.test.tsx → PASS (all tests green)
  - [ ] searchOpen state true when typing (length > 0)
  - [ ] Selection updates all 3 state variables (city, district, dong)
  - [ ] Debounce applied (300ms)
  - [ ] Selected address displays correctly

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  \`\`\`
  Scenario: Complete address search and selection flow
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3001
    Steps:
      1. Navigate to: http://localhost:3001/onboarding
      2. Complete Step 1 (nickname) to reach Step 2
      3. Type: "서울 강남" (space-separated query)
      4. Wait for: at least 3 results in dropdown (timeout: 5s)
      5. Assert: First result shows "full" badge (정확히 일치)
      6. Click: first result button
      7. Wait for: selected-residence div appears (timeout: 3s)
      8. Assert: selected-residence contains "서울특별시 강남구"
      9. Assert: input value is "서울특별시 강남구 역삼동"
      10. Click: remove button (× icon)
      11. Assert: selected-residence div is hidden
      12. Assert: residenceSearch input is empty
    Expected Result: Full search and selection flow works correctly
    Failure Indicators: Query returns no results, wrong selection, remove doesn't work
    Evidence: .sisyphus/evidence/task-7-complete-flow.png

  Scenario: Empty and whitespace-only query handling
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, Step 2 loaded
    Steps:
      1. Type: "   " (3 spaces only)
      2. Wait for: 500ms
      3. Assert: popover-content is NOT visible (treated as empty)
      4. Type: "xyz" (3 chars, no match)
      5. Wait for: popover-content visible (timeout: 5s)
      6. Assert: result count is displayed (at least 1 result)
    Expected Result: Whitespace suppressed, valid queries show dropdown
    Failure Indicators: Whitespace shows "no results", valid query shows no dropdown
    Evidence: .sisyphus/evidence/task-7-empty-query.png

  Scenario: Performance test - rapid typing doesn't cause excessive searches
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, Step 2 loaded, console visible
    Steps:
      1. Type: "서" (1 char)
      2. Wait: 100ms
      3. Type: "서울" (add "울")
      4. Wait: 100ms
      5. Type: "서울 " (add space)
      6. Wait: 100ms
      7. Type: "서울 강" (add "강")
      8. Wait: 100ms
      9. Type: "서울 강남" (add "남")
      10. Count console logs for searchAddress calls
    Expected Result: searchAddress called ≤5 times due to 300ms debounce
    Failure Indicators: searchAddress called 10+ times (no debouncing), excessive console spam
    Evidence: Console log captured, screenshot of console
  \`\`\`

  **Evidence to Capture:**
  - [ ] Screenshots for complete flow (typing, selection, remove)
  - [ ] Screenshots for empty query handling
  - [ ] Console log for debounce verification
  - [ ] Screenshot of full match badges

  **Commit**: YES
  - Message: `fix(frontend): fix searchOpen state, debounce, and selection logic`
  - Files: `frontend/src/pages/Onboarding.tsx`
  - Pre-commit: `bun test src/__tests__/residence-ui.test.tsx`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `chore(frontend): setup bun test infrastructure` | frontend/package.json | bun test |
| 2, 4, 6 | (Grouped with implementation tasks) | - | bun test (respective test files) |
| 3 | `fix(frontend): tokenize query and sort search results by match type` | frontend/src/data/koreanDistricts.ts | bun test src/__tests__/koreanDistricts.test.ts |
| 5 | `fix(frontend): add array bounds checking to keyboard navigation` | frontend/src/pages/Onboarding.tsx | bun test src/__tests__/keyboard-navigation.test.ts |
| 7 | `fix(frontend): fix searchOpen state, debounce, and selection logic` | frontend/src/pages/Onboarding.tsx | bun test src/__tests__/residence-ui.test.tsx |

---

## Success Criteria

### Verification Commands
```bash
# Run all tests
cd /Users/allen-pierce/Downloads/my-dream-home-hub\ 3/frontend
bun test

# Start dev server
bun run dev

# Expected outputs:
# - "X pass" (all tests green)
# - Server runs on port 3001
# - No console errors
```

### Final Checklist
- [ ] Space-separated queries return matching results
- [ ] Full matches appear before partial matches
- [ ] Keyboard navigation works without crashes
- [ ] Selection updates all state variables correctly
- [ ] Search dropdown appears when typing
- [ ] Debounce prevents excessive searches (300ms)
- [ ] All unit tests pass
- [ ] All Playwright E2E tests pass
- [ ] No console errors in browser
- [ ] Can complete onboarding with residence selected
