import React from 'react';
import { Classes, ProgressBar, Button, Callout } from "@blueprintjs/core";
import { IPathItem } from '@interfaces/Swagger';
import { ITests, ITestParam } from '../EndpointDialog';

interface IProps {
    handleCancelTests: any,
    path: IPathItem,
    endpoint: string,
    baseURL: string,
    testConfig: ITests,
}

export default function EndpointTests(props: IProps) {
    let completeURL = `${props.baseURL}${props.endpoint}`;

    runTests(props.testConfig, completeURL);

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
                    {/* {[...Array(10)].map((value: number, key: number) => (
                        <li key={key}>
                            {operationName} {completeURL}
                            {parameters?.map((param) => (
                                param.in === "query" ? (
                                    `?${param.name}=${generateParam(param)}`
                                ) : undefined
                            ))}
                        </li>
                    ))} */}
                </ul>
            </Callout>
        </div>
    )
}

function runTests(testConfig: ITests, completeURL: string, depth: number = 0) {
    if (depth === testConfig?.maxTests) {
        return;
    }

    testConfig.art?runART(testConfig, completeURL):runRT(testConfig, completeURL)
    .then((res) => {
        if (res) {
            runTests(testConfig, completeURL, depth+1);
        }
    })
    
}

function runRT(testConfig: ITests, url: string): Promise<boolean> {
    const testParams = testConfig.params;
    const globalSettings = JSON.parse(sessionStorage.getItem('settings') as string);
    
    let queryParams = "";
    testParams?.forEach((param: ITestParam) => {
        let generatedValue = generateValue(param, globalSettings);
        switch(param.in) {
            case "query":
                if (generatedValue !== undefined) {
                    queryParams += `?${param.name}=${param.value||generatedValue}`;
                }
                break;
            case "header":
                break;
            case "path":
                url = url.replace(`{${param.name}}`, generatedValue);
                break;
            case "formData":
                break;
            case "body":
                break;
        }
    })
    
    return testEndpoint(`${url}${queryParams}`, testConfig.responses);
}

function runART(_testConfig: ITests, _url: string): Promise<boolean> {
    return (new Promise(() => false));
}

function testEndpoint(url: string, responses: (number|"default")[], header?: any, formData?: any): Promise<boolean>  {
    url = "https://cors-anywhere.herokuapp.com/" + url;
    console.log(`Testing ${url}`)

    return fetch(url)
    .then(res => {
        let ret = responses.includes(res.status);
        console.log(ret?"Test Passed":"Test Failed");
        return ret
    });
}

function generateValue(param: any, valueBounds: any): any {
    if (!param.required && generateRandomBoolean()) {
        return;
    }

    let max = param.max || valueBounds?.maxNum || 1000000;
    let min = param.min || valueBounds?.minNum || -1000000;

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
            max = param.max || valueBounds?.maxStr || 32;
            min = param.min || valueBounds?.minStr || 0;
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