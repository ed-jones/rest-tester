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

export default function EndpointDialog(props: IProps) {
    let [isOpen, setOpen] = props.useOpen;
    let [state, setState] = useState({
        panel: <EndpointDetails {...props} 
                    handleRunTests={handleRunTests} 
                />,
    });

    let rehydratedDarkTheme = sessionStorage.getItem("darkTheme")==='true' || false;

    function handleRunTests(operation: [string, any]) {
        setState({...state, 
            panel: <EndpointTests {...props} 
                        handleCancelTests={handleCancelTests} 
                        operation={operation}
                    />
        });
    }

    function handleCancelTests() {
        setState({...state, 
            panel: <EndpointDetails {...props} 
                        handleRunTests={handleRunTests} 
                    />
        });
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
            {state.panel}
        </Dialog>
    )
}
