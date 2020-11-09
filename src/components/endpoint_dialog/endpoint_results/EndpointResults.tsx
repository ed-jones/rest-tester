import React, { useState } from 'react';
import { ITestResult } from '../EndpointDialog';
import { Classes, HTMLTable, Colors, Callout, Button } from '@blueprintjs/core';
import styled from '@emotion/styled';
import AutoScroll from '@brianmcallister/react-auto-scroll';

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
            <p>
                Ran {props.results?.length} tests.
            </p>
            <br/>
            <Callout id="results" style={{ height: "250px", overflow: "scroll", padding: 0 }}>
            <AutoScroll scrollBehavior='smooth' showOption={false} height={250}>
                <HTMLTable condensed style={{tableLayout: "fixed", width:"100%"}}>
                    <thead>
                        <tr>
                            <StickyTH style={{width: "15%" }}>Operation</StickyTH>
                            <StickyTH>URL</StickyTH>
                            <StickyTH style={{ width: "20%" }}>Result</StickyTH>
                        </tr>
                    </thead>
                    <tbody>
                    {props.results
                    .map((testResult: ITestResult, key: number) => (
                        <tr key={key}>
                            <td>
                                {testResult.operation.toUpperCase()}
                            </td>
                            <td style={{wordBreak: "break-all"}}>
                                {testResult.url}
                            </td>
                            <td style={{color: testResult.result ? (
                                        state.darkTheme ? Colors.GREEN5 : Colors.GREEN1
                                    ) : (
                                            state.darkTheme ? Colors.RED5 : Colors.RED1
                                    )}}>
                                {testResult.response}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </HTMLTable>
                </AutoScroll>
            </Callout>
        </div>
    )
}
