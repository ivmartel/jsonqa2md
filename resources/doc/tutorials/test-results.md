# Tests Results

## Context

Commit: [97c1dcc](https://github.com/ivmartel/jsonqa2md/commit/97c1dcc170c74db0cfe0143fc96867ef622d0618)

Date: Thu Oct 22 2026 17:56:37 GMT+0200 (Central European Summer Time)

Environement: jsdom ^30.1.3

## Summary
Results: 86% (6) ✅ - 14% (1) ❌

Total tests: 7 (skipped: 0, total time: 8ms)

71% (5) tests with requirement(s), 14% (1) test with no requirement, 14% (1) test with bad requirement reference

20% (1 / 5) tested requirements

## Tests details

### math

| Test | Result | Requirement | Code |
| --- | :---: | --- | --- |
| Add int small numbers | ✅ | URS [#JQ2MD-001 (Add two numbers)](/tutorials/user-stories#jq2md-001-add-two-numbers) | [jsdoc](/module/tests-math#add-int-small-numbers) |
| Add int big numbers | ✅ | URS [#JQ2MD-001 (Add two numbers)](/tutorials/user-stories#jq2md-001-add-two-numbers) | [jsdoc](/module/tests-math#add-int-big-numbers) |
| Add int zero | ✅ | URS [#JQ2MD-001 (Add two numbers)](/tutorials/user-stories#jq2md-001-add-two-numbers) | [jsdoc](/module/tests-math#add-int-zero) |
| Add int negative | ✅ | URS [#JQ2MD-001 (Add two numbers)](/tutorials/user-stories#jq2md-001-add-two-numbers) | [jsdoc](/module/tests-math#add-int-negative) |
| Add float numbers | ❌ | URS [#JQ2MD-001 (Add two numbers)](/tutorials/user-stories#jq2md-001-add-two-numbers) | [jsdoc](/module/tests-math#add-float-numbers) |
| Add two numbers0 | ✅ | ⚠️ No requirement reference | [jsdoc](/module/tests-math#add-two-numbers0) |
| Add two numbers1 | ✅ | URS #JQ2MD-002 Add two numbers (⚠️ Unknown) | [jsdoc](/module/tests-math#add-two-numbers1) |

## Traceability

### math

| Requirement | Test | Result |
| --- | --- | :---: |
| URS [#JQ2MD-001 (Add two numbers)](/tutorials/user-stories#jq2md-001-add-two-numbers) | Add int small numbers | ✅ |
|  | Add int big numbers | ✅ |
|  | Add int zero | ✅ |
|  | Add int negative | ✅ |
|  | Add float numbers | ❌ |
| URS [#JQ2MD-002 (Substract two numbers)](/tutorials/user-stories#jq2md-002-substract-two-numbers) | ⚠️ No tests |  |
| URS [#JQ2MD-002 (Multiply two numbers)](/tutorials/user-stories#jq2md-002-multiply-two-numbers) | ⚠️ No tests |  |
| URS [#JQ2MD-003 (Multiply two numbers)](/tutorials/user-stories#jq2md-003-multiply-two-numbers) | ⚠️ No tests |  |
| URS [#JQ2MD-004 (Divide two numbers)](/tutorials/user-stories#jq2md-004-divide-two-numbers) | ⚠️ No tests |  |

