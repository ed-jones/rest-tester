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
    let [schemaURL, setSchemaURL] = useState("https://api.apis.guru/v2/specs/bbc.co.uk/1.0.0/swagger.yaml");
    let [schema, setSchema] = useState(emptySwagger);
    let [error, setError] = useState(false);
    let [loading, setLoading] = useState(false);

    function handleSubmit(event: any) {
        event.preventDefault();
        setLoading(true);
        setSchema(emptySwagger);
        SwaggerParser.validate(schemaURL)
        .then(e => {
            Toaster.show({message: "Successfully Validated", intent: "success", icon: "tick-circle"});
            setSchema(e);
            console.log(e);
            setError(false);
            setLoading(false);
        })
        .catch(e => {
            Toaster.show({message: e.message, intent: "danger", icon: "error", onDismiss: () => setError(false)});
            setError(true);
            setLoading(false);
        });
    }

    function handleChange(event: any) {
        setSchemaURL(event.target.value);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FormGroup label="Input URL for Swagger 2.0 or OpenAPI 3.0 Schema">
                    <ControlGroup>
                        <InputGroup 
                            type="text"
                            placeholder="http://example.com/swagger.yaml"
                            value={schemaURL}
                            onChange={handleChange}
                            fill
                            intent={error?"danger":schema !== emptySwagger?"success":"none"}
                        />
                        <Button 
                            intent="success"
                            loading={loading}
                            text="Validate"
                            icon="tick"
                            type="submit"
                        />
                    </ControlGroup>
                </FormGroup>
            </form>
            {schema !== emptySwagger ? 
            <div>
                <H3>
                    {schema.info.title}
                </H3>
                    {Object.values(schema.paths).map((path: any, index: number) => (
                        <div key={index}>
                            <EndpointCard 
                                schemes={schema.schemes||[(new URL(schemaURL)).protocol]}
                                baseURL={schema.host||(new URL(schemaURL)).hostname} 
                                path={path} 
                                endpoint={Object.keys(schema.paths)[index]}
                            />
                            <br/>
                        </div>
                    ))}
            </div> : null}
        </div>
    )
}
