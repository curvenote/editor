import { combineReducers } from "redux";
import ui from "./ui/reducers";

const reducer = combineReducers({
  ui,
});

export default reducer;
