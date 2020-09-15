import React from 'react';
import { Dialog, ControlGroup, HTMLSelect, InputGroup } from "@blueprintjs/core";
import { path_item } from '../interfaces/Swagger';
import { Container } from 'react-grid-system';

interface IProps {
    useOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    path: path_item,
    endpoint: string,
}

export default function EndpointDialog(props: IProps) {
    let [isOpen, setOpen] = props.useOpen;
    return (
        <Dialog
            icon="lab-test"
            title={`Test ${props.endpoint}`}
            isOpen={isOpen}
            onClose={() => setOpen(false)}
        >
            <Container>
                <br/>
                <ControlGroup>
                    <HTMLSelect>
                        {Object.keys(props.path).map((operation: any) => (
                            <option value={operation}>{operation.toUpperCase()}</option>
                        ))}
                    </HTMLSelect>
                    <InputGroup fill type="text" value={props.endpoint}/>
                </ControlGroup>
            </Container>
        </Dialog>
    )
}
