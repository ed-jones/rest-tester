import React, { useState } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import SwaggerInput from './components/SwaggerInput';
import { Alignment, Classes, Colors, Switch, Icon } from "@blueprintjs/core";

const App = () => {
  let rehydratedDarkTheme = sessionStorage.getItem("darkTheme")==='true' || false;
  let [darkTheme, setDarkTheme] = useState(rehydratedDarkTheme);

  function toggleDarkTheme() {
    sessionStorage.setItem('darkTheme', String(!darkTheme));
    setDarkTheme(!darkTheme)
  }

  return (
    <div className={darkTheme?Classes.DARK:undefined}>
      {document.getElementsByTagName("body")[0]
      .setAttribute("style", `background-color: ${darkTheme?Colors.DARK_GRAY5:Colors.LIGHT_GRAY5}`)}
      <Container>
        <Row>
          <Col>
            <h1>
                <Icon iconSize={32} icon="lab-test"/> REST Tester
            </h1>
          </Col>
          <Col>
            <br/>
            <br/>
            <Switch 
              onClick={toggleDarkTheme}
              innerLabel="Light"
              innerLabelChecked="Dark"
              defaultChecked={darkTheme}
              style={{float:"right"}}
              label="Theme"
              alignIndicator={Alignment.RIGHT}
            />
          </Col>
        </Row>
        <SwaggerInput/>
      </Container>
    </div>
  )
}

export default App;
