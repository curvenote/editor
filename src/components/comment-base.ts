import {
  LitElement, html, customElement, property, css,
} from 'lit-element';
import { store } from '../connect';
import { connectAnchorBase, disconnectAnchor } from '../store/ui/actions';
import { getDoc } from './utils';

@customElement('comment-base')
export class CommentBase extends LitElement {
  @property({ type: String })
  anchor = undefined;

  doc?: string;

  connectedCallback() {
    super.connectedCallback();
    this.doc = getDoc(this);
    store.dispatch(connectAnchorBase(this.doc, this.anchor, this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    store.dispatch(disconnectAnchor(this.doc, this));
  }

  static get styles() {
    return css`:host {display: block;}`;
  }

  render() {
    return html`<slot></slot>`;
  }
}

export default CommentBase;
