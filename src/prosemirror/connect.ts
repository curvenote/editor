import { createMuiTheme, Theme } from '@material-ui/core';
import { KEEP_SELECTION_ALIVE, SuggestionAction } from './plugins/suggestion';

const theme = createMuiTheme({});

export type Options = {
  image: {
    upload:  (file: File) => Promise<string>;
    downloadUrl: (src: string) => Promise<string>;
  },
  theme: Theme,
  onSuggestion: (action: SuggestionAction) => boolean | typeof KEEP_SELECTION_ALIVE;
  focusSelected: (focus: boolean) => void,
};

const connect: Options = {
  image: {
    upload: (file) => {console.log(file); throw new Error('upload not setup');},
    downloadUrl: async (src) => src,
  },
  theme,
  onSuggestion: (action) => { console.log(action); return false; },
  focusSelected: (focus: boolean) => console.log('Focus lost!'),
};

export default connect
