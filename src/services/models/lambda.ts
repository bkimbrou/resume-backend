export interface LambdaResult {
    statusCode: number,
    headers?: Map<string, string>,
    data?: any
}

export interface LambdaInput {
    headers?: Map<string, string>,
    queryParams?: Map<string, string>,
    pathParams?: Map<string, string>,
    data?: any
}