import { createMuiTheme, Theme } from '@material-ui/core';
import { KEEP_SELECTION_ALIVE, SuggestionAction } from './prosemirror/plugins/suggestion';

const theme = createMuiTheme({});

export type Options = {
  transformKeyToId: (key: any) => string;
  image: {
    upload: (file: File) => Promise<string>;
    downloadUrl: (src: string) => Promise<string>;
  };
  theme: Theme;
  onSuggestion: (action: SuggestionAction) => boolean | typeof KEEP_SELECTION_ALIVE;
  focusSelected: (focus: boolean) => void;
};

const config: Options = {
  transformKeyToId: (key) => key,
  image: {
    upload: (file) => { console.log(file); throw new Error('upload not setup'); },
    downloadUrl: async (src) => src,
  },
  theme,
  onSuggestion: (action) => { console.log(action); return false; },
  focusSelected: (focus: boolean) => console.log('Focus lost!'),
};

export default config;
