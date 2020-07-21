import { getFixtures, getTokenizer } from './build';

const tokenizer = getTokenizer();

describe('Roles', () => {
  getFixtures('roles.generic').forEach(([name, md, html]) => {
    it(name, () => expect(tokenizer.render(md)).toEqual(`${html}\n`));
  });
  getFixtures('roles.known').forEach(([name, md, html]) => {
    it(name, () => expect(tokenizer.render(md)).toEqual(`${html}\n`));
  });
  getFixtures('directives.known').forEach(([name, md, html]) => {
    it(name, () => expect(tokenizer.render(md)).toEqual(`${html}\n`));
  });
});
