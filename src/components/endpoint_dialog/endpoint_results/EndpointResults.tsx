import React, { useState } from 'react';
import { ITestResult } from '../EndpointDialog';
import { Classes, HTMLTable, Colors, Callout, Button } from '@blueprintjs/core';
import styled from '@emotion/styled';

interface IProps {
    results: ITestResult[],
    handleCancelTests: any,
}

export default function EndpointResults(props: IProps) {
    let [state] = useState({
        darkTheme: sessionStorage.getItem("darkTheme") === 'true',
    });
    const StickyTH = styled.th({
        position: 'sticky',
        top: '0',
        backgroundColor: state.darkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY5,
    });

    return (
        <div className={Classes.DIALOG_BODY}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>
                    Test Results
                </h3>
                <Button
                    style={{ marginLeft: "auto" }}
                    intent="primary"
                    icon="tick"
                    onClick={props.handleCancelTests}
                    text="Done"
                />
            </div>
            Ran {props.results?.length} tests.
            <p>
            The following tests failed:
            </p>
            <Callout style={{ height: "250px", overflow: "scroll", padding: 0 }}>
                <HTMLTable condensed style={{tableLayout: "fixed", width:"100%"}}>
                    <thead>
                        <tr>
                            <StickyTH style={{width:"20%"}}>Operation</StickyTH>
                            <StickyTH>URL</StickyTH>
                        </tr>
                    </thead>
                    <tbody >
                    {props.results.filter((result) => !result.result)
                    .map((testResult: ITestResult, key: number) => (
                        <tr key={key}>
                            <td>
                                {testResult.operation.toUpperCase()}
                            </td>
                            <td style={{wordBreak: "break-all"}}>
                                {testResult.url}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </HTMLTable>
            </Callout>
        </div>
    )
}
