import React, { useState } from 'react'
import { Card, Tag, H5, Intent } from "@blueprintjs/core";
import EndpointDialog from '../endpoint_dialog/EndpointDialog';
import { IOperationVerb } from '@interfaces/Swagger';

interface IProps {
    path: any,
    endpoint: string,
    baseURL: string,
    schemes: [string],
}

export const OperationIntentHashMap: { [operation in IOperationVerb]: Intent } = {
    "get": "success",
    "put": "warning",
    "post": "primary",
    "delete": "danger",
    "options": "none",
    "head": "none",
    "patch": "warning",
}

export default function EndpointCard(props: IProps) {
    let [state, setState] = useState({
        isOpen: false,
    })

    let baseURL = `${props.schemes[0]}://${props.baseURL}`;

    function handleClose() {
        setState({ ...state, isOpen: false });
    }

    return (
        <div>
            <Card interactive onClick={() => setState({ ...state, isOpen: true })}>
                <H5>
                    {props.endpoint}
                </H5>
                {Object.keys(props.path).map((operation: string, key: number) => (
                    OperationIntentHashMap[operation as IOperationVerb] ? (<span key={key}>
                        <Tag
                            intent={OperationIntentHashMap[operation as IOperationVerb]}
                        >{operation.toUpperCase()}</Tag>
                        &nbsp;
                    </span>) : null
                ))}

            </Card>
            <EndpointDialog
                useOpen={[state.isOpen, handleClose]}
                path={props.path}
                endpoint={props.endpoint}
                baseURL={baseURL}
            />
        </div>
    )
}
