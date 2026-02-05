import {describe, expect, test} from 'vitest';

import {add} from '../src/math';

/**
 * Tests for the 'math.js' file.
 */

/** @module tests/math */
describe('math', () => {

  describe('Add int', () => {

    /**
     * Tests for {@link add}.
     *
     * @function module:tests/math~add-int-small-numbers
     */
    test('small numbers - #JQ2MD-001 Add two numbers', () => {
      // purposely fail
      expect(add(1, 1)).toEqual(2);
    });

    /**
     * Tests for {@link add}.
     *
     * @function module:tests/math~add-int-big-numbers
     */
    test('big numbers - #JQ2MD-001 Add two numbers', () => {
      // purposely fail
      expect(add(1000000000000, 1)).toEqual(1000000000001);
    });

    /**
     * Tests for add.
     *
     * @function module:tests/math~add-zero
     */
    test('zero - #JQ2MD-001 Add two numbers', () => {
      expect(add(0, 0)).toEqual(0);
    });

    /**
     * Tests for add.
     *
     * @function module:tests/math~add-negative
     */
    test('negative - #JQ2MD-001 Add two numbers', () => {
      expect(add(-1, -1)).toEqual(-2);
    });

  });

  /**
   * Tests for add.
   *
   * @function module:tests/math~add-float-numbers
   */
  test('Add float numbers - #JQ2MD-001 Add two numbers', () => {
    expect(add(1.1, 1.1)).toEqual(2.3);
  });

  /**
   * Tests for add 2: no requirement ref
   *
   * @function module:tests/math~add-two-numbers0
   */
  test('Add two numbers0', () => {
    expect(add(1, 1)).toEqual(2);
  });

  /**
   * Tests for add 2: bad requirement ref
   *
   * @function module:tests/math~add-two-numbers1
   */
  test('Add two numbers1 - #JQ2MD-002 Add two numbers', () => {
    expect(add(1, 1)).toEqual(2);
  });

});
