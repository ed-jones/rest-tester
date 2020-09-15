import React, { useState } from 'react';
import { Dialog, ControlGroup, HTMLSelect, InputGroup, Classes, Callout, HTMLTable, Icon } from "@blueprintjs/core";
import { path_item } from '../interfaces/Swagger';

interface IProps {
    useOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    path: path_item,
    endpoint: string,
}

export default function EndpointDialog(props: IProps) {
    let [isOpen, setOpen] = props.useOpen;
    let [selected, setSelected] = useState(Object.keys(props.path)[0]);
    let rehydratedDarkTheme = sessionStorage.getItem("darkTheme")==='true' || false;
    return (
        <Dialog
            icon="lab-test"
            title={`Test Endpoint "${props.endpoint}"`}
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            className={rehydratedDarkTheme?Classes.DARK:undefined}
        >
            <div className={Classes.DIALOG_BODY}>
                <ControlGroup>
                    <HTMLSelect onChange={(e: any) => setSelected(e.target.value)}>
                        {Object.keys(props.path).map((operation: any, key: number) => (
                            <option key={key} value={operation}>{operation.toUpperCase()}</option>
                        ))}
                    </HTMLSelect>
                    <InputGroup fill type="text" value={props.endpoint}/>
                </ControlGroup>
                {Object.values(props.path).map((path: any, index: number) => (
                    Object.keys(props.path)[index] === selected)?(
                        <div>
                            <h3>Description</h3>
                            <Callout>{path.description?path.description:"No description"}</Callout>
                            {path.parameters?(<>
                                <h3>Parameters</h3>
                                <Callout>
                                    <HTMLTable style={{width:"100%"}}>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <td>Description</td>
                                                <td>Type</td>
                                                <td>Required</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(path.parameters).map((param: any, index: number) => (
                                                <tr key={index}>
                                                    <td>{param.name}</td>
                                                    <td>{param.description}</td>
                                                    <td>{param.type}</td>
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
                                        {Object.values(path.responses).map((response: any, index: number) => (
                                            <tr key={index}>
                                                <td>{Object.keys(path.responses)[index]}</td>
                                                <td>{response.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </HTMLTable>
                            </Callout>
                        </div>
                    ) : undefined
                )}
            </div>
        </Dialog>
    )
}
