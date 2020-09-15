import React, { useState } from 'react'
import SwaggerParser from "@apidevtools/swagger-parser";
import { InputGroup, ControlGroup, FormGroup, Button, Card, Tag } from "@blueprintjs/core";
import Swagger from '../interfaces/Swagger';
import Toaster from './Toaster';

const emptySwagger: Swagger = {
    swagger: "",
    info: {
        title: "",
        version: "",
    },
    paths: {}
};

export default function SwaggerInput() {
    let [schemaURL, setSchemaURL] = useState("https://api.apis.guru/v2/specs/apiz.ebay.com/sell-finances/1.4.0/openapi.yaml");
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
            <h2>
                {schema.info.title}
            </h2>
            {["get", "put", "post", "delete", "options", "head", "patch"].map((operation: string) => (
                Object.values(schema.paths).map((e: any, key: number) => (
                    e[operation] ? (
                        <div key={key}>
                            <Card>
                                <h3>
                                    {e[operation].operationId}
                                    &nbsp;
                                    <Tag intent="success">{operation.toUpperCase()}</Tag>
                                </h3>
                                {e[operation].description}
                                {e[operation].summary}
                            </Card>
                            <br/>
                        </div>
                    ) : null
                ))
            ))}
        </div> : null}
        </div>
    )
}
