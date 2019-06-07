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

export const randomNumber = function(max: number, min: number = 1): number {
    return Math.floor(Math.random()*(max-min+1)) + min;
};