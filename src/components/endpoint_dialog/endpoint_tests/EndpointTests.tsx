import React, { useState } from 'react';
import { Classes, ProgressBar, Button, Callout, HTMLTable, Colors } from "@blueprintjs/core";
import { IPathItem } from '@interfaces/Swagger';
import { ITests, ITestParam, ITestResult } from '../EndpointDialog';
import styled from '@emotion/styled';

interface IProps {
    handleCancelTests: any,
    handleFinishTests: any,
    path: IPathItem,
    endpoint: string,
    baseURL: string,
    testConfig: ITests,
}

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

    props.testConfig.art ? runART(props.testConfig, completeURL) : runRT(props.testConfig, completeURL)
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
                                    {testResult.result ? "Passed" : "Failed"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </HTMLTable>
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

function runRT(testConfig: ITests, url: string): Promise<ITestResult> {
    const testParams = testConfig.params;
    const globalSettings = JSON.parse(sessionStorage.getItem('settings') as string);

    let queryParams = "";
    testParams?.forEach((param: ITestParam) => {
        let generatedValue = generateValue(param, globalSettings);
        switch (param.in) {
            case "query":
                if (generatedValue !== undefined) {
                    queryParams += `?${param.name}=${param.value || generatedValue}`;
                }
                break;
            case "header":
                // TODO
                break;
            case "path":
                url = url.replace(`{${param.name}}`, generatedValue);
                break;
            case "formData":
                // TODO
                break;
            case "body":
                // TODO
                break;
        }
    });

    return testEndpoint(`${url}${queryParams}`, testConfig.operation, testConfig.responses);
}

// function runART(_testConfig: ITests, _url: string): Promise<ITestResult> {
//     const testResult: ITestResult = {
//         operation: "",
//         url: "",
//         result: false,
//     }
//     return (new Promise(() => testResult));
// }


let artArray: any[] = []; // empty array to be populated

function runART(testConfig: ITests, url: string): Promise<ITestResult> {
  const artTestParams = testConfig.params; // stores the parameters from the user
  const artGlobalSettings = JSON.parse(sessionStorage.getItem("settings") as string);   // gets the settings from the links

  let artQueryParams = ""; // empty string
  artTestParams?.forEach((param: ITestParam) => {   // loop for each test param
    let genVal = generateValue(param, artGlobalSettings);   // generates a random value based off the global settings
    
    let hash = calcHash(genVal);
    artArray.push(
        {"key": genVal, "value": hash}
    );  // push random val along with hash value to the array
    
    // compare the distance between non numeric vals
    // generate new value based off array
    let newVal = generateValue({
        ...param,
        value: String(compareHash(hash)),
    }, artGlobalSettings);

    switch (param.in) {
      case "query":
        if (newVal !== undefined) {
          artQueryParams += `?${param.name}=${param.value || newVal}`;
        }
        break;
      case "path":
        url = url.replace(`{${param.name}}`, newVal);
        break;
      case "header":
        break;
      case "formData":
        break;
      case "body":
        break;
    }
  });

  return testEndpoint(`${url}${artQueryParams}`, testConfig.operation, testConfig.responses);
}

function calcHash(value: string) {
    let hashVal = 0;
    if (value.length === 0) {
      return hashVal;
    }
    // compare parameter value to array values
    let char;
    for(let i=0; i < value.length; i++) {
        char = value.charCodeAt(i);
        hashVal = ((hashVal << 5) - hashVal) + char;
        hashVal = hashVal & hashVal;
    }

    return hashVal;
}

function compareHash(compareVal: number) {
    let currentHash = compareVal;
    let maxHash = 0;
    let index = Object.keys(artArray)[1];   // hash
    artArray.forEach(val => {
        if(currentHash >= val[index]) {
            maxHash = currentHash;
        } else {
            maxHash = val[index];
        }
    })
    return maxHash; // furthest away
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
            };
        });
}

function generateValue(param: ITestParam, valueBounds: any): any {
    if (!param.required && generateRandomBoolean()) {
        return;
    }

    let max = param.max || valueBounds?.maxNum || 1000000;
    let min = param.min || valueBounds?.minNum || -1000000;

    switch (param.type) {
        case "number":
            return generateRandomNumber(max, min);
        case "integer":
            return generateRandomInteger(max, min);
        case "boolean":
            return generateRandomBoolean();
        case "array":
            let maxArr = param.max || valueBounds?.maxArr || 10;
            let minArr = param.min || valueBounds?.minArr || 0;

            let maxStr = param.max || valueBounds?.maxStr || 32;
            let minStr = param.min || valueBounds?.minStr || 0;

            return generateRandomArray(maxArr, minArr, maxStr, minStr);
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

function generateRandomInteger(max: number, min: number): number {
    return Math.round(generateRandomNumber(max, min));
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

function generateRandomArray(maxArr: number, minArr: number, maxStr: number, minStr: number): string[] {
    let randomLength = generateRandomNumber(maxArr, minArr);
    let arr = [];
    for (let i = 0; i < randomLength; i++) {
        arr.push(generateRandomString(maxStr, minStr));
    }
    return arr;
}