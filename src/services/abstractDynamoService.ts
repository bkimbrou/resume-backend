import AWS, {AWSError} from 'aws-sdk'
import {v4 as uuid} from 'uuid';
import {Generic} from './models/generic';
import {PromiseResult} from 'aws-sdk/lib/request';
import {LambdaResult} from './models/lambda';

AWS.config.update({region: 'us-east-2'});

export abstract class AbstractDynamoService<T extends Generic> {
    protected tableName: string;
    protected readLimit: number;

    protected constructor(tableName: string, readLimit: number) {
        this.tableName = tableName;
        this.readLimit = readLimit;
    }

    protected async scanTable() : Promise<Array<T>> {
        const dynamo = new AWS.DynamoDB();

        let params: AWS.DynamoDB.ScanInput = {
            TableName: this.tableName,
            Select: 'ALL_ATTRIBUTES',
            Limit: this.readLimit
        };

        return this.handleScanResults(await dynamo.scan(params).promise())
    }

    private handleScanResults(result: PromiseResult<AWS.DynamoDB.ScanOutput, AWSError>) : Promise<Array<T>> {
        if (result.$response && result.$response.error) {
            let err: AWSError = result.$response.error;
            console.error(err, err);
            return Promise.reject(err);
        }
        else if (result.Items) {
            //TODO: Handle if results were paginated
            return Promise.resolve(AbstractDynamoService.itemsToJson(result.Items));
        }
        else {
            return Promise.resolve([]);
        }
    }

    protected async putItem(item: T) : Promise<void> {
        const dynamo = new AWS.DynamoDB();

        if (!item.id) {
            item.id = uuid();
        }
        let params: AWS.DynamoDB.PutItemInput = {
            Item: AbstractDynamoService.jsonToItem(item),
            TableName: this.tableName
        };

        return this.handleResult(await dynamo.putItem(params).promise());
    }

    protected async deleteItem(item: Generic) : Promise<void> {
        const dynamo = new AWS.DynamoDB();

        if (item.id) {
            let params: AWS.DynamoDB.DeleteItemInput = {
                Key: {
                    id: {
                        S: item.id
                    }
                },
                TableName: this.tableName
            };

            return this.handleResult(await dynamo.deleteItem(params).promise());
        }
        else {
            return Promise.reject('must have an id to delete');
        }
    }

    private handleResult(result: PromiseResult<AWS.DynamoDB.PutItemOutput | AWS.DynamoDB.DeleteItemOutput | AWS.DynamoDB.UpdateItemOutput, AWSError>) : Promise<void> {
        if (result.$response && result.$response.error) {
            let err: AWSError = result.$response.error;
            console.error(err, err);
            return Promise.reject(err);
        }
        else {
            return Promise.resolve();
        }
    }

    static itemsToJson(items: AWS.DynamoDB.ItemList) : Array<any> {
        let result: Array<any> = [];

        if (items) {
            items.map(AbstractDynamoService.itemToJson).forEach(json => result.push(json));
        }

        return result;
    }

    static itemToJson(item: AWS.DynamoDB.AttributeMap) : any {
        let obj: any = {};
        for (let attribute in item) {

            if (item.hasOwnProperty(attribute)) {
                if (item[attribute].hasOwnProperty('S')) {
                    obj[attribute] = item[attribute].S;
                }
                else if (item[attribute].hasOwnProperty('N')) {
                    obj[attribute] = item[attribute].N;
                }
                else if (item[attribute].hasOwnProperty('B')) {
                    obj[attribute] = item[attribute].B;
                }
                else if (item[attribute].hasOwnProperty('SS')) {
                    obj[attribute] = item[attribute].SS;
                }
                else if (item[attribute].hasOwnProperty('NS')) {
                    obj[attribute] = item[attribute].NS;
                }
                else if (item[attribute].hasOwnProperty('BS')) {
                    obj[attribute] = item[attribute].BS;
                }
                else if (item[attribute].hasOwnProperty('M')) {
                    obj[attribute] = item[attribute].M;
                }
                else if (item[attribute].hasOwnProperty('L')) {
                    obj[attribute] = item[attribute].L;
                }
                else if (item[attribute].hasOwnProperty('BOOL')) {
                    obj[attribute] = item[attribute].BOOL;
                }
            }
        }

        return obj;
    }

    static jsonToItem(obj: any) : AWS.DynamoDB.AttributeMap {
        let result : AWS.DynamoDB.AttributeMap = {};

        if (obj) {
            for(let attribute in obj) {
                if (obj.hasOwnProperty(attribute)) {
                    result[attribute] = {};
                    if (obj[attribute] === undefined || obj[attribute] === null) {
                        result[attribute].NULL = true;
                    }
                    else if (typeof obj[attribute] === 'boolean') {
                        result[attribute].BOOL = obj[attribute];
                    }
                    else if (typeof obj[attribute] === 'string') {
                        result[attribute].S = obj[attribute];
                    }
                    else if (typeof obj[attribute] === 'number') {
                        result[attribute].N = obj[attribute];
                    }
                    else if (obj[attribute] instanceof Buffer || obj[attribute] instanceof Uint8Array) {
                        result[attribute].B = obj[attribute];
                    }
                    else if (obj[attribute] instanceof Array) {
                        if (obj[attribute].length > 0) {
                            let elem: any = obj[attribute][0];

                            if (typeof elem === 'string') {
                                result[attribute].SS = obj[attribute];
                            }
                            else if (typeof elem === 'number') {
                                result[attribute].NS = obj[attribute];
                            }
                            else if (elem instanceof Buffer || elem instanceof Uint8Array) {
                                result[attribute].BS = obj[attribute];
                            }
                            else {
                                result[attribute].L = obj[attribute];
                            }
                        }
                    }
                    else {
                        result[attribute].M = obj[attribute];
                    }
                }
            }
        }

        return result;
    }
}