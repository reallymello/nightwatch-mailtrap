import { NightwatchAPI, Awaitable } from 'nightwatch';
export * from 'nightwatch';

declare module 'nightwatch' {
  export interface NightwatchCustomCommands {
    /**
     * This will return the href value of the first link found in the most recent email in the specified mailbox id.
     * @param mailboxId
     * @param searchTerm
     * @returns String address of first link found in message body
     */
    getLinkFromEmail: (
      mailboxId: string,
      searchTerm?: string
    ) => Awaitable<NightwatchAPI, any>;
  }

  export interface NightwatchCustomAssertions {
    /**
     * This is a custom assertion that will return pass or fail if a partial match is found of your expectedText in the most recent email, filtered by the searchText parameter if provided.
     * @param expectedText The expected text that should match
     * @param inboxId The inbox id to get the message from
     * @param searchValue Optional email result set filter
     * @returns NightwatchAssertionsResult
     */
    emailBodyContains: (
      expectedText: string,
      inboxId: string,
      searchValue?: string
    ) => Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;
    /**
     * This is a custom assertion that will return pass or fail if a partial match is found of your expectedText in the most recent email's subject, filtered by the searchText parameter if provided.
     * @param expectedText The expected text that should match
     * @param inboxId The inbox id to get the message from
     * @param searchValue Optional email result set filter
     * @returns NightwatchAssertionsResult
     */
    emailSubjectContains: (
      expectedText: string,
      inboxId: string,
      searchValue?: string
    ) => Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;
    /**
     * This custom assertion will return pass or fail based on the inbox message count matches your expected count filtered by searchValue if provided.
     * @param expectedCount Expected number of messages
     * @param inboxId The inbox id to get the message count from
     * @param searchValue Optional search filter
     * @returns NightwatchAssertionsResult
     */
    expectedInboxCount: (
      expectedCount: number,
      inboxId: string,
      searchValue?: string
    ) => Awaitable<NightwatchAPI, NightwatchAssertionsResult<string>>;
  }
}
