export var UPDATE_SUGGESTION = 'UPDATE_SUGGESTION';
export var UPDATE_RESULTS = 'UPDATE_RESULTS';
export var SELECT_SUGGESTION = 'SELECT_SUGGESTION';
export var variableTrigger = /^([a-zA-Z0-9_]+)\s?=/;
export var SuggestionKind;
(function (SuggestionKind) {
    SuggestionKind[SuggestionKind["emoji"] = 0] = "emoji";
    SuggestionKind[SuggestionKind["person"] = 1] = "person";
    SuggestionKind[SuggestionKind["link"] = 2] = "link";
    SuggestionKind[SuggestionKind["command"] = 3] = "command";
    SuggestionKind[SuggestionKind["variable"] = 4] = "variable";
    SuggestionKind[SuggestionKind["display"] = 5] = "display";
})(SuggestionKind || (SuggestionKind = {}));
//# sourceMappingURL=types.js.map