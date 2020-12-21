/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
// https://fettblog.eu/typescript-react-extending-jsx-elements/


interface HasDoc {
  doc: string;
}

type CommentAnchor = {
  comment: string;
} & HasDoc;

declare module JSX {
  interface IntrinsicElements {
    'article': React.DetailedHTMLProps<HasDoc & React.HTMLAttributes, HTMLElement>;
    'comment-anchor': React.DetailedHTMLProps<CommentAnchor & React.HTMLAttributes, HTMLElement>;
  }
}
