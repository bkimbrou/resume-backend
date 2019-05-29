export interface LambdaResult {
    statusCode: number,
    headers?: Map<string, string>,
    data?: any
}