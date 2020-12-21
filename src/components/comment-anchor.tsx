import {
  LitElement, html, customElement, property, eventOptions, css,
} from 'lit-element';
import classNames from 'classnames';
import { store } from '../connect';
import { connectAnchor, disconnectAnchor, selectAnchor } from '../store/ui/actions';
import { isCommentSelected } from '../store/ui/selectors';

@customElement('comment-anchor')
export class CommentAnchor extends LitElement {
  @property({ type: String })
  comment = undefined;

  @property({ type: String })
  doc = undefined;

  selected = false;

  @eventOptions({ capture: true })
  handleClick() { store.dispatch(selectAnchor(this.doc, this)); }

  unsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(connectAnchor(this.doc, this.comment, this));
    this.unsubscribe = store.subscribe(() => {
      const next = isCommentSelected(store.getState(), this.doc, this.comment);
      if (next !== this.selected) {
        this.selected = next;
        this.requestUpdate();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.unsubscribe?.();
    store.dispatch(disconnectAnchor(this.doc, this));
  }

  static get styles() {
    return css`
      .anchor {
        background-color: var(--commentColor, #F8E4B1);
      }
      .anchor:hover {
        background-color: var(--commentColorHover, #F7CF69B6);
      }
      .anchor.selected {
        background-color: var(--commentColorSelected, #F5C955);
      }
    `;
  }

  render() {
    const { selected } = this;
    return html`<span class=${classNames('anchor', { selected })} @click=${this.handleClick}><slot></slot></span>`;
  }
}

export default CommentAnchor;
