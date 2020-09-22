import React from 'react';
import { Dialog } from "@blueprintjs/core";
import { IPathItem } from '@interfaces/Swagger';

interface IProps {
    handleClose: any,
    path: IPathItem,
    endpoint: string,
    baseURL: string,
}

export default function EndpointResults(props: IProps) {

return (
    <Dialog icon="tick" onClose={props.handleClose} title="Test Results">

    </Dialog>

)
}