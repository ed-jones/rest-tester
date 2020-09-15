import React from 'react';
import { Container } from 'react-grid-system';
import SwaggerInput from './components/SwaggerInput';
import { Classes, Colors } from "@blueprintjs/core";

const App = () => {
  let dark_theme: boolean = true;

  if (dark_theme) {
    document.getElementsByTagName("body")[0].setAttribute("style", `background-color: ${Colors.DARK_GRAY4}`)
  }

  return (
    <div className={dark_theme?Classes.DARK:undefined}>
      <Container>
        <h1>
          Rest Tester
        </h1>
        <SwaggerInput/>
      </Container>
    </div>
  )
}

export default App;
