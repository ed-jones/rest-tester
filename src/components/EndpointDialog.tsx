import React, { useState } from 'react';
import { Dialog, Classes } from "@blueprintjs/core";
import { path_item } from '../interfaces/Swagger';
import EndpointDetails from './EndpointDetails';
import EndpointTests from './EndpointTests';

interface IProps {
    useOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    path: path_item,
    endpoint: string,
    baseURL: string,
}

enum Panels {
    EndpointDetails,
    EndpointTests,
}

export default function EndpointDialog(props: IProps) {
    let [isOpen, setOpen] = props.useOpen;
    let [visiblePanel, setVisiblePanel] = useState(Panels.EndpointDetails)
    let [operation, setOperation] = useState(Object.keys(props.path)[0]);
    let [operationObj, setOperationObj] = useState(Object.values(props.path)[0])
    let rehydratedDarkTheme = sessionStorage.getItem("darkTheme")==='true' || false;

    function handleRunTests() {
        setVisiblePanel(Panels.EndpointTests);
    }

    function handleCancelTests() {
        setVisiblePanel(Panels.EndpointDetails);
    }

    return (
        <Dialog
            icon="lab-test"
            title={`Test Endpoint "${props.endpoint}"`}
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            className={rehydratedDarkTheme?Classes.DARK:undefined}
            style={{width:"600px"}}
        >
            {visiblePanel===Panels.EndpointDetails?(
                <EndpointDetails {...props} 
                    handleRunTests={handleRunTests} 
                    operation={[operation, setOperation]}
                    operationObj={[operationObj, setOperationObj]}
                />
            ):visiblePanel===Panels.EndpointTests?(
                <EndpointTests {...props} 
                    handleCancelTests={handleCancelTests}
                    operation={[operation, setOperation]}
                    operationObj={[operationObj, setOperationObj]}
                />
            ):null}
        </Dialog>
    )
}
