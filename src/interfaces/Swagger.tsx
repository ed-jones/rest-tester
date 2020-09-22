/*
    Swagger Interface
    Based on https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
*/

export default interface ISwagger {
    swagger: string,
    info: IInfo
    host?: string,
    basePath?: string,
    schemes?: [string],
    consumes?: [string],
    produces?: [string],
    paths: IPaths,
    definitions?: IDefinitions,
    parameters?: IParametersDefinitions,
    responses?: IResponsesDefinitions,
    securityDefinitions?: ISecurityDefinitions,
    security?: [ISecurityRequirement],
    tags?: [ITag],
    externalDocs?: IExternalDocs,
}

export interface IInfo {
    title: string,
    description?: string,
    termsOfService?: string,
    contact?: IContact,
    license?: ILicense,
    version: string,
}

export interface IContact {
    name?: string,
    url?: string,
    email?: string,
}

export interface ILicense {
    name: string,
    url?: string,
}

export interface IPaths {
    [path: string]: IPathItem,
}

export interface IPathItem {
    $ref?: string,
    get?: IOperation,
    put?: IOperation,
    post?: IOperation,
    delete?: IOperation,
    options?: IOperation,
    head?: IOperation,
    patch?: IOperation,
    parameters?: [IParameter|IReference],
}

export interface IOperation {
    tags?: [string],
    summary?: string,
    description?: string,
    externalDocs?: IExternalDocs,
    operationId?: string,
    consumes?: [string],
    produces?: [string],
    parameters?: [IParameter|IReference],
    responses: IResponses,
    schemes: [string],
    deprecated: boolean,
    security: ISecurityRequirement,
}

export interface IExternalDocs {
    description?: string,
    url?: string,
}

export interface IParameter {
    name: string,
    in: string,
    description?: string,
    required?: boolean,
    type?: string,
    max?: number,
    min?: number,
}

export interface IReference {
    $ref: string,
}

export interface IResponses {
    default?: [IResponse|IReference]
}

export interface IResponse {
    description: string,
    schema?: ISchema,
    headers?: IHeaders,
    examples?: IExample,
}

export interface ISchema {
    discriminator?: string,
    readOnly: boolean,
    xml: IXml,
    externalDocs: IExternalDocs,
    example: any,
}

export interface IXml {
    name?: string,
    namespace?: string,
    prefix?: string,
    attribute?: boolean,
    wrapped?: boolean,
}

export interface IHeaders {
    [name: string]: IHeader,
}

export interface IHeader {
    description?: string,
    type: string,
    format: string,
    items: IItems,
    collectionFormat: string,
    default: any,
    maximum?: number,
    exclusiveMaximum?: boolean,
    minimum?: number,
    exclusiveMinumum?: boolean,
    maxLength?: number,
    minLength?: number,
    pattern?: string,
    maxIItems?: number,
    minIItems?: number,
    uniqueIItems?: boolean,
    enum?: [any],
    multipleOf?: number,
}

export interface IItems {
    type: string,
    format?: string,
    items: IItems,
    collectionFormat?: string,
    default?: any,
    maximum?: number,
    exclusiveMaximum?: boolean,
    minimum?: number,
    exclusiveMinumum?: boolean,
    maxLength?: number,
    minLength?: number,
    pattern?: string,
    maxIItems?: number,
    minIItems?: number,
    uniqueIItems?: boolean,
    enum?: [any],
    multipleOf?: number,
}

export interface IExample {
    [mime_type: string]: any,
}

export interface ISecurityRequirement {
    [name: string]: [string],
}

export interface IDefinitions {
    [name: string]: ISchema,
}

export interface IParametersDefinitions {
    [name: string]: IParameter,
}

export interface IResponsesDefinitions {
    [name: string]: IResponse,
}

export interface ISecurityDefinitions {
    [name: string]: ISecurityScheme,
}

export interface ISecurityScheme {
    type: string,
    description?: string,
    name: string,
    in: string,
    flow: string,
    authorizationUrl: string,
    tokenUrl: string,
    scopes: IScopes,
}

export interface IScopes {
    [name: string]: string
}

export interface ITag {
    name: string,
    description?: string,
    externalDocs?: IExternalDocs,
}

export type IOperationVerb = "get" | "put" | "post" | "delete" | "options" | "head" | "patch";

