jsonqa2md
=======

Cli to convert json QA documents into markdown.

Run `node jsonqa2md` in a javascript github repo, it will generate markdown files
that can be integrated in a jsdoc documentation. See the demo files of this repo for example input/output.

Default input:
- `package.json`: json package description
- `resources/doc/user-stories.json`: json requirements as a list of
`{id, name, group, description}`
- `build/test-results.json`: json tests results as output by Karma

Test descriptions must make a reference to a requirement. They should be in the
form of: `Add zero - #JQ2MD-001 Add two numbers` ([name] - [requirement key] [requirement name]).

Default output:
- `resources/doc/tutorials/user-stories.md`: with warnings for duplicate keys and/or names
- `resources/doc/tutorials/test-results.md`: with a traceability list to see tested requirements

Inspired from https://github.com/davidahouse/junit-to-md
