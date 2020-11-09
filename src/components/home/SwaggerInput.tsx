import React, { useState } from 'react'
import SwaggerParser from "@apidevtools/swagger-parser";
import { InputGroup, ControlGroup, FormGroup, Button, H3 } from "@blueprintjs/core";
import ISwagger from '@interfaces/Swagger';
import Toaster from '../global/Toaster';
import EndpointCard from './EndpointCard';

export default function SwaggerInput() {
    let defaultSchema: ISwagger|undefined;
    let [state, setState] = useState({
        schemaURL: "https://api.apis.guru/v2/specs/bbc.co.uk/1.0.0/swagger.yaml",
        schema: defaultSchema,
        error: false,
        loading: false,
    });
    function handleSubmit(event: any) {
        event.preventDefault();
        setState({ ...state, loading: true, schema: undefined });
        SwaggerParser.validate(state.schemaURL)
            .then(e => {
                Toaster.show({
                    message: "Successfully Loaded API",
                    intent: "success",
                    icon: "tick-circle"
                });
                setState({ ...state, error: false, loading: false, schema: e });
            })
            .catch(e => {
                Toaster.show({
                    message: e.message,
                    intent: "danger",
                    icon: "error",
                    onDismiss: () => setState({ ...state, error: false }),
                });
                setState({ ...state, error: true, loading: false });
            });
    }

    function handleChange(event: any) {
        setState({ ...state, schemaURL: event.target.value });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FormGroup label="Input URL for Swagger 2.0 or OpenAPI 3.0 Schema">
                    <ControlGroup>
                        <InputGroup
                            type="text"
                            placeholder="http://example.com/swagger.yaml"
                            value={state.schemaURL}
                            onChange={handleChange}
                            fill
                        />
                        <Button
                            intent="primary"
                            loading={state.loading}
                            text="Load API"
                            type="submit"
                        />
                    </ControlGroup>
                </FormGroup>
            </form>
            {state.schema !== undefined ? (
                <div>
                    <H3>
                        {(state.schema as ISwagger).info.title}
                    </H3>
                    {Object.values((state.schema as ISwagger).paths).map((path: any, index: number) => (
                        <div key={index}>
                            <EndpointCard
                                schemes={(state.schema as ISwagger).schemes || [(new URL(state.schemaURL)).protocol]}
                                baseURL={(state.schema as ISwagger).host || (new URL(state.schemaURL)).hostname}
                                path={path}
                                endpoint={Object.keys((state.schema as ISwagger).paths)[index]}
                            />
                            <br />
                        </div>
                    ))}
                </div> ): null}
        </div>
    )
}
