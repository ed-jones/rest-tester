import React, { useState } from 'react'
import SwaggerParser from "@apidevtools/swagger-parser";
import { InputGroup, ControlGroup, FormGroup, Button, H3 } from "@blueprintjs/core";
import Swagger from '../interfaces/Swagger';
import Toaster from './Toaster';
import EndpointCard from './EndpointCard';

const emptySwagger: Swagger = {
    swagger: "",
    info: {
        title: "",
        version: "",
    },
    paths: {}
};

export default function SwaggerInput() {
    let [state, setState] = useState({
        schemaURL: "https://api.apis.guru/v2/specs/bbc.co.uk/1.0.0/swagger.yaml",
        schema: emptySwagger,
        error: false,
        loading: false,
    });
    function handleSubmit(event: any) {
        event.preventDefault();
        setState({...state, loading: true, schema: emptySwagger});
        SwaggerParser.validate(state.schemaURL)
        .then(e => {
            Toaster.show({
                message: "Successfully Validated", 
                intent: "success", 
                icon: "tick-circle"
            });
            setState({...state, error: false, loading: false, schema: e});
        })
        .catch(e => {
            Toaster.show({
                message: e.message, 
                intent: "danger", 
                icon: "error", 
                onDismiss: () => setState({...state, error: false}),
            });
            setState({...state, error: true, loading: false});
        });
    }

    function handleChange(event: any) {
        setState({...state, schema: event.target.value});
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
                            intent={state.error?"danger":state.schema !== emptySwagger?"success":"none"}
                        />
                        <Button 
                            intent="success"
                            loading={state.loading}
                            text="Validate"
                            icon="tick"
                            type="submit"
                        />
                    </ControlGroup>
                </FormGroup>
            </form>
            {state.schema !== emptySwagger ? 
            <div>
                <H3>
                    {state.schema.info.title}
                </H3>
                    {Object.values(state.schema.paths).map((path: any, index: number) => (
                        <div key={index}>
                            <EndpointCard 
                                schemes={state.schema.schemes||[(new URL(state.schemaURL)).protocol]}
                                baseURL={state.schema.host||(new URL(state.schemaURL)).hostname} 
                                path={path} 
                                endpoint={Object.keys(state.schema.paths)[index]}
                            />
                            <br/>
                        </div>
                    ))}
            </div> : null}
        </div>
    )
}
