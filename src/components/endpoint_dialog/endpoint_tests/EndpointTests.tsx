import React, { useState } from 'react';
import { Classes, ProgressBar, Button, Callout, HTMLTable, Colors } from "@blueprintjs/core";
import { IPathItem } from '@interfaces/Swagger';
import { ITests, ITestParam, ITestResult } from '../EndpointDialog';
import levenshtein from 'js-levenshtein';
import styled from '@emotion/styled';
import AutoScroll from '@brianmcallister/react-auto-scroll';

interface IProps {
    handleCancelTests: any,
    handleFinishTests: any,
    path: IPathItem,
    endpoint: string,
    baseURL: string,
    testConfig: ITests,
}

interface ISettings {
    minNum: number
    maxNum: number
    maxArr: number
    minArr: number
    maxStr: number
    minStr: number
}

const settings: ISettings = JSON.parse(sessionStorage.getItem('settings') as string);

export default function EndpointTests(props: IProps) {
    const emptyResults: ITestResult[] = [];
    let [state, setState] = useState({
        darkTheme: sessionStorage.getItem("darkTheme") === 'true',
        testResults: emptyResults,
    });
    const StickyTH = styled.th({
        position: 'sticky',
        top: '0',
        backgroundColor: state.darkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY5,
    });

    function cancelTests() {
        props.handleCancelTests();
    }

    let completeURL = `${props.baseURL}${props.endpoint}`;

    runTests(props.testConfig, completeURL, props.testConfig.art)
        .then((res: ITestResult) => {
            let testResults = state.testResults;
            testResults.push(res);
            setState({ ...state, testResults });
            if ((!res.result && props.testConfig.abortOnFail) || state.testResults.length === props.testConfig?.maxTests) {
                props.handleFinishTests(state.testResults);
            }
        });

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
                    onClick={cancelTests}
                    text="Cancel"
                />
            </div>
            <br />
            <ProgressBar />
            <br />
            <Callout style={{ height: "250px", overflow: "scroll", padding: 0 }}>
                <AutoScroll scrollBehavior='smooth' showOption={false} height={250}>
                    <HTMLTable condensed style={{ tableLayout: "fixed", width: "100%" }}>
                        <thead>
                            <tr>
                                <StickyTH style={{ width: "15%" }}>Operation</StickyTH>
                                <StickyTH>URL</StickyTH>
                                <StickyTH style={{ width: "15%" }}>Result</StickyTH>
                            </tr>
                        </thead>
                        <tbody>
                            {state.testResults.map((testResult: ITestResult, key: number) => (
                                <tr key={key}>
                                    <td>
                                        {testResult.operation.toUpperCase()}
                                    </td>
                                    <td style={{ wordBreak: "break-all" }}>
                                        {testResult.url}
                                    </td>
                                    <td style={{
                                        color: testResult.result ? (
                                            state.darkTheme ? Colors.GREEN5 : Colors.GREEN1
                                        ) : (
                                                state.darkTheme ? Colors.RED5 : Colors.RED1
                                            )
                                    }}>
                                        {testResult.response}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </HTMLTable>
                </AutoScroll>
            </Callout>
            <br />
            <Button
                style={{ marginLeft: "auto" }}
                intent="success"
                icon="tick"
                onClick={() => props.handleFinishTests(state.testResults)}
                text="Finish"
            />
        </div>
    )
}

function runTests(testConfig: ITests, url: string, art: boolean): Promise<ITestResult> {
    let queryParams = "";

    testConfig.params?.forEach((param: ITestParam) => {
        let generatedValue = generateValue(param, art);
        switch(param.in) {
            case "query":
                if (generatedValue) {
                    queryParams += `?${param.name}=${param.value || generatedValue}`;
                }
                break;
            case "path":
              url = url.replace(`{${param.name}}`, generatedValue);
              break;
            // case "header":
            // case "formData":
            // case "body":
        }
    });

    return testEndpoint(`${url}${queryParams}`, testConfig.operation, testConfig.responses);
}

function testEndpoint(url: string, method: string, responses: number[], header?: any, formData?: any): Promise<ITestResult> {
    let proxyUrl = "https://cors-anywhere.herokuapp.com/" + url;

    return fetch(proxyUrl, {
        method,
    })
        .then(res => {
            return {
                operation: method,
                url: url,
                result: responses.includes(res.status),
                response: `${String(res.status)} ${res.statusText}`
            };
        });
}

interface keyval {
  key: string
  value: any
};

let artArray: keyval[] = [];

function generateValue(param: ITestParam, art: boolean): any {
    // If param not required, generate no value 50% of the time
    if (!param.required && (new ParamBoolean()).random()) {
        return;
    }
    // Create a parameter object
    let paramObj = ParamType.create(param);
    // Return new value
    if (art) {
        let value: any;
        let paramNameArray = artArray.filter((element: keyval) => element.key === param.name);
        if (paramNameArray.length === 0) {
            value = paramObj.random();
        } else {
            let maxDistance = 0;
            for (let i=0; i < 10; i++) {
                let candidate = paramObj.random();
                let minDistance: number = Infinity;
                paramNameArray.forEach((element: keyval) => {
                    let newDistance = paramObj.distance(element.value, candidate);
                    if (minDistance === undefined || newDistance < minDistance) {
                        minDistance = newDistance;
                    }
                });
                if (minDistance > maxDistance) {
                    value = candidate;
                    maxDistance = minDistance;
                }
            }
        }
        artArray.push({key: param.name, value});
        return value;
    } else {
        return paramObj.random();
    }
}

abstract class ParamType {
    abstract random(): any;
    abstract distance(a: any, b: any): number;

    static create(param: ITestParam): ParamType {
        switch(param.type) {
            case "number":
                return new ParamNumber(param.max, param.min);
            case "integer":
                return new ParamInteger(param.max, param.min);
            case "boolean":
                return new ParamBoolean();
            // case "array":
            //     return (new ParamArray(param.max, param.min)).random();
            // case "object":
            //     return; // !TODO
            default:
                return new ParamString(param.max, param.min);
            }
    }
}

class ParamNumber extends ParamType {
    max: number;
    min: number;

    constructor(paramMax: number|undefined, paramMin: number|undefined) {
        super();
        this.max = paramMax || settings?.maxNum || 1000000;
        this.min = paramMin || settings?.minNum || -1000000;
    }

    random(): number {
        return Math.random() * (this.max - this.min) + this.min;
    }

    distance(a: any, b: any): number {
        return Math.abs(a as number - b as number)
    }
}

class ParamInteger extends ParamNumber {
    random(): number {
        return Math.round(super.random());
    }
}

class ParamBoolean extends ParamType {
    random(): boolean {
        return Math.round(Math.random()) === 1;
    }

    distance(a: any, b: any): number {
        return a as boolean===b as boolean?0:1;
    }
}

class ParamChar extends ParamType {
    random(): string {
        return Math.random().toString(36).substr(2, 1);
    }

    distance(a: any, b: any): number {
        return levenshtein(a as string, b as string);
    }
}

class ParamString extends ParamChar {
    min: number;
    max: number;

    constructor(paramMax: number|undefined, paramMin: number|undefined) {
        super();
        this.max = paramMax || settings?.maxNum || 32;
        this.min = paramMin || settings?.minNum || 0;
    }

    random(): string {
        let randomLength = Math.round(Math.random() * (this.max - this.min) + this.min);
        let randomString = "";
        [...Array(randomLength)].forEach(() => {
            randomString += super.random();
        })
        return randomString;
    }
}
