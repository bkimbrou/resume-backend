import AWS from 'aws-sdk'
import {v4 as uuid} from 'uuid';
import {GenericInterface} from "./models/genericInterface";

const DYNAMO: AWS.DynamoDB = new AWS.DynamoDB();

export abstract class AbstractDynamoService<T extends GenericInterface> {
    protected tableName: string;
    protected readLimit: number;

    protected constructor(tableName: string, readLimit: number) {
        this.tableName = tableName;
        this.readLimit = readLimit;
    }

    abstract readAll(event: any, context: any) : Promise<Array<T>>;

    abstract upsert(event: any, context: any) : Promise<void>;

    abstract delete(event: any, context: any) : Promise<void>;

    protected scanTable() {
        let params: AWS.DynamoDB.ScanInput = {
            TableName: this.tableName,
            Select: 'ALL_ATTRIBUTES',
            Limit: this.readLimit
        };

        DYNAMO.scan(params, this.handleScanResults);
    }

    private handleScanResults(err: AWS.AWSError, data: AWS.DynamoDB.ScanOutput) {
        if (err) {
            console.error(err, err.stack);
            return Promise.reject(err.message)
        }
        else if (data.Items) {
            //TODO: Handle if results were paginated
            return Promise.resolve(AbstractDynamoService.itemsToJson(data.Items));
        }
        else {
            return Promise.resolve([])
        }
    }

    protected putItem(item: T) {

        if (!item.hasOwnProperty('id')) {
            item.id = uuid()
        }

        let params: AWS.DynamoDB.PutItemInput = {
            Item: AbstractDynamoService.jsonToItem(item),
            TableName: this.tableName
        };

        DYNAMO.putItem(params, this.handleResult)
    }

    protected deleteItem(key: any) {
        let params: AWS.DynamoDB.DeleteItemInput = {
            Key: key,
            TableName: this.tableName
        };

        DYNAMO.deleteItem(params, this.handleResult)
    }

    private handleResult(err: AWS.AWSError, data: AWS.DynamoDB.PutItemOutput | AWS.DynamoDB.DeleteItemOutput | AWS.DynamoDB.UpdateItemOutput) {
        if (err) {
            console.error(err, err.stack);
            return Promise.reject(err.message)
        }
        else {
            return Promise.resolve()
        }
    }

    private static itemsToJson(items: AWS.DynamoDB.ItemList): Array<any> {
        let result: Array<any> = [];

        if (items) {
            items.forEach(item => {
                let obj: any = {};
                for (let attribute in item) {

                    if (item.hasOwnProperty(attribute)) {
                        if (item[attribute].hasOwnProperty('S')) {
                            obj[attribute] = item[attribute].S
                        }
                        else if (item[attribute].hasOwnProperty('N')) {
                            obj[attribute] = item[attribute].N
                        }
                        else if (item[attribute].hasOwnProperty('B')) {
                            obj[attribute] = item[attribute].B
                        }
                        else if (item[attribute].hasOwnProperty('SS')) {
                            obj[attribute] = item[attribute].SS
                        }
                        else if (item[attribute].hasOwnProperty('NS')) {
                            obj[attribute] = item[attribute].NS
                        }
                        else if (item[attribute].hasOwnProperty('BS')) {
                            obj[attribute] = item[attribute].BS
                        }
                        else if (item[attribute].hasOwnProperty('M')) {
                            obj[attribute] = item[attribute].M
                        }
                        else if (item[attribute].hasOwnProperty('L')) {
                            obj[attribute] = item[attribute].L
                        }
                        else if (item[attribute].hasOwnProperty('BOOL')) {
                            obj[attribute] = item[attribute].BOOL
                        }
                    }
                }
            });
        }

        return result;
    }

    private static jsonToItem(obj: any) : AWS.DynamoDB.AttributeMap {
        let result : AWS.DynamoDB.AttributeMap = {};

        if (obj) {
            for(let attribute in obj) {
                if (obj.hasOwnProperty(attribute)) {
                    if (obj[attribute]) {
                        result[attribute].NULL = true
                    }
                    else if (obj[attribute] instanceof String) {
                        result[attribute].S = obj[attribute]
                    }
                    else if (obj[attribute] instanceof Number) {
                        result[attribute].N = obj[attribute]
                    }
                    else if (obj[attribute] instanceof Buffer || obj[attribute] instanceof Uint8Array || obj[attribute] instanceof Blob) {
                        result[attribute].B = obj[attribute]
                    }
                    else if (obj[attribute] instanceof Boolean) {
                        result[attribute].BOOL = obj[attribute]
                    }
                    else if (obj[attribute] instanceof Array) {
                        if (obj[attribute].length > 0) {
                            let elem: any = obj[attribute][0]

                            if (elem instanceof String) {
                                result[attribute].SS = obj[attribute]
                            }
                            else if (elem instanceof Number) {
                                result[attribute].NS = obj[attribute]
                            }
                            else if (elem instanceof Buffer || elem instanceof Uint8Array || elem instanceof Blob) {
                                result[attribute].BS = obj[attribute]
                            }
                            else {
                                result[attribute].L = obj[attribute]
                            }
                        }
                    }
                    else {
                        result[attribute].M = obj[attribute]
                    }
                }
            }
        }

        return result;
    }
}