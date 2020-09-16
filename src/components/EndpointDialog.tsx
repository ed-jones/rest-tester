import React, { useState } from 'react';
import { Dialog, Classes } from "@blueprintjs/core";
import { path_item } from '../interfaces/Swagger';
import EndpointDetails from './EndpointDetails';
import EndpointTests from './EndpointTests';

interface IProps {
    useOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    path: path_item,
    endpoint: string,
}

enum Panels {
    EndpointDetails,
    EndpointTests,
}

export default function EndpointDialog(props: IProps) {
    let [isOpen, setOpen] = props.useOpen;
    let [visiblePanel, setVisiblePanel] = useState(Panels.EndpointDetails)
    let rehydratedDarkTheme = sessionStorage.getItem("darkTheme")==='true' || false;

    function handleRunTests() {
        setVisiblePanel(Panels.EndpointTests)
    }

    return (
        <Dialog
            icon="lab-test"
            title={`Test Endpoint "${props.endpoint}"`}
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            className={rehydratedDarkTheme?Classes.DARK:undefined}
        >
            {visiblePanel===Panels.EndpointDetails?(
                <EndpointDetails {...props} handleRunTests={handleRunTests} />
            ):visiblePanel===Panels.EndpointTests?(
                <EndpointTests/>
            ):null}
        </Dialog>
    )
}
