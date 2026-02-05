# Tests Results

## Context

Commit: [933caaf](https://github.com/ivmartel/jsonqa2md/commit/933caaf8896d36ffe5b21d2469ec1b94eb5519b3)

Date: Thu Feb 05 2026 13:51:44 GMT+0100 (Central European Standard Time)

Environement: jsdom ^27.4.0

## Summary
Success: 6 ✅

Failed: 1 ❌

(total: 7, skipped: 0, total time: 8ms)

## Tests details

(5 / 7 tests with requirement(s), 1 test with no requirement, 1 test with bad requirement reference)

### math

- Add int small numbers: ✅
(URS [#JQ2MD-001 (Add two numbers)](tutorial-user-stories.html#jq2md-001-add-two-numbers), [jsdoc](module-tests_math.html#~add-int-small-numbers))

- Add int big numbers: ✅
(URS [#JQ2MD-001 (Add two numbers)](tutorial-user-stories.html#jq2md-001-add-two-numbers), [jsdoc](module-tests_math.html#~add-int-big-numbers))

- Add int zero: ✅
(URS [#JQ2MD-001 (Add two numbers)](tutorial-user-stories.html#jq2md-001-add-two-numbers), [jsdoc](module-tests_math.html#~add-int-zero))

- Add int negative: ✅
(URS [#JQ2MD-001 (Add two numbers)](tutorial-user-stories.html#jq2md-001-add-two-numbers), [jsdoc](module-tests_math.html#~add-int-negative))

- Add float numbers: ❌
(URS [#JQ2MD-001 (Add two numbers)](tutorial-user-stories.html#jq2md-001-add-two-numbers), [jsdoc](module-tests_math.html#~add-float-numbers))

- Add two numbers0: ✅
(⚠️ No requirement reference, [jsdoc](module-tests_math.html#~add-two-numbers0))

- Add two numbers1: ✅
(URS #JQ2MD-002 Add two numbers (⚠️ Unknown), [jsdoc](module-tests_math.html#~add-two-numbers1))

## Traceability

(1 / 5 tested requirements)

### math

URS [#JQ2MD-001 (Add two numbers)](tutorial-user-stories.html#jq2md-001-add-two-numbers):
 ✅ Add int small numbers
 ✅ Add int big numbers
 ✅ Add int zero
 ✅ Add int negative
 ❌ Add float numbers

URS [#JQ2MD-002 (Substract two numbers)](tutorial-user-stories.html#jq2md-002-substract-two-numbers):
 ⚠️ No tests

URS [#JQ2MD-002 (Multiply two numbers)](tutorial-user-stories.html#jq2md-002-multiply-two-numbers):
 ⚠️ No tests

URS [#JQ2MD-003 (Multiply two numbers)](tutorial-user-stories.html#jq2md-003-multiply-two-numbers):
 ⚠️ No tests

URS [#JQ2MD-004 (Divide two numbers)](tutorial-user-stories.html#jq2md-004-divide-two-numbers):
 ⚠️ No tests

