export interface Encrypter {
  encrypt (jsonParams: string): Promise<string>
}
