import React from 'react'
import { ControlGroup, InputGroup, Classes, Callout, HTMLTable, Switch, Button, Tabs, Tab, TagInput, Tag, Intent } from "@blueprintjs/core";
import { path_item, operation, parameter } from '../interfaces/Swagger';
import { operationHash } from './EndpointCard';

interface IProps {
    path: path_item,
    endpoint: string,
    handleRunTests: any,
    baseURL: string,
    operation: [string, any],
    operationObj: [operation, any],
}

export default function EndpointDetails(props: IProps) {
    return (
        <div className={Classes.DIALOG_BODY}>
            <Tabs animate defaultSelectedTabId={0}>
                {Object.keys(props.path).map((operation: any, key: number) => (
                    <Tab id={key} key={key} title={operation.toUpperCase()} panelClassName={Classes.FILL} panel={
                        <EndpointDetail {...props} selectedOperation={operation}/>
                    }/>
                ))}
            </Tabs>
        </div>
    )
}

interface newIProps extends IProps {
    selectedOperation: string,
}

export function EndpointDetail(props: newIProps) {
    let selectedOperation = props.selectedOperation;
    let [operationObj, setOperationObj] = props.operationObj;
    let completeURL = `${props.baseURL}${props.endpoint}`;

    return (
        <div>
            <ControlGroup>
                <Button intent={operationHash[selectedOperation]}>
                    {props.selectedOperation.toUpperCase()}
                </Button>
                <InputGroup fill type="text" value={completeURL}/>
                <Button 
                    intent="primary" 
                    icon="play" 
                    onClick={() => props.handleRunTests(selectedOperation)}
                >
                    Run Tests
                </Button>
            </ControlGroup>
            <div>
                <h3>Description</h3>
                <br/>
                <Callout>{operationObj.description?operationObj.description:"No description"}</Callout>
                <br/>
                <h3>Parameters</h3>
                <Tabs vertical>
                    {["query", "header", "path", "formData", "body"].map((paramType: string, index: number) => (
                        <Tab id={index} key={index} title={paramType} panel={
                        <Callout>
                            <HTMLTable className={Classes.FILL}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <td>Value</td>
                                        <td>Random</td>
                                    </tr>
                                </thead>
                                <tbody>
                            {
                                operationObj.parameters as [parameter]?(
                                Object.values((operationObj.parameters as [parameter]).map((param: parameter, index: number) => (
                                    param.in as string === paramType?(
                                            <tr key={index}>
                                                <td>{param.name}</td>
                                                <td>
                                                    <InputGroup type="text" placeholder="Value" disabled/>
                                                </td>
                                                <td style={{textAlign:'center'}}>
                                                    <Switch defaultChecked/>
                                                </td>
                                            </tr>

                                    ):null
                                )))
                            ):null}
                                </tbody>
                            </HTMLTable>
                        </Callout>
                        }/>
                    ))}
                </Tabs>
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
