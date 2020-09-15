import React, { useState } from 'react'
import { Card, Tag, H5, Intent } from "@blueprintjs/core";
import EndpointDialog from './EndpointDialog';

interface IProps {
    path: any,
    endpoint: string,
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

    function openDialog() {
        console.log("open dialog");
        setOpen(true);
    }

    return (
        <div>
            <Card interactive onClick={openDialog}>
                <H5>
                    {props.endpoint}
                </H5>
                {Object.keys(props.path).map((operation: any) => (
                    operationHash[operation]?(<>
                        <Tag 
                            intent={operationHash[operation]}
                        >{operation.toUpperCase()}</Tag>
                        &nbsp;
                    </>):null
                ))}

            </Card>
            <EndpointDialog useOpen={[isOpen, setOpen]} path={props.path} endpoint={props.endpoint}/>

        </div>

    )
}
