declare interface IApCommandSetCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'ApCommandSetCommandSetStrings' {
  const strings: IApCommandSetCommandSetStrings;
  export = strings;
}
