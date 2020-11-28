import runtime from '@iooxa/runtime';
import thunkMiddleware from 'redux-thunk';
import { middleware } from '../src';

export default [
  thunkMiddleware,
  ...middleware,
  runtime.triggerEvaluate,
  runtime.dangerousEvaluatation,
];
