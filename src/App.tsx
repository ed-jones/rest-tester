import React, { useState } from 'react';
import { Container } from 'react-grid-system';
import SwaggerInput from './components/home/SwaggerInput';
import { Classes, Colors, Button, Icon } from "@blueprintjs/core";
import Settings from "./components/settings/Settings";
import { FocusStyleManager } from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();

const App = () => {
  let [state, setState] = useState({
    darkTheme: sessionStorage.getItem("darkTheme") === 'true',
    settingsOpen: false,
  })

  function toggleDarkTheme() {
    sessionStorage.setItem('darkTheme', String(!state.darkTheme));
    setState({ ...state, darkTheme: !state.darkTheme });
  }

  function closeSettings() {
    setState({ ...state, settingsOpen: false });
  }

  return (
    <div className={state.darkTheme ? Classes.DARK : undefined}>
      {document.getElementsByTagName("body")[0]
        .setAttribute("style", `background-color: ${state.darkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY5}`)}
      <Container>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1>
            <Icon iconSize={32} icon="lab-test" /> REST Tester
            </h1>
          <Button
            minimal
            style={{ margin: "0 0 0 auto" }}
            onClick={() => setState({ ...state, settingsOpen: true })}
            icon={
              <Icon
                iconSize={24}
                icon="cog"
              />
            } />

        </div>
        <SwaggerInput />
      </Container>
      <Settings
        useOpen={[state.settingsOpen, closeSettings]}
        useTheme={[state.darkTheme, toggleDarkTheme]}
      />
    </div>
  )
}

export default App;
