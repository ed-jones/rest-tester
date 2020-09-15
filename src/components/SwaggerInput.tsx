import React, { useState } from 'react'
import SwaggerParser from "@apidevtools/swagger-parser";
import { InputGroup, ControlGroup, FormGroup, Button, Toaster } from "@blueprintjs/core";

const TOASTER = Toaster.create();

export default function SwaggerInput() {
    let [schemaURL, setSchemaURL] = useState("");

    function handleSubmit(event: any) {
        event.preventDefault();
        SwaggerParser.parse(schemaURL)
        .then(e => TOASTER.show({message: "Successfully Validated", intent: "success", icon: "tick-circle"}))
        .catch(e => TOASTER.show({message: e.message, intent: "danger", icon: "warning-sign"}));
    }

    function handleChange(event: any) {
        setSchemaURL(event.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <FormGroup label="Swagger 2.0 or OpenAPI 3.0 Schema">
                <ControlGroup>
                    <InputGroup 
                        type="text"
                        placeholder="http://example.com/swagger.yaml"
                        value={schemaURL}
                        onChange={handleChange}
                        fill
                    />
                    <Button 
                        intent="success" 
                        text="Validate"
                        icon="tick"
                        type="submit"
                    />
                </ControlGroup>
            </FormGroup>
        </form>
    )
}
