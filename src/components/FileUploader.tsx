import React, { useState } from 'react'
//import SwaggerParser from "@apidevtools/swagger-parser";
import { FileInput, Button, ControlGroup, FormGroup, Callout} from "@blueprintjs/core";

export default function FileUploader() {
    let [fileSelected, setFileSelected] = useState(false);
    let [fileSubmitted, setFileSubmitted] = useState(false);
    let [file, setFile] = useState(new File([], "Choose file..."));
    let [fileContents, setFileContents] = useState("");
  
    function handleChange(event: any) {
      setFileSelected(true);
      setFile(event.target.files[0]);
    }
  
    function handleSubmit(event: any) {
      event.preventDefault();
      setFileSubmitted(true);
  
      let fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => setFileContents(String(fileReader.result));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FormGroup label="Upload Swagger 2.0 or OpenAPI 3.0 Schema File">
                <ControlGroup>
                    <FileInput 
                    hasSelection={fileSelected} 
                    text={file.name}
                    onInputChange={handleChange} 
                    inputProps={{accept:".json, .yml"}}
                    disabled={fileSubmitted}
                    />
                    <br/>
                    <Button 
                    type="submit" 
                    intent="primary"
                    disabled={fileSubmitted}
                    >
                    Upload File
                    </Button>
                </ControlGroup>
                </FormGroup>
            </form>
            {fileSubmitted?(
                <Callout>
                <pre>
                    {fileContents}
                </pre>
                </Callout>
            ) : null}
        </div>
    )
}
