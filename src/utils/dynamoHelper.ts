export class DynamoHelper {
    static itemsToJson(items: AWS.DynamoDB.ItemList): Array<any> {
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

    static jsonToItem(obj: any) : AWS.DynamoDB.AttributeMap {
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