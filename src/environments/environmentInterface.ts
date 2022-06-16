export interface Ienviroment {
  production: boolean,
  clientId: string,
  authority: string,
  redirectUri: string,
  adminGroups: string[],
  protectedResourceMap: [string, string[]][],
  updateFreq: number
}
