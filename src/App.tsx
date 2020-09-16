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
        <div style={{display:'flex',alignItems:'center'}}>
            <h1>
                <Icon iconSize={32} icon="lab-test"/> REST Tester
            </h1>
            <Switch 
              onClick={toggleDarkTheme}
              innerLabel="Light"
              innerLabelChecked="Dark"
              defaultChecked={darkTheme}
              style={{margin:"0 0 0 auto"}} 
              label="Theme"
              alignIndicator={Alignment.RIGHT}
            />
          </div>
        <SwaggerInput/>
      </Container>
    </div>
  )
}

export default App;
