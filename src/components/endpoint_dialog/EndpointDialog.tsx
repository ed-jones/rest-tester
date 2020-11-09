import React, { useState } from 'react';
import { Dialog, Classes } from "@blueprintjs/core";
import { IPathItem } from '@interfaces/Swagger';
import EndpointDetails from './endpoint_details/EndpointDetails';
import EndpointTests from './endpoint_tests/EndpointTests';
import EndpointResults from './endpoint_results/EndpointResults';

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
    maxTests?: number,
    params?: Array<ITestParam>,
    responses: (number)[],
}

export interface ITestParam {
    name: string,
    value?: string,
    random: boolean,
    in: string,
    max?: number,
    min?: number,
    type?: string,
    required?: boolean,
}

export interface ITestResult {
    operation: string,
    url: string,
    result: boolean,
}

const EndpointDetailsPanel = (props: IProps, handleRunTests: any) => (
    <EndpointDetails {...props}
        handleRunTests={handleRunTests}
    />
);

const EndpointTestsPanel = (props: IProps, handleCancelTests: any, handleFinishTests: any, testConfig: ITests) => (
    <EndpointTests {...props}
        handleCancelTests={handleCancelTests}
        handleFinishTests={handleFinishTests}
        testConfig={testConfig}
    />
);

const EndpointResultsPanel = (results: ITestResult[], handleCancelTests: any) => (
    <EndpointResults
        results={results}
        handleCancelTests={handleCancelTests}
    />
);

export default function EndpointDialog(props: IProps) {
    let [isOpen, handleClose] = props.useOpen;
    let [state, setState] = useState({
        panel: EndpointDetailsPanel(props, handleRunTests),
    });

    let rehydratedDarkTheme = sessionStorage.getItem("darkTheme") === 'true';

    function handleRunTests(testConfig: ITests) {
        setState({
            ...state,
            panel: EndpointTestsPanel(props, handleCancelTests, handleFinishTests, testConfig),
        });
    }

    function handleCancelTests() {
        setState({
            ...state,
            panel: EndpointDetailsPanel(props, handleRunTests),
        });
    }

    function handleFinishTests(results: ITestResult[]) {
        setState({
            ...state,
            panel: EndpointResultsPanel(results, handleCancelTests),
        });
    }

    function handleHandleClose() {
        handleCancelTests();
        handleClose();
    }

    return (
        <Dialog
            icon="lab-test"
            title={`Test Endpoint "${props.endpoint}"`}
            isOpen={isOpen}
            onClose={() => handleHandleClose()}
            className={rehydratedDarkTheme ? Classes.DARK : undefined}
            style={{ width: "600px" }}
        >
            {state.panel}
        </Dialog>
    )
}
