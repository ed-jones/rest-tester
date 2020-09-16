import React from 'react';
import { Classes, ProgressBar, Button, Callout } from "@blueprintjs/core";
import { path_item, operation, parameter, reference } from '../interfaces/Swagger';

interface IProps {
    handleCancelTests: any,
    path: path_item,
    endpoint: string,
    baseURL: string,
    operation: [string, any],
    operationObj: [operation, any],
}

export default function EndpointTests(props: IProps) {
    let completeURL = `${props.baseURL}${props.endpoint}`;
    let [operation] = props.operation;
    let [operationObj] = props.operationObj;
    operation = operation.toUpperCase();

    return (
        <div className={Classes.DIALOG_BODY}>
            <div style={{display:"flex", alignItems:"center"}}>
                <h3 style={{margin:0}}>
                    Running Tests...
                </h3>
                <Button 
                    style={{marginLeft:"auto"}} 
                    intent="danger" 
                    icon="delete"
                    onClick={props.handleCancelTests}
                    text="Cancel"
                />
            </div>
            <br/>
            <ProgressBar/>
            <br/>
            <Callout style={{height:"250px", overflowY: "scroll"}}>
                <ul style={{listStyle:"none", padding:0, margin:0}}>
                    <li>
                    {operation} {completeURL} 
                    {operationObj.parameters?.map((param: parameter|reference) => (
                        (param as parameter).in==="query"?(
                            ` ${(param as parameter).name} `
                        ):undefined
                    ))}
                    </li>
                </ul>
            </Callout>
        </div>
    )
}
