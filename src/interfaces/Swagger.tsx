/*
    Swagger Interface
    Based on https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
*/

export default interface Swagger {
    swagger: string,
    info: info
    host?: string,
    basePath?: string,
    schemes?: [string],
    consumes?: [string],
    produces?: [string],
    paths: paths,
    definitions?: definitions,
    parameters?: parameters_definitions,
    responses?: responses_definitions,
    securityDefinitions?: security_definitions,
    security?: [security_requirement],
    tags?: [tag],
    externalDocs?: external_docs,
}

interface info {
    title: string,
    description?: string,
    termsOfService?: string,
    contact?: contact,
    license?: license,
    version: string,
}

interface contact {
    name?: string,
    url?: string,
    email?: string,
}

interface license {
    name: string,
    url?: string,
}

interface paths {
    [path: string]: path_item,
}

export interface path_item {
    $ref?: string,
    get?: operation,
    put?: operation,
    post?: operation,
    delete?: operation,
    options?: operation,
    head?: operation,
    patch?: operation,
    parameters?: [parameter|reference],
}

export interface operation {
    tags?: [string],
    summary?: string,
    description?: string,
    externalDocs?: external_docs,
    operationId?: string,
    consumes?: [string],
    produces?: [string],
    parameters?: [parameter|reference],
    responses: responses,
    schemes: [string],
    deprecated: boolean,
    security: security_requirement,
}

interface external_docs {
    description?: string,
    url?: string,
}

export interface parameter {
    name: string,
    in: string,
    description?: string,
    required?: boolean
}

export interface reference {
    $ref: string,
}

interface responses {
    default?: [response|reference]
}

interface response {
    description: string,
    schema?: schema,
    headers?: headers,
    examples?: example,
}

interface schema {
    discriminator?: string,
    readOnly: boolean,
    xml: xml,
    externalDocs: external_docs,
    example: any,
}

interface xml {
    name?: string,
    namespace?: string,
    prefix?: string,
    attribute?: boolean,
    wrapped?: boolean,
}

interface headers {
    [name: string]: header,
}

interface header {
    description?: string,
    type: string,
    format: string,
    items: items,
    collectionFormat: string,
    default: any,
    maximum?: number,
    exclusiveMaximum?: boolean,
    minimum?: number,
    exclusiveMinumum?: boolean,
    maxLength?: number,
    minLength?: number,
    pattern?: string,
    maxItems?: number,
    minItems?: number,
    uniqueItems?: boolean,
    enum?: [any],
    multipleOf?: number,
}

interface items {
    type: string,
    format?: string,
    items: items,
    collectionFormat?: string,
    default?: any,
    maximum?: number,
    exclusiveMaximum?: boolean,
    minimum?: number,
    exclusiveMinumum?: boolean,
    maxLength?: number,
    minLength?: number,
    pattern?: string,
    maxItems?: number,
    minItems?: number,
    uniqueItems?: boolean,
    enum?: [any],
    multipleOf?: number,
}

interface example {
    [mime_type: string]: any,
}

interface security_requirement {
    [name: string]: [string],
}

interface definitions {
    [name: string]: schema,
}

interface parameters_definitions {
    [name: string]: parameter,
}

interface responses_definitions {
    [name: string]: response,
}

interface security_definitions {
    [name: string]: security_scheme,
}

interface security_scheme {
    type: string,
    description?: string,
    name: string,
    in: string,
    flow: string,
    authorizationUrl: string,
    tokenUrl: string,
    scopes: scopes,
}

interface scopes {
    [name: string]: string
}

interface tag {
    name: string,
    description?: string,
    externalDocs?: external_docs,
}
