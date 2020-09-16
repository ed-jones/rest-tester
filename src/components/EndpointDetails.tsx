import React from 'react'
import { ControlGroup, HTMLSelect, InputGroup, Classes, Callout, HTMLTable, Icon, Button } from "@blueprintjs/core";
import { path_item, operation } from '../interfaces/Swagger';

interface IProps {
    path: path_item,
    endpoint: string,
    handleRunTests: any,
    baseURL: string,
    operation: [string, any],
    operationObj: [operation, any],
}

export default function EndpointDetails(props: IProps) {
    let [operation, setOperation] = props.operation;
    let [operationObj, setOperationObj] = props.operationObj;
    let completeURL = `${props.baseURL}${props.endpoint}`;

    function handleOperationChange(newOperation: string) {
        setOperation(newOperation);
        Object.values(props.path).map((selectedOperation: operation, i: number) => (
            Object.keys(props.path)[i] === newOperation?(
                setOperationObj(selectedOperation)
            ):undefined
        ));
    }

    return (
        <div className={Classes.DIALOG_BODY}>
            <ControlGroup>
                <HTMLSelect onChange={(e: any) => handleOperationChange(e.target.value)}>
                    {Object.keys(props.path).map((operation: any, key: number) => (
                        <option key={key} value={operation}>{operation.toUpperCase()}</option>
                    ))}
                </HTMLSelect>
                <InputGroup fill type="text" value={completeURL}/>
                <Button 
                    intent="primary" 
                    icon="play" 
                    onClick={() => props.handleRunTests(operation)}
                >
                    Run Tests
                </Button>
            </ControlGroup>
            <div>
                <h3>Description</h3>
                <Callout>{operationObj.description?operationObj.description:"No description"}</Callout>
                {operationObj.parameters?(<>
                    <h3>Parameters</h3>
                    <Callout>
                        <HTMLTable style={{width:"100%"}}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <td>Description</td>
                                    <td>Type</td>
                                    <td>In</td>
                                    <td>Required</td>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(operationObj.parameters).map((param: any, index: number) => (
                                    <tr key={index}>
                                        <td>{param.name}</td>
                                        <td>{param.description}</td>
                                        <td>{param.type}</td>
                                        <td>{param.in}</td>
                                        <td style={{textAlign:'center'}}>
                                            <Icon icon={param.required?"tick":"cross"}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </HTMLTable>
                    </Callout>
                </>):null}
                <h3>Responses</h3>
                <Callout>
                    <HTMLTable style={{width:"100%"}}>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <td>Description</td>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(operationObj.responses).map((response: any, index: number) => (
                                <tr key={index}>
                                    <td>{Object.keys(operationObj.responses)[index]}</td>
                                    <td>{response.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </HTMLTable>
                </Callout>
            </div>
        </div>
    )
}
