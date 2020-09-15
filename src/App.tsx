import React from 'react';
import { Container } from 'react-grid-system';
import FileUploader from './components/FileUploader';

const App = () => (
  <Container>
    <h1>
      Rest Tester
    </h1>
    <FileUploader/>
  </Container>
)

export default App;
