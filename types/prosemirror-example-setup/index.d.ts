declare module 'prosemirror-example-setup' {
  export function exampleSetup(opts: {
    schema: any;
    mapKeys?: any;
    menuBar?: boolean;
    history?: boolean;
    floatingMenu?: boolean;
  }): any[];
}
