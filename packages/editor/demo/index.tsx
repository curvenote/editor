import React from 'react';
import ReactDOM from 'react-dom';
import { DemoEditor } from './init';
import { DemoEditor as NextEditor } from './NewEditorDemo';
import snippet, { snippetNext } from './snippet';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { styled } from '@stitches/react';

const Container = styled('div', {
  margin: 'auto',
  width: 800,
});
const Ul = styled('ul', {
  listStyle: 'none',
  fontSize: 24,
  marginTop: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  li: {
    padding: 16,
  },
});

function App() {
  return (
    <>
      <Container>
        <nav>
          <Ul>
            <li>
              <Link to="/">Legacy</Link>
            </li>
            <li>
              <Link to="/article">Article</Link>
            </li>
          </Ul>
        </nav>

        <Routes>
          <Route path="/" element={<DemoEditor content={snippet} />}></Route>
          <Route path="/article" element={<NextEditor content={snippetNext} />}></Route>
        </Routes>
      </Container>
    </>
  );
}
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root'),
);
