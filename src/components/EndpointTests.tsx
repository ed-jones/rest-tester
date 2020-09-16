import React from 'react';
import { Classes, ProgressBar, H4 } from "@blueprintjs/core";


export default function EndpointTests() {
    return (
        <div className={Classes.DIALOG_BODY}>
            <H4>Running Tests</H4>
            <ProgressBar/>
        </div>
    )
}
