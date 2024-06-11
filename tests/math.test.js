import {add} from '../src/math';

/**
 * Tests for the 'math.js' file.
 */

/** @module tests/math */

// Do not warn if these variables were not defined before.
/* global QUnit */
QUnit.module('math');

/**
 * Tests for add.
 *
 * @function module:tests/math~add-int-numbers
 */
QUnit.test('Add int numbers - #JQ2MD-001 Add two numbers', function (assert) {
  assert.equal(add(1, 1), 2, 'add test #0');
});

/**
 * Tests for add.
 *
 * @function module:tests/math~add-float-numbers
 */
QUnit.test('Add float numbers - #JQ2MD-001 Add two numbers', function (assert) {
  assert.equal(add(1.1, 1.1), 2.3, 'add test #0');
});

/**
 * Tests for add.
 *
 * @function module:tests/math~add-zero
 */
QUnit.test('Add zero - #JQ2MD-001 Add two numbers', function (assert) {
  assert.equal(add(0, 0), 0, 'add test #0');
});

/**
 * Tests for add.
 *
 * @function module:tests/math~add-negative
 */
QUnit.test('Add negative - #JQ2MD-001 Add two numbers', function (assert) {
  assert.equal(add(-1, -1), -2, 'add test #0');
});

/**
 * Tests for add 2: no requirement ref
 *
 * @function module:tests/math~add-two-numbers0
 */
QUnit.test('Add two numbers0', function (assert) {
  assert.equal(add(1, 1), 2, 'add test #0');
});

/**
 * Tests for add 2: bad requirement ref
 *
 * @function module:tests/math~add-two-numbers1
 */
QUnit.test('Add two numbers1 - #JQ2MD-002 Add two numbers', function (assert) {
  assert.equal(add(1, 1), 2, 'add test #0');
});
