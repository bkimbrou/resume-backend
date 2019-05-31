export const mochaAsync = (fn: Function) => {
    return async () => {
        try {
            await fn();
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    };
};

export function mockModule<T extends { [K: string]: any }>(moduleToMock: T, defaultMockValuesForMock: Partial<{ [K in keyof T]: T[K] }>) {
    return (sandbox: sinon.SinonSandbox, returnOverrides?: Partial<{ [K in keyof T]: T[K] }>): void => {
        const functions = Object.keys(moduleToMock);
        const returns: Partial<{ [K in keyof T]: T[K] }> = returnOverrides || {};
        functions.forEach((f) => {
            sandbox.stub(moduleToMock, f).callsFake(returns[f] || defaultMockValuesForMock[f]);
        });
    };
}

export const randomNumber = function(max: number, min: number = 1): number {
    return Math.floor(Math.random()*(max-min+1)) + min;
};