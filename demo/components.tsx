import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import MentionInput, { PersonSuggestion } from '../src/components/MentionInput';

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
  const [suggestions, setSuggestion] = useState(TEST_SUGGESTION_LIST);
  const [mentions, setMentions] = useState(INITIAL_MENTION);
  return (
    <div>
      <MentionInput
        suggestions={suggestions}
        onChange={(v) => {
          console.log('oncHnage', v);
          setMentions(v);
        }}
        onSearchChanged={(update) => {
          if (!update) {
            return;
          }
          console.log('onSearchChanged', update);
        }}
      />
      <pre>{JSON.stringify(mentions, null, 2)}</pre>
    </div>
  );
}

ReactDOM.render(<ComponentDemo />, document.getElementById('components'));
