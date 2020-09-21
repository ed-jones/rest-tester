import React from 'react';
import { Classes, ProgressBar, Button, Callout } from "@blueprintjs/core";
import { path_item, parameter, reference } from '../interfaces/Swagger';

interface IProps {
    handleCancelTests: any,
    path: path_item,
    endpoint: string,
    baseURL: string,
    operation: [string, any]
}

export default function EndpointTests(props: IProps) {
    let completeURL = `${props.baseURL}${props.endpoint}`;
    let testParameters = JSON.parse(sessionStorage.getItem('settings') as string);
    let [operationName, operationObj] = props.operation;
    operationName = operationName.toUpperCase();

    function generateParam(param: parameter) {
        if (!param.required && generateRandomBoolean()) {
            return "";
        }

        let max = param.max||testParameters?.maxNum||1000000;
        let min = param.min||testParameters?.minNum||-1000000;

        switch(param.type) {
            case "number":
                return generateRandomNumber(max, min);
            case "integer":
                return Math.round(generateRandomNumber(max, min));
            case "boolean":
                return generateRandomBoolean();
            case "array":
                return; // !TODO
            case "object":
                return; // !TODO
            default:
                max = param.max||testParameters?.maxStr||32;
                min = param.min||testParameters?.minStr||0;
                return generateRandomString(max, min);
        }
    }

    function generateRandomBoolean(): boolean {
        return Math.round(Math.random())===1;
    }

    function generateRandomNumber(max: number, min: number): number {
        return Math.random() * (max - min) + min;
    }

    function generateRandomString(max: number, min: number): string {
        let randomLength = generateRandomNumber(max, min);
        let randomString = "";
        [...Array(Math.round(randomLength))].forEach(() => {
            randomString += generateRandomChar();
        })
        return randomString;
    }

    function generateRandomChar(): string {
        return Math.random().toString(36).substr(2, 1);
    }

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
                    {[...Array(10)].map(() => (
                        <li>
                        {operationName} {completeURL}
                        {operationObj.parameters?.map((param: parameter|reference) => (
                            (param as parameter).in==="query"?(
                                `?${(param as parameter).name}=${generateParam(param as parameter)}`
                            ):undefined
                        ))}
                        </li>
                    ))}
                </ul>
            </Callout>
        </div>
    )
}
