import React, { useState } from 'react';
import { Dialog, Classes } from "@blueprintjs/core";
import { IPathItem } from '@interfaces/Swagger';
import EndpointDetails from './endpoint_details/EndpointDetails';
import EndpointTests from './endpoint_tests/EndpointTests';

interface IProps {
    useOpen: [boolean, any]
    path: IPathItem,
    endpoint: string,
    baseURL: string,
}

export interface ITests {
    operation: string,
    art: boolean,
    abortOnFail: boolean,
    maxTests: number | undefined,
    params?: Array<ITestParam>,
    responses: number[],
}

export interface ITestParam {
    name: string,
    value: string,
    random: boolean,
    in: string,
    max?: number,
    min?: number,
    type?: string,
    required?: boolean,
}

const EndpointDetailsPanel = (props: IProps, handleRunTests: any) => (
    <EndpointDetails {...props}
        handleRunTests={handleRunTests}
    />
);

const EndpointTestsPanel = (props: IProps, handleCancelTests: any, testConfig: ITests) => (
    <EndpointTests {...props}
        handleCancelTests={handleCancelTests}
        testConfig={testConfig}
    />
);

export default function EndpointDialog(props: IProps) {
    let [isOpen, handleClose] = props.useOpen;
    let [state, setState] = useState({
        panel: EndpointDetailsPanel(props, handleRunTests),
    });

    let rehydratedDarkTheme = sessionStorage.getItem("darkTheme") === 'true' || false;

    function handleRunTests(testConfig: ITests) {
        setState({
            ...state,
            panel: EndpointTestsPanel(props, handleCancelTests, testConfig),
        });
    }

    function handleCancelTests() {
        setState({
            ...state,
            panel: EndpointDetailsPanel(props, handleRunTests),
        });
    }

    return (
        <Dialog
            icon="lab-test"
            title={`Test Endpoint "${props.endpoint}"`}
            isOpen={isOpen}
            onClose={() => handleClose()}
            className={rehydratedDarkTheme ? Classes.DARK : undefined}
            style={{ width: "600px" }}
        >
            {state.panel}
        </Dialog>
    )
}
