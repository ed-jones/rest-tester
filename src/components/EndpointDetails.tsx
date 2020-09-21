import React from 'react'
import { ControlGroup, InputGroup, Classes, Callout, HTMLTable, Switch, Button, Tabs, Tab, TagInput, Tag, Intent, Card } from "@blueprintjs/core";
import { path_item, operation, parameter, paths } from '../interfaces/Swagger';
import { operationHash } from './EndpointCard';

interface EndpointDetailsProps {
    path: path_item,
    endpoint: string,
    handleRunTests: any,
    baseURL: string,
}

export default function EndpointDetails(props: EndpointDetailsProps) {
    let completeURL = `${props.baseURL}${props.endpoint}`;
    return (
        <div className={Classes.DIALOG_BODY}>
            <Tabs animate defaultSelectedTabId={0}>
                {Object.keys(props.path).map((operationName: string, key: number) => (
                    <Tab id={key} key={key} title={operationName.toUpperCase()} panelClassName={Classes.FILL} panel={
                        <Card>
                        <EndpointDetail 
                            operation={[operationName, Object.values(props.path)[key]]}
                            completeURL={completeURL}
                            handleRunTests={props.handleRunTests}
                        />
                        </Card>
                    }/>
                ))}
            </Tabs>
        </div>
    )
}

interface EndpointDetailProps {
    operation: [string, any],
    completeURL: string,
    handleRunTests: any
}

export function EndpointDetail(props: EndpointDetailProps) {
    let [operationName, operationObj] = props.operation;
    let paramHash: {[param: string]: string} = {
        "query": "Query",
        "header": "Header",
        "path": "Path",
        "formData": "Form Data",
        "body": "Body",
    };
 
    Array.from(document.getElementsByClassName(Classes.TAB_PANEL)).map((panel: any) => (
        panel.setAttribute("style", "width:100%")
    ));

    return (
        <div>
            <h3>
                {operationObj.summary?operationObj.summary:"Endpoint"}
            </h3>
            <ControlGroup>
                <Button intent={operationHash[operationName]}>
                    {operationName.toUpperCase()}
                </Button>
                <InputGroup fill type="text" value={props.completeURL}/>
                <Button 
                    intent="primary" 
                    icon="play" 
                    onClick={() => props.handleRunTests(props.operation)}
                >
                    Run Tests
                </Button>
            </ControlGroup>
            <div>
                <h3>Description</h3>
                <Callout>{operationObj.description?operationObj.description:"No description"}</Callout>
                {operationObj.parameters?(
                <>
                <h3>Parameters</h3>
                <Tabs vertical>
                    {["query", "header", "path", "formData", "body"].map((paramType: string, index: number) => {
                        let params = Object.values(operationObj.parameters as [parameter])
                                        .filter((param: parameter) => param.in === paramType);
                        return params.length === 0?null:(
                        <Tab id={index} key={index} title={paramHash[paramType]} panel={
                            <Callout>
                                <HTMLTable style={{width:"100%"}}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <td>Value</td>
                                            <td>Random</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(params).map((param: parameter, index: number) => (
                                            <tr key={index}>
                                                <td>{param.name}</td>
                                                <td>
                                                    <InputGroup type="text" placeholder="Value" disabled/>
                                                </td>
                                                <td style={{textAlign:'center'}}>
                                                    <Switch defaultChecked/>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </HTMLTable>
                            </Callout>
                        }/>)
                    })}
                </Tabs>
                </>
                ):null}
                <h3>Responses</h3>
                <TagInput values={
                    Object.values(operationObj.responses).map((response: any, index: number) => {
                        let tagName = Number(Object.keys(operationObj.responses)[index]);
                        let intent: Intent = "none";
                        switch(true) {
                            case (tagName < 200): intent="primary";
                            break;
                            case (tagName < 300): intent="success";
                            break;
                            case (tagName < 400): intent="warning";
                            break;
                            default: intent="danger";
                        }
                        return (
                            <Tag intent={intent}>
                                {tagName}
                            </Tag>
                        )
                    })
                }/>
            </div>
        </div>
    )
}
