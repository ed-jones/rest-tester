import React from 'react';
import { Classes, ProgressBar, Button } from "@blueprintjs/core";

interface IProps {
    handleCancelTests: any,
}

export default function EndpointTests(props: IProps) {
    return (
        <div className={Classes.DIALOG_BODY}>
            <div style={{display:"flex", alignItems:"center"}}>
                <h3 style={{margin:0}}>
                    Running Tests...
                </h3>
                <Button 
                    style={{marginLeft:"auto"}} 
                    intent="danger" 
                    icon="delete"
                    onClick={props.handleCancelTests}
                    text="Cancel"
                />
            </div>
            <br/>
            <ProgressBar/>
        </div>
    )
}
