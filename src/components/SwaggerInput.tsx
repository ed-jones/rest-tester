import React, { useState } from 'react'
import SwaggerParser from "@apidevtools/swagger-parser";
import { InputGroup, ControlGroup, FormGroup, Button, Card, Tag, H3, H5, Intent } from "@blueprintjs/core";
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

interface IOperationHash {
    [operation: string]: Intent,
}

const operationHash: IOperationHash = {
    "get": "success",
    "put": "warning",
    "post": "primary",
    "delete": "danger",
    "options": "none",
    "head": "none",
    "patch": "warning",
}

export default function SwaggerInput() {
    let [schemaURL, setSchemaURL] = useState("https://api.apis.guru/v2/specs/getsandbox.com/v1/swagger.yaml");
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
                            <Card>
                                <H5>
                                    {Object.keys(schema.paths)[index]}
                                    &nbsp;
                                    {Object.keys(path).map((operation: any) => (
                                        operationHash[operation]?(<>
                                            <Tag intent={operationHash[operation]}>{operation.toUpperCase()}</Tag>
                                            &nbsp;
                                        </>):null
                                    ))}
                                </H5>
                                {Object.values(path).map((operation: any) => (
                                    <div>
                                        {operation.description}
                                    </div>
                                ))}
                            </Card>
                            <br/>
                        </div>
                    ))}
            </div> : null}
        </div>
    )
}
