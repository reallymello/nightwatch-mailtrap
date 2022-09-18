# nightwatch-mailtrap

Nightwatch.js 🦉 plugin adding custom assertions for covering email functionality in e2e test scenarios with mailtrap.io 📨

[![Node.js CI](https://github.com/reallymello/nightwatch-mailtrap/actions/workflows/node.js.yml/badge.svg)](https://github.com/reallymello/nightwatch-mailtrap/actions/workflows/node.js.yml)

## Purpose

In your end-to-end (e2e) [Nightwatch](https://nightwatchjs.org/) browser test automation you may encounter scenarios where you need to ensure an email is sent out by the system under test to the correct recipient and verify its contents. Other scenarios, like user registration, may require following a link received in an email. This is hard to do programmatically with most mail services in a CI/CD system, but Mailtrap provides an email sandbox service with API that let's you programmatically receive and read email messages to their virtual inboxes.

The nightwatch-mailtrap plugin will allow one to programmatically

- Assert inbox message count (optionally filtered by subject, recipient name, or recipient address)
- Assert partial text match of email message body
- Assert partial text match of email subject
- Extract the first link from an email message body

## Examples

```js
module.exports = {
  'should get messages': async (browser) => {
    const inboxId = browser.globals.mailtrap.mailboxId;

    // Ability to grab the link URL out of the message body
    let url = await browser.getLinkFromEmail(inboxId);
    // Example navigating the browser to the URL from the message body link
    browser.url(url);

    // Test inbox contains 5 emails
    browser.assert.expectedInboxCount(5, inboxId);

    // Test inbox has 1 email if subject, to_email, or to_name matches "hello"
    browser.assert.expectedInboxCount(1, inboxId, 'hello');

    // Test that the first email message containing Welcome has "Bienvenue à Nightwatch" in the message body
    browser.assert.emailBodyContains(
      'Bienvenue à Nightwatch',
      inboxId,
      'Welcome'
    );

    // Assert the text of the first email matching 'latest tests' matches 'The latest tests delivered...'
    browser.assert.emailSubjectContains(
      'The latest tests delivered straight to your inbox',
      inboxId,
      'latest tests' // optional search filter
    );
  },

    browser.end();
  },
};
```

## Installation (for Nightwatch >= v2.0)

1. In an existing working [Nightwatch.js](https://nightwatchjs.org/guide/quickstarts/create-and-run-a-nightwatch-test.html) test project open `nightwatch.conf.js`
2. Locate or add the `plugins:` section and append `nightwatch-mailtrap` to the array.

```js
// nightwatch.conf.js
module.exports = {
  ...
  src_folders: ['test'],

  plugins: ['nightwatch-mailtrap'],
  ...
}
```

3. Run `npm install nightwatch-mailtrap --save` to ensure the library is added to your project and can be used as a plugin.

## Alternate Installation (Older method not using plugin pattern)

1. Run `npm install nightwatch-mailtrap --save`
2. Specify the paths for the custom commands and custom assertions in the `nightwatch.conf.js` file

```js
//nightwatch.conf.js
module.exports = {
...
  custom_commands_path: './node_modules/nightwatch-mailtrap/nightwatch/commands',
  custom_assertions_path: './node_modules/nightwatch-mailtrap/nightwatch/assertions',
...
}
```

## Configuration

nightwatch-mailtrap extends Nightwatch commands and assertions to work with an existing Mailtrap.io account. For that to work you need to provide your Mailtrap API Token and mailbox id (mailbox id is optional and can be provided at the test level). Those values are read from the `nightwatch.conf.js` globals section.

```js
//nightwatch.conf.js
test_settings: {
    default: {
      launch_url: 'http://localhost',
      desiredCapabilities: {
        browserName: 'chrome',
      },

      globals: {
        mailtrap: {
          apiToken: '${MAILTRAP_API_TOKEN}',
          mailboxId: '${MAILTRAP_MAILBOX_ID}',
        },
      },
    },
```

_It's recommended you use environment variables as shown instead of hardcoding these values_

## Usage

Once the configuration changes are made the commands and assertions will be made available to the Nightwatch API (browser object) in your test cases.

### browser.getLinkFromEmail(mailboxId: string, searchText: string?) => string

This will return the href value of the first link found in the most recent email in the specified mailbox id.

```js
const url = await browser.getLinkFromEmail('12345', 'activate your account');
browser.navigate(url);
```

### browser.assert.emailBodyContains(expectedText: string, mailboxId: string, searchText: string?) => NightwatchAPI

This is a custom assertion that will return pass or fail if a partial match is found of your expectedText in the most recent email, filtered by the searchText parameter if provided.

```js
browser.assert.emailBodyContains(
  'reaching out to you',
  browser.globals.mailtrap.mailboxId,
  'car warranty'
);
```

### browser.assert.expectedInboxCount(expectedCount: number, mailboxId: string, searchText: string?) => NightwatchAPI

```js
browser.assert.expectedInboxCount(
  2,
  browser.globals.mailtrap.mailboxId,
  'Jane'
);
```

Check my [software testing](https://www.davidmello.com/software-testing) blog for usage articles.
