module.exports = {
  'will match subject of most recent email': (browser) => {
    browser.assert.emailSubjectContains(
      'another car email',
      browser.globals.mailtrap.mailboxId
    );
  },
  'will match subject of other email other than most recent if search is used':
    (browser) => {
      browser.assert.emailSubjectContains(
        'another email',
        browser.globals.mailtrap.mailboxId,
        'another email'
      );
    },
  'will return empty subject if email does not exist': (browser) => {
    browser.assert.emailSubjectContains(
      '',
      browser.globals.mailtrap.mailboxId,
      'this email does not exist'
    );
  },
  'partial match on subject will pass': (browser) => {
    browser.assert.emailSubjectContains(
      'with',
      browser.globals.mailtrap.mailboxId,
      'test email'
    );
  },
  'not operator will cause mismatched subjects to pass': (browser) => {
    browser.assert.not.emailSubjectContains(
      'not the subject we want to discuss',
      browser.globals.mailtrap.mailboxId,
      'test email with link'
    );
  },
};
