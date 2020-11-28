import thunkMiddleware from 'redux-thunk';
import { middleware } from '../src';

export default [
  thunkMiddleware,
  ...middleware,
];
