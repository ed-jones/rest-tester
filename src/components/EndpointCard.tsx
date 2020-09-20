import React, { useState } from 'react'
import { Card, Tag, H5, Intent } from "@blueprintjs/core";
import EndpointDialog from './EndpointDialog';

interface IProps {
    path: any,
    endpoint: string,
    baseURL: string,
    schemes: [string],
}

interface IOperationHash {
    [operation: string]: Intent,
}

export const operationHash: IOperationHash = {
    "get": "success",
    "put": "warning",
    "post": "primary",
    "delete": "danger",
    "options": "none",
    "head": "none",
    "patch": "warning",
}

export default function EndpointCard(props: IProps) {
    let [isOpen, setOpen] = useState(false);
    let baseURL = `${props.schemes[0]}://${props.baseURL}`;

    return (
        <div>
            <Card interactive onClick={() => setOpen(true)}>
                <H5>
                    {props.endpoint}
                </H5>
                {Object.keys(props.path).map((operation: string, key: number) => (
                    operationHash[operation]?(<span key={key}>
                        <Tag 
                            intent={operationHash[operation]}
                        >{operation.toUpperCase()}</Tag>
                        &nbsp;
                    </span>):null
                ))}

            </Card>
            <EndpointDialog 
                useOpen={[isOpen, setOpen]} 
                path={props.path} 
                endpoint={props.endpoint}
                baseURL={baseURL}
            />

        </div>

    )
}
