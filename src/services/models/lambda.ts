export interface LambdaResult {
    statusCode: number,
    headers?: Map<string, string>,
    data?: any
}

export interface LambdaInput {
    headers?: Map<string, string>,
    data?: any
}