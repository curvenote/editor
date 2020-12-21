/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
// https://fettblog.eu/typescript-react-extending-jsx-elements/


interface HasDoc {
  doc: string;
}

type CommentAnchor = {
  comment: string;
};

type CommentBase = {
  anchor: string;
};

declare module JSX {
  interface IntrinsicElements {
    'article': React.DetailedHTMLProps<HasDoc & React.HTMLAttributes, HTMLElement>;
    'comment-anchor': React.DetailedHTMLProps<CommentAnchor & React.HTMLAttributes, HTMLElement>;
    'comment-base': React.DetailedHTMLProps<CommentBase & React.HTMLAttributes, HTMLElement>;
  }
}
