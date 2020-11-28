import { createMuiTheme, Theme } from '@material-ui/core';

const theme = createMuiTheme({});

export type Options = {
  transformKeyToId: (key: any) => string;
  image: {
    upload: (file: File) => Promise<string>;
    downloadUrl: (src: string) => Promise<string>;
  };
  theme: Theme;
};

const config: Options = {
  transformKeyToId: (key) => key,
  image: {
    upload: (file) => { console.log(file); throw new Error('upload not setup'); },
    downloadUrl: async (src) => src,
  },
  theme,
};

export default config;
