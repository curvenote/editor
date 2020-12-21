/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
// https://fettblog.eu/typescript-react-extending-jsx-elements/

interface CommentAnchor {
  doc: string;
  comment: string;
}

declare module JSX {
  interface IntrinsicElements {
    'comment-anchor': React.DetailedHTMLProps<CommentAnchor & React.HTMLAttributes, HTMLElement>;
  }
}
