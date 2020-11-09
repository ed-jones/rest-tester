import React, { useState } from 'react'
import {
  ControlGroup,
  InputGroup,
  Classes,
  Callout,
  HTMLTable,
  Switch,
  Button,
  Tabs,
  Tab,
  Card,
  Alignment,
  Label,
  NumericInput,
} from "@blueprintjs/core";
import { IPathItem, IParameter, IOperation, IOperationVerb } from '@interfaces/Swagger';
import { OperationIntentHashMap } from '@components/home/EndpointCard';
import { Item, ItemRight } from '@components/settings/Settings';
import OperationSelect from './OperationSelect';
import { ITests, ITestParam } from '../EndpointDialog';

interface EndpointDetailsProps {
  path: IPathItem,
  endpoint: string,
  handleRunTests: any,
  baseURL: string,
}

export default function EndpointDetails(props: EndpointDetailsProps) {
  let completeURL = `${props.baseURL}${props.endpoint}`;
  return (
    <div className={Classes.DIALOG_BODY}>
      <Tabs animate defaultSelectedTabId={0}>
        {Object.keys(props.path).map((operationName: string, key: number) => (
          <Tab id={key} key={key} title={operationName.toUpperCase()} panelClassName={Classes.FILL} panel={
            <Card>
              <EndpointDetail
                operation={[operationName as IOperationVerb, Object.values(props.path)[key]]}
                completeURL={completeURL}
                handleRunTests={props.handleRunTests}
              />
            </Card>
          } />
        ))}
      </Tabs>
    </div>
  )
}

interface EndpointDetailProps {
  operation: [IOperationVerb, IOperation],
  completeURL: string,
  handleRunTests: any
}

const paramHash: { [param: string]: string } = {
  "query": "Query",
  "header": "Header",
  "path": "Path",
  "formData": "Form Data",
  "body": "Body",
};

export function EndpointDetail(props: EndpointDetailProps) {
  let [operationName, operationObj] = props.operation;

  let defaultState: ITests = {
    operation: operationName,
    art: false,
    abortOnFail: false,
    params: (operationObj.parameters as [IParameter]).map((value: IParameter) => ({
      name: value.name,
      random: true,
      in: value.in,
      max: value?.max,
      min: value?.min,
      type: value?.type,
      required: value?.required,
    })),
    responses: Object.values(operationObj.responses)
      .map((_response: any, index: number) => (Number(Object.keys(operationObj.responses)[index])||"default")),
  }

  let [state, setState] = useState(defaultState);

  function handleChange(event: any, index?: number) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (index !== undefined) {
      let params = state.params as [ITestParam];
      params[index] = { ...params[index], [name]: value }
      setState({ ...state, params });
    } else {
      setState({ ...state, [name]: value });
    }
  }

  return (
    <div>
      <ControlGroup>
        <Button intent={OperationIntentHashMap[operationName]}>
          {operationName.toUpperCase()}
        </Button>
        <InputGroup fill type="text" value={props.completeURL} />
        <Button
          intent="primary"
          icon="play"
          onClick={() => props.handleRunTests(state)}
        >
          Run Tests
                </Button>
      </ControlGroup>
      <div>
        <h3>Testing Rules</h3>
        <Switch
          label="Methodology"
          innerLabel="RT"
          innerLabelChecked="ART"
          alignIndicator={Alignment.RIGHT}
          onChange={handleChange}
          name="art"
        />
        <Switch
          label="Abort on Failure"
          innerLabel="No"
          innerLabelChecked="Yes"
          alignIndicator={Alignment.RIGHT}
          onChange={handleChange}
          name="abortOnFail"
        />
        <Item>
          <Label>
            Maximum Tests
                    </Label>
          <ItemRight>
            <NumericInput
              placeholder="Unlimited"
              value={state.maxTests}
              onValueChange={(n: number) => handleChange({
                target: {
                  name: "maxTests",
                  type: "number",
                  value: n,
                }
              })}
            />
          </ItemRight>
        </Item>
        {operationObj.parameters ? (
          <>
            <h3>Test Parameters</h3>
            <Tabs vertical defaultSelectedTabId={0}>
              {Array.from(new Set(Object.values(operationObj.parameters as [IParameter])
                .map((param: IParameter) => (param.in))))
                .map((paramIn: string, index: number) => (
                  <Tab id={index} key={paramIn} title={paramHash[paramIn as string]} panel={
                    <Callout>
                      <HTMLTable style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <td>Random</td>
                            <td>Value</td>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.values(operationObj.parameters as [IParameter])
                            .filter((param: IParameter) => (param.in === paramIn))
                            .map((param: IParameter, index: number) => {
                              let paramIndex = (operationObj.parameters as [IParameter]).indexOf(param);
                              return (
                                <tr key={index}>
                                  <td>{param.name}</td>
                                  <td style={{ textAlign: 'center' }}>
                                    <Switch
                                      name="random"
                                      innerLabel="Chosen"
                                      innerLabelChecked="Random"
                                      defaultChecked
                                      onChange={(e: any) => handleChange(e, paramIndex)}
                                    />
                                  </td>
                                  <td>
                                    <InputGroup
                                      name="value"
                                      type="text"
                                      placeholder={param.type || "unknown"}
                                      disabled={state.params?.[paramIndex].random}
                                      onChange={(e: any) => handleChange(e, paramIndex)}
                                    />
                                  </td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </HTMLTable>
                    </Callout>
                  } />
                ))}
            </Tabs>
          </>
        ) : null}
        <h3>Valid Responses</h3>
        <OperationSelect 
          responses={operationObj.responses} 
          handleChange={handleChange}
        />
      </div>
    </div>
  )
}
