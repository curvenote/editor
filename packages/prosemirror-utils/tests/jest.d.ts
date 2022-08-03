export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualDocument(actual: any): R;
    }
  }
}
