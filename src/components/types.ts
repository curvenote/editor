/* eslint-disable @typescript-eslint/no-namespace */

export type CommentAnchor = {
  comment: string;
};

export type CommentBase = {
  anchor: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'comment-anchor': React.DetailedHTMLProps<CommentAnchor & React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'comment-base': React.DetailedHTMLProps<CommentBase & React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
