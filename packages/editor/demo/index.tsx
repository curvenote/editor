import React from 'react';
import ReactDOM from 'react-dom';
import { DemoEditor } from './init';
import { DemoEditor as NextEditor } from './NewEditorDemo';
import snippet from './snippet';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { styled } from '@stitches/react';

const Container = styled('div', {
  margin: 'auto',
  width: 800,
});

function App() {
  return (
    <Router>
      <Container>
        <nav>
          <ul>
            <li>
              <Link to="/">Legacy</Link>
            </li>
            <li>
              <Link to="/next">Next</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<DemoEditor content={snippet} />}></Route>
          <Route path="/next" element={<NextEditor content={snippet} />}></Route>
        </Routes>
      </Container>
    </Router>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
