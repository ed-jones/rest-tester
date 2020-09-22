import React from 'react';
import { Classes, ProgressBar, Button, Callout } from "@blueprintjs/core";
import { IPathItem } from '@interfaces/Swagger';
import { ITests } from '../EndpointDialog';

interface IProps {
    handleCancelTests: any,
    path: IPathItem,
    endpoint: string,
    baseURL: string,
    testConfig: ITests,
}

export default function EndpointTests(props: IProps) {
    let completeURL = `${props.baseURL}${props.endpoint}`;
    let globalTestConfig = JSON.parse(sessionStorage.getItem('settings') as string);
    let operationName = props.testConfig.operation;
    let parameters = props.testConfig.params;
    operationName = operationName.toUpperCase();

    function generateParam(param: any) {
        if (!param.required && generateRandomBoolean()) {
            return "";
        }

        let max = param.max || globalTestConfig?.maxNum || 1000000;
        let min = param.min || globalTestConfig?.minNum || -1000000;

        switch (param.type) {
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
                max = param.max || globalTestConfig?.maxStr || 32;
                min = param.min || globalTestConfig?.minStr || 0;
                return generateRandomString(max, min);
        }
    }

    function generateRandomBoolean(): boolean {
        return Math.round(Math.random()) === 1;
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
            <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>
                    Running Tests...
                </h3>
                <Button
                    style={{ marginLeft: "auto" }}
                    intent="danger"
                    icon="delete"
                    onClick={props.handleCancelTests}
                    text="Cancel"
                />
            </div>
            <br />
            <ProgressBar />
            <br />
            <Callout style={{ height: "250px", overflowY: "scroll" }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {[...Array(10)].map(() => (
                        <li>
                            {operationName} {completeURL}
                            {parameters?.map((param) => (
                                param.in === "query" ? (
                                    `?${param.name}=${generateParam(param)}`
                                ) : undefined
                            ))}
                        </li>
                    ))}
                </ul>
            </Callout>
        </div>
    )
}
