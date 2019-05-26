export const mochaAsync = (fn: any) => {
    return async (done: any) => {
        try {
            await fn();
            done();
        } catch (err) {
            done(err);
        }
    };
};