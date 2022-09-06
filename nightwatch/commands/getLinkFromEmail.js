/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
const superagent = require('superagent');
const cheerio = require('cheerio');

const getEmailBody = async (apiToken, inboxId, searchValue = '') => {
  const messages = await superagent
    .get(
      `https://mailtrap.io/api/v1/inboxes/${inboxId}/messages?search=${searchValue}`
    )
    .set('Api-Token', apiToken)
    .then((res) => JSON.parse(res.text))
    .catch((err) => {
      throw new Error(err.message);
    });

  if (messages.length > 0) {
    const htmlBody = await superagent
      .get(`https://mailtrap.io/${messages[0].html_path}`)
      .set('Api-Token', apiToken)
      .set('Content-type', 'application/html')
      .then((res) => {
        const $ = cheerio.load(res.text);
        return $('a').attr('href');
      })
      .catch((err) => ({
        status: -1,
        error: err.message,
      }));
    return htmlBody;
  }
  return '';
};

module.exports = class GetEmailBody {
  async command(inboxId, searchValue = '') {
    const mailtrapOptions = this.api.globals.mailtrap || {};
    const apiToken = mailtrapOptions.apiToken ? mailtrapOptions.apiToken : '';

    let returnValue;
    try {
      returnValue = await getEmailBody(apiToken, inboxId, searchValue);
    } catch (err) {
      console.error(
        'An error occurred while retrieving messages from MailTrap',
        err.message
      );
      returnValue = {
        status: -1,
        error: err.message,
      };
    }

    return returnValue;
  }
};
