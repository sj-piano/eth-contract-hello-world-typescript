//

// https://stackoverflow.com/questions/40141005/property-code-does-not-exist-on-type-error
declare interface Error {
  name: string;
  message: string;
  stack?: string;
  code?: number | string;
}
