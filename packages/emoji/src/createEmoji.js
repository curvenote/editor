/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const emoji = require('emoji.json');
const fs = require('fs');

// The other dataset is from:
// https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji_pretty.json

const allEmojiData = fs.readFileSync('src/emoji_pretty.json');
const allEmoji = JSON.parse(allEmojiData.toString());

const byCode = {};
allEmoji.forEach((item) => {
  byCode[item.unified.split('-').join(' ')] = item;
});

const set = {};
emoji
  .filter((item) => item.name.indexOf('skin tone') === -1)
  .forEach((item) => {
    if (item.name in set && item.codes.indexOf(' ') === -1) return;
    const short = (byCode[item.codes] || {}).short_name;
    set[item.name] = {
      c: item.char,
      n: item.name,
      s: short || '',
      o: ((byCode[item.codes] || {}).short_names || []).filter((i) => i !== short).join(' '),
    };
  });
// Some edits
set['pile of poo'].s = 'poop';
set['pile of poo'].o = 'hankey shit';
set['face with symbols on mouth'].o = 'fuck !@#$%';
set['slightly smiling face'].o += ' :)';
set['slightly frowning face'].o += ' :(';
set['winking face'].o += ' ;)';
set['red heart'].o += ' <3';
set['broken heart'].o += ' </3';
set['neutral face'].o += ' :|';
set['grinning face'].o += ' :D';
set['face with tongue'].o += ' :p';
set['winking face with tongue'].o += ' ;p';
set['crying face'].o += " :'( :’(";
const filteredEmoji = Object.entries(set).map(([, item]) => item);

const frequent = [
  set['thumbs up'],
  set['thumbs down'],
  set['grinning face'],
  set['red heart'],
  set.rocket,
  set['party popper'],
  set.eyes,
  set['confused face'],
];

// Uncomment to see the short text names of emoji
// console.log(allEmoji.filter((item) => item.text != null).map((i) => [i.text, i.short_name]));

const toTitleCase = (name) =>
  name
    .toLowerCase()
    .split(' ')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');

const data = JSON.stringify({
  default: frequent.map((i) => ({ ...i, n: toTitleCase(i.n) })),
  emoji: filteredEmoji.map((i) => ({ ...i, n: toTitleCase(i.n) })),
});

fs.writeFileSync('data.json', data);
