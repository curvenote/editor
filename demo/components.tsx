import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import MentionInput, { PersonSuggestion } from '../src/components/MentionInput';

export const EmailAvatar =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="EmailOutlinedIcon"%3E%3Cpath d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"%3E%3C/path%3E%3C/svg%3E';

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const TEST_SUGGESTION_LIST: PersonSuggestion[] = [
  { avatar: '', email: 'test3@gmail.com', name: '', id: 'test-1' },
  {
    avatar: 'https://lh3.googleusercontent.com/a-/AOh14Gg7MefXJ_MF1oDEiNThKLfOUwWy6p3P73ZrQkDq',
    email: 'stevejpurves@curvenote.com',
    name: 'stevejpurves',
    id: 'test-2',
  },
  {
    avatar:
      'https://storage.googleapis.com/iooxa-prod-1.appspot.com/photos/vKndfPAZO7WeFxLH1GQcpnXPzfH3?version=1601936136496',
    email: 'rowanc1@curvenote.com',
    id: 'test-3',
    name: 'rowanc1',
  },
  {
    avatar:
      'https://uploads-ssl.webflow.com/60ff0a25e3004400049dc542/611c16f84578e9136ea70668_1590515756464.jpg',
    email: 'liz@curvenote.com',
    name: 'liz',
    id: 'test-4',
  },
  {
    avatar:
      'https://storage.googleapis.com/iooxa-prod-1.appspot.com/photos/WeYvKUTFnSQOET5tyvW9TgLQLwb2?version=1629496337760',
    email: 'yuxi@curvenote.com',
    name: 'Yuxi',
    id: 'test-5',
  },
];

const INITIAL_MENTION: PersonSuggestion[] = [
  {
    id: 'tiny-rick-id',
    avatar: 'https://i1.sndcdn.com/artworks-000252690755-nj538v-t500x500.jpg',
    email: 'rick@rnm.com',
    name: 'Tiny Tick',
  },
  {
    id: 'morty-id',
    avatar: 'https://avatarfiles.alphacoders.com/179/179288.jpg',
    email: 'morty@rnm.com',
    name: 'Morty',
  },
];

function ComponentDemo() {
  const [isEmail, setIsEmail] = useState(false);
  const [suggestions, setSuggestions] = useState(TEST_SUGGESTION_LIST);
  const [search, setSearch] = useState('');
  const [mentions, setMentions] = useState(INITIAL_MENTION);

  useEffect(() => {
    if (validateEmail(search)) {
      setIsEmail(true);
    } else {
      setIsEmail(false);
    }
  }, [search]);
  return (
    <div>
      <MentionInput
        suggestions={
          isEmail ? [{ email: search, name: search, avatar: EmailAvatar, id: search }] : suggestions
        }
        onChange={(v) => {
          setMentions(v);
        }}
        onSearchChanged={(update) => {
          if (!update) {
            return;
          }
          setSearch(update);
        }}
      />
      <pre>{JSON.stringify(mentions, null, 2)}</pre>
    </div>
  );
}

ReactDOM.render(<ComponentDemo />, document.getElementById('components'));
