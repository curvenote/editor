import { nodes, marks } from '@curvenote/schema';
import { Schema } from 'prosemirror-model';

const schema = new Schema({ nodes, marks });

export default schema;
