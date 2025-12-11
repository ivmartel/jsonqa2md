const fs = require('fs');
const {execSync} = require('child_process');

// inputs
const reqFilename = 'resources/doc/user-stories.json';
const testResultsFilename = 'build/test-results.json';
// used for repo info
const pkgFilename = 'package.json';
// used for links
const reqTutorial = 'tutorial-user-stories.html';

// outputs
const reqMdFilename = 'resources/doc/tutorials/user-stories.md';
const testResultsMdFilename = 'resources/doc/tutorials/test-results.md';

// requirements
const reqJSON = JSON.parse(fs.readFileSync(reqFilename));
const requirements = reqJSON.requirements;

// tests
const testJSON = JSON.parse(fs.readFileSync(testResultsFilename));
// for example 'Add zero - [resolves] #JQ2MD-001 Add two numbers'
// const testDescPattern = /(.*) - \[(\S*)\] #(\S*) (.*)/;
// for example 'Add zero - #JQ2MD-001 Add two numbers'
const testDescPattern = /(.*) - #(\S*) (.*)/;

let testContext;
let testSuites;

// extract info from test results
if (isKarmaJsonTestResults(testJSON)) {
  testContext = parseKarmaJsonTestContext(testJSON);
  testSuites = parseKarmaJsonTestResults(testJSON);
} else if (isVitestJsonTestResults(testJSON)) {
  testContext = parseVitestJsonTestContext(testJSON);
  testSuites = parseVitestJsonTestResults(testJSON);
}

// check
if (typeof testContext === 'undefined') {
  throw new Error('No test context');
}
if (typeof testSuites === 'undefined') {
  throw new Error('No test suites');
}

// code context
const pkgJSON = JSON.parse(fs.readFileSync(pkgFilename));
const repoUrl = pkgJSON.repository.url;

// git info
const gitCommandGetTag = 'git tag --points-at HEAD';
const gitTag = execSync(gitCommandGetTag).toString().trim();
const gitCommandGetHash = 'git rev-parse HEAD';
const gitHash = execSync(gitCommandGetHash).toString().trim();

let codeContext;
if (gitTag.length !== 0) {
  // https://github.com/ivmartel/jsonqa2md/releases/tag/v0.1.0
  const tagUrl = repoUrl + '/tag/' + gitTag;
  codeContext = {
    type: 'Tag',
    name: gitTag,
    url: tagUrl
  };
} else {
  // https://github.com/ivmartel/jsonqa2md/commit/273ad30
  const commitUrl = repoUrl + '/commit/' + gitHash;
  codeContext = {
    type: 'Commit',
    name: gitHash.substring(0, 7),
    url: commitUrl
  };
}

// counts
const numberOfTests = testContext.total;
const numberOfReq = requirements.length;

// add context to test results
const {numberOfTestsNoReq, numberOfTestsBadReq} =
  addContextToTestSuites(testSuites, requirements, testDescPattern);
//
const {reqGroups, numberOfReqNoTests} =
  getRequirementGroups(requirements);


// emoji
const emojiCheckMark = String.fromCodePoint(0x2705);
const emojiCrossMark = String.fromCodePoint(0x274C);
const emojiWarn = String.fromCodePoint(0x26A0, 0xFE0F);

// ---------------------------------------------------------------------
// write requirements

const reqWriteStream = fs.createWriteStream(reqMdFilename);
reqWriteStream.write('# User Stories\n');
reqWriteStream.write('\n');
reqWriteStream.write('## Introduction\n');
reqWriteStream.write(reqJSON.introduction + '\n');
reqWriteStream.write('\n');
const resGroupKeys = Object.keys(reqGroups);
for (const groupKey of resGroupKeys) {
  reqWriteStream.write('## ' + groupKey + '\n');
  // group info
  const groupInfo = reqJSON.groups.find((element) => element.name === groupKey);
  if (typeof groupInfo !== 'undefined') {
    reqWriteStream.write(groupInfo.description + '\n');
  }
  reqWriteStream.write('\n');
  // req info
  for (const req of reqGroups[groupKey]) {
    reqWriteStream.write('### ' + req.id + ' ' + req.name + '\n');
    reqWriteStream.write(req.description + '\n');
    for (const warn of req.warn) {
      reqWriteStream.write('\n' + emojiWarn + ' ' + warn + '\n');
    }
    reqWriteStream.write('\n');
  }
}
reqWriteStream.end();

// ---------------------------------------------------------------------
// write tests results

const testWriteStream = fs.createWriteStream(testResultsMdFilename);
testWriteStream.write('# Tests Results\n');
testWriteStream.write('\n');

testWriteStream.write('## Context\n');
if (typeof codeContext !== 'undefined') {
  testWriteStream.write('\n' +
    codeContext.type + ': [' +
    codeContext.name + '](' +
    codeContext.url + ')\n');
}
testWriteStream.write('\nDate: ' + new Date(testContext.startTime) + '\n');
if (typeof testContext.browser !== 'undefined') {
  testWriteStream.write('\nBrowser: ' + testContext.browser + '\n');
}
testWriteStream.write('\n');

testWriteStream.write('## Summary\n');
testWriteStream.write(
  'Success: ' + testContext.success + ' ' + emojiCheckMark + '\n');
testWriteStream.write(
  '\nFailed: ' + testContext.failed + ' ' + emojiCrossMark + '\n');
testWriteStream.write('\n(total: ' + testContext.total + ', ');
testWriteStream.write('skipped: ' + testContext.skipped + ', ');
testWriteStream.write('total time: ' + testContext.totalTime + 'ms)\n');
testWriteStream.write('\n');

testWriteStream.write('## Tests details\n');
testWriteStream.write('\n');
const numberOfTestsWithReq =
  numberOfTests - (numberOfTestsNoReq + numberOfTestsBadReq);
const finalSWithReq = numberOfTestsWithReq > 1 ? 's' : '';
testWriteStream.write('(' + numberOfTestsWithReq +
  ' / ' + numberOfTests + ' test' + finalSWithReq + ' with requirement(s)');
if (numberOfTestsNoReq !== 0) {
  testWriteStream.write(', ' +
    getNumberString(numberOfTestsNoReq, 'test') +
    ' with no requirement');
}
if (numberOfTestsBadReq !== 0) {
  testWriteStream.write(', ' +
    getNumberString(numberOfTestsBadReq, 'test') +
    ' with bad requirement reference');
}
testWriteStream.write(')\n');
testWriteStream.write('\n');
const testSuiteKeys = Object.keys(testSuites);
for (const suite of testSuiteKeys) {
  testWriteStream.write('### ' + suite + '\n');
  for (const testResult of testSuites[suite]) {
    let testName = testResult.description;
    if (typeof testResult.name !== 'undefined') {
      testName = testResult.name;
    }
    testWriteStream.write('\n- ' + testName + ': ');
    if (testResult.success) {
      testWriteStream.write(emojiCheckMark);
    } else {
      testWriteStream.write(emojiCrossMark);
    }
    testWriteStream.write('\n(');
    if (typeof testResult.req !== 'undefined') {
      if (typeof testResult.req.link !== 'undefined') {
        testWriteStream.write(testResult.req.link);
      } else {
        // description matches regex but no requirement found
        testWriteStream.write('URS #' + testResult.req.id +
          ' ' + testResult.req.name + ' (' + emojiWarn + ' Unknown)');
      }
    } else {
      testWriteStream.write(emojiWarn + ' No requirement reference');
    }
    testWriteStream.write(', ' + testResult.jsdoclink);
    testWriteStream.write(')');

    testWriteStream.write('\n');
  }
}

testWriteStream.write('\n## Traceability\n');
testWriteStream.write('\n');
const numberOfReqWithTest = numberOfReq - numberOfReqNoTests;
testWriteStream.write('(' + numberOfReqWithTest +
  ' / ' + numberOfReq + ' tested requirements)\n');
testWriteStream.write('\n');
for (const groupKey of resGroupKeys) {
  testWriteStream.write('### ' + groupKey + '\n');
  testWriteStream.write('\n');
  for (const req of reqGroups[groupKey]) {
    testWriteStream.write(req.link + ':\n');
    // associated test list
    if (typeof req.tests !== 'undefined') {
      for (const test of req.tests) {
        testWriteStream.write(' ');
        if (test.success) {
          testWriteStream.write(emojiCheckMark + ' ');
        } else {
          testWriteStream.write(emojiCrossMark + ' ');
        }
        testWriteStream.write(test.name + ' ');
        testWriteStream.write('\n');
      }
    } else {
      testWriteStream.write(' ' + emojiWarn + ' No tests\n');
    }
    testWriteStream.write('\n');
  }
}

testWriteStream.end();

function getNumberString(number, type) {
  const finalS = number > 1 ? 's' : '';
  return number + ' ' + type + finalS;
}

function isKarmaJsonTestResults(testJSON) {
  return typeof testJSON.browsers !== 'undefined' &&
    typeof testJSON.result !== 'undefined' &&
    typeof testJSON.summary !== 'undefined';
}

function parseKarmaJsonTestContext(testJSON) {
  // expecting just one test id
  const browsersKeys = Object.keys(testJSON.browsers);
  if (browsersKeys.length !== 1) {
    console.warn('More than one test browser: ' + browsersKeys.length);
  }
  const testId = browsersKeys[0];
  const browser = testJSON.browsers[testId];
  return {
    startTime: browser.lastResult.startTime,
    totalTime: browser.lastResult.totalTime,
    total: browser.lastResult.total,
    success: browser.lastResult.success,
    failed: browser.lastResult.failed,
    skipped: browser.lastResult.skipped,
    browser: browser.name
  };
}

function parseKarmaJsonTestResults(testJSON) {
  // expecting just one test id
  const browsersKeys = Object.keys(testJSON.browsers);
  if (browsersKeys.length !== 1) {
    console.warn('More than one test browser: ' + browsersKeys.length);
  }
  const testId = browsersKeys[0];
  const testResults = testJSON.result[testId];

  // sort test results suites
  const testSuites = {};
  for (const testResult of testResults) {
    const suiteName = testResult.suite;
    // create array if not preset
    if (typeof testSuites[suiteName] === 'undefined') {
      testSuites[suiteName] = [];
    }
    // add to list
    testSuites[suiteName].push({
      description: testResult.description,
      success: testResult.success,
      suite: suiteName
    });
  }

  return testSuites;
}

function isVitestJsonTestResults(testJSON) {
  return typeof testJSON.numTotalTestSuites !== 'undefined' &&
    typeof testJSON.snapshot !== 'undefined' &&
    typeof testJSON.testResults !== 'undefined';
}

function parseVitestJsonTestContext(testJSON) {
  // expecting just one test result
  if (testJSON.testResults.length !== 1) {
    console.warn('More than one test result: ' + testJSON.testResults.length);
  }
  const testResult = testJSON.testResults[0];
  return {
    startTime: testResult.startTime,
    totalTime: Math.round(testResult.endTime - testResult.startTime),
    total: testJSON.numTotalTests,
    success: testJSON.numPassedTests,
    failed: testJSON.numFailedTests,
    skipped: testJSON.numPendingTests
  };
}

function parseVitestJsonTestResults(testJSON) {
  // expecting just one test result
  if (testJSON.testResults.length !== 1) {
    console.warn('More than one test result: ' + testJSON.testResults.length);
  }
  const testResults = testJSON.testResults[0].assertionResults;

  // sort test results suites
  const testSuites = {};
  for (const testResult of testResults) {
    const suiteName = testResult.ancestorTitles[0];
    // create array if not preset
    if (typeof testSuites[suiteName] === 'undefined') {
      testSuites[suiteName] = [];
    }
    // add to list
    testSuites[suiteName].push({
      description: testResult.title,
      success: testResult.status === 'passed',
      suite: suiteName
    });
  }

  return testSuites;
}

function addContextToTestSuites(testSuites, requirements, testDescPattern) {
  let numberOfTestsNoReq = 0;
  let numberOfTestsBadReq = 0;
  const suiteKeys = Object.keys(testSuites);
  for (const suiteKey of suiteKeys) {
    const testSuite = testSuites[suiteKey];
    for (const testResult of testSuite) {
      let testName = testResult.description;
      // find req
      const match = testDescPattern.exec(testResult.description);
      if (match) {
        testName = match[1];
        testResult.name = testName;

        const reqId = match[2];
        const reqName = match[3];
        const req = requirements.find((element) => {
          return element.id === reqId && element.name === reqName;
        });
        // if found, add test to req
        if (typeof req !== 'undefined') {
          if (typeof req.tests === 'undefined') {
            req.tests = [];
          }
          req.tests.push(testResult);
          testResult.req = req;
        } else {
          testResult.req = {
            id: reqId,
            name: reqName,
          };
          ++numberOfTestsBadReq;
        }
      } else {
        ++numberOfTestsNoReq;
      }
      // test code link
      const testNameLink = testName.replaceAll(' ', '-');
      const testNameAnchor = testNameLink.toLowerCase();
      const linkUrl =
        'module-tests_' + testResult.suite +
        '.html#~' + encodeURIComponent(testNameAnchor);
      const linkText = 'jsdoc';
      testResult.jsdoclink = '[' + linkText + '](' + linkUrl + ')';
    }
  }

  return {numberOfTestsBadReq, numberOfTestsNoReq};
}

function getRequirementGroups(requirements) {
  const reqGroups = {};
  let numberOfReqNoTests = 0;
  for (const req of requirements) {
    // create array if not preset
    if (typeof reqGroups[req.group] === 'undefined') {
      reqGroups[req.group] = [];
    }
    // link
    const reqNameLink = req.name.replaceAll(' ', '-');
    const reqNameAnchor = (req.id + '-' + reqNameLink).toLowerCase();
    const linkUrl = reqTutorial + '#' + encodeURIComponent(reqNameAnchor);
    const linkText = '#' + req.id + ' (' + req.name + ')';
    req.link = 'URS [' + linkText + '](' + linkUrl + ')';
    // count not tested
    if (typeof req.tests === 'undefined') {
      ++numberOfReqNoTests;
    }
    // add
    reqGroups[req.group].push(req);
  }

  // check duplicates
  for (const req of requirements) {
    req.warn = [];
    // check duplicate id
    const reqSameId = requirements.find((element) => {
      return element !== req &&
        element.group === req.group &&
        element.id === req.id;
    });
    if (typeof reqSameId !== 'undefined') {
      req.warn.push('duplicate ID (in group) with ' + reqSameId.link);
    }
    // check duplicate name
    const reqSameName = requirements.find((element) => {
      return element !== req &&
        element.group === req.group &&
        element.name === req.name;
    });
    if (typeof reqSameName !== 'undefined') {
      req.warn.push('duplicate name (in group) with ' + reqSameName.link);
    }
  }

  return {reqGroups, numberOfReqNoTests};
}