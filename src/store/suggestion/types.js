export var UPDATE_SUGGESTION = 'UPDATE_SUGGESTION';
export var UPDATE_RESULTS = 'UPDATE_RESULTS';
export var SELECT_SUGGESTION = 'SELECT_SUGGESTION';
export var variableTrigger = /^([a-zA-Z0-9_]+)\s?=/;
export var SuggestionKind;
(function (SuggestionKind) {
    SuggestionKind["emoji"] = "emoji";
    SuggestionKind["link"] = "link";
    SuggestionKind["command"] = "command";
    SuggestionKind["variable"] = "variable";
    SuggestionKind["display"] = "display";
    SuggestionKind["mention"] = "mention";
})(SuggestionKind || (SuggestionKind = {}));
//# sourceMappingURL=types.js.map