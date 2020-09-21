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

export interface ITests {
    operation: string,
    art: boolean,
    abortOnFail: boolean,
    maxTests: number|undefined,
    params?: Array<{
        name: string,
        value: string,
        random: boolean,
        in: string,
        max?: number,
        min?: number,
        type?: string,
        required?: boolean,
    }>,
    responses: number[],
}

export default function EndpointDialog(props: IProps) {
    let [isOpen, setOpen] = props.useOpen;
    let [state, setState] = useState({
        panel: <EndpointDetails {...props} 
                    handleRunTests={handleRunTests} 
                />,
    });

    let rehydratedDarkTheme = sessionStorage.getItem("darkTheme")==='true' || false;

    function handleRunTests(testConfig: ITests) {
        setState({...state, 
            panel: <EndpointTests {...props} 
                        handleCancelTests={handleCancelTests} 
                        testConfig={testConfig}
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
