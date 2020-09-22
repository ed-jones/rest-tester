import React, { useState } from 'react';
import { Container } from 'react-grid-system';
import SwaggerInput from './components/SwaggerInput';
import { Classes, Colors, Button, Icon } from "@blueprintjs/core";
import Settings from "./components/Settings";
import { FocusStyleManager } from "@blueprintjs/core";

const App = () => {
  let rehydratedDarkTheme = sessionStorage.getItem("darkTheme")==='true' || false;
  let [darkTheme, setDarkTheme] = useState(rehydratedDarkTheme);
  let [settingsOpen, setSettingsOpen] = useState(false);
  FocusStyleManager.onlyShowFocusOnTabs();

  function toggleDarkTheme() {
    sessionStorage.setItem('darkTheme', String(!darkTheme));
    setDarkTheme(!darkTheme);
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
            <Button 
              minimal 
              style={{margin:"0 0 0 auto"}} 
              onClick={() => setSettingsOpen(true)}
              icon={
                <Icon 
                  iconSize={24} 
                  icon="cog" 
                />
            }/>
            
          </div>
        <SwaggerInput/>
      </Container>
      <Settings 
        useOpen={[settingsOpen, setSettingsOpen]} 
        useTheme={[darkTheme, toggleDarkTheme]}
      />
    </div>
  )
}

export default App;
