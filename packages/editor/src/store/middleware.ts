import stateMiddleware from './state/middleware';
import uiMiddleware from './ui/middleware';

const middleware = [...stateMiddleware, ...uiMiddleware];

export default middleware;
