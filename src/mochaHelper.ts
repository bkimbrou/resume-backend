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