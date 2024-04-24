const fs = require('fs');
const {execSync} = require('child_process');

const pkgFilename = 'package.json';
const reqFilename = 'resources/doc/user-stories.json';
const testResultsFilename = 'build/test-results.json';

const reqTutorial = 'tutorial-user-stories.html';

const reqMdFilename = 'resources/doc/tutorials/user-stories.md';
const testResultsMdFilename = 'resources/doc/tutorials/test-results.md';

// emoji
const emojiCheckMark = String.fromCodePoint(0x2705);
const emojiCrossMark = String.fromCodePoint(0x274C);
const emojiWarn = String.fromCodePoint(0x26A0, 0xFE0F);

// package
const pkgJSON = JSON.parse(fs.readFileSync(pkgFilename));
const repoUrl = pkgJSON.repository.url;

// git info
const gitCommandGetTag = 'git tag --points-at HEAD';
const gitTag = execSync(gitCommandGetTag).toString().trim();
const gitCommandGetHash = 'git rev-parse HEAD';
const gitHash = execSync(gitCommandGetHash).toString().trim();

// requirements
const reqJSON = JSON.parse(fs.readFileSync(reqFilename));
const requirements = reqJSON.requirements;

// tests
const testJSON = JSON.parse(fs.readFileSync(testResultsFilename));
// for example 'Add zero - [resolves] #JQ2MD-001 Add two numbers'
// const testDescPattern = /(.*) - \[(\S*)\] #(\S*) (.*)/;
// for example 'Add zero - #JQ2MD-001 Add two numbers'
const testDescPattern = /(.*) - #(\S*) (.*)/;

// expecting just one test id
const browsersKeys = Object.keys(testJSON.browsers);
if (browsersKeys.length !== 1) {
  console.warn('More than one test browser: ' + browsersKeys.length);
}
const testId = browsersKeys[0];
const testBrowser = testJSON.browsers[testId];
const testResults = testJSON.result[testId];

// sort test results suites
const testSuites = {};
let numberOfTestsNoReq = 0;
let numberOfTestsBadReq = 0;
for (const testResult of testResults) {
  let testName = testResult.description;
  // create array if not preset
  if (typeof testSuites[testResult.suite] === 'undefined') {
    testSuites[testResult.suite] = [];
  }
  // find req
  const match = testDescPattern.exec(testResult.description);
  if (match) {
    testName = match[1]
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
  const linkUrl = 'module-tests_' + testResult.suite + '.html#~' + encodeURIComponent(testNameAnchor);
  const linkText = 'jsdoc';
  testResult.jsdoclink = '[' + linkText + '](' + linkUrl + ')';
  // add to list
  testSuites[testResult.suite].push(testResult);
}

// sort requirements groups
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

// ---------------------------------------------------------------------
// write requirements

var reqWriteStream = fs.createWriteStream(reqMdFilename);
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
  for (const req of reqGroups[groupKey]) {
    reqWriteStream.write('### ' + req.id + ' ' + req.name + '\n');
    reqWriteStream.write(req.description + '\n');
    // check duplicate id
    const reqSameId = requirements.find((element) => {
      return element !== req && element.group === req.group && element.id === req.id;
    });
    if (typeof reqSameId !== 'undefined') {
      reqWriteStream.write('\n' + emojiWarn +
        ' duplicate ID (in group) with ' + reqSameId.link + '\n');
    }
    // check duplicate name
    const reqSameName = requirements.find((element) => {
      return element !== req && element.group === req.group && element.name === req.name;
    });
    if (typeof reqSameName !== 'undefined') {
      reqWriteStream.write('\n' + emojiWarn +
        ' duplicate name (in group) with ' + reqSameName.link + '\n');
    }
    reqWriteStream.write('\n');
  }
}
reqWriteStream.end();

// ---------------------------------------------------------------------
// write tests results

var testWriteStream = fs.createWriteStream(testResultsMdFilename);
testWriteStream.write('# ' + pkgJSON.name + ' Tests Results\n');
testWriteStream.write('\n');

testWriteStream.write('## Context\n');
const lastResult = testBrowser.lastResult;
testWriteStream.write('\nDate: ' + new Date(lastResult.startTime) + '\n');
if (gitTag.length !== 0) {
  // https://github.com/ivmartel/jsonqa2md/releases/tag/v0.1.0
  const tagUrl = repoUrl + '/tag/' + gitTag;
  testWriteStream.write('\nTag: [' + gitTag + '](' + tagUrl + ')\n');
} else {
  // https://github.com/ivmartel/jsonqa2md/commit/273ad30
  const commitUrl = repoUrl + '/commit/' + gitHash;
  testWriteStream.write('\nCommit: [' + gitHash.substring(0, 7) +
    '](' + commitUrl + ')\n');
}
testWriteStream.write('\nBrowser: ' + testBrowser.name + '\n');
testWriteStream.write('\n');

testWriteStream.write('## Summary\n');
testWriteStream.write('Success: ' + lastResult.success + ' ' + emojiCheckMark + '\n');
testWriteStream.write('\nFailed: ' + lastResult.failed + ' ' + emojiCrossMark + '\n');
testWriteStream.write('\n(total: ' + lastResult.total + ', ');
testWriteStream.write('skipped: ' + lastResult.skipped + ', ');
testWriteStream.write('total time: ' + lastResult.totalTime + 'ms)\n');
testWriteStream.write('\n');

testWriteStream.write('## Details\n');
testWriteStream.write('\n');
testWriteStream.write('(' + numberOfTestsNoReq + ' test(s) with no requirement, ' +
  numberOfTestsBadReq + ' test(s) with bad requirement reference)\n');
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
      testWriteStream.write(emojiCheckMark + ' ');
    } else {
      testWriteStream.write(emojiCrossMark + ' ');
    }
    testWriteStream.write('\n(');
    if (typeof testResult.req !== 'undefined') {
      if (typeof testResult.req.link !== 'undefined') {
        testWriteStream.write(testResult.req.link);
      } else {
        // description matches regex but no requirement found
        testWriteStream.write('URS #' + testResult.req.id + ' ' + testResult.req.name + ' (' + emojiWarn + ' Unknown)');
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
testWriteStream.write('(' + numberOfReqNoTests + ' untested requirements)\n');
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
