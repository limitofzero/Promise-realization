import { Promise$ } from './promise$';

describe('test Promise$', () => {
    test('sync test constructor', () => {
        let testValue = 1;

        const promise = new Promise$((resolve) => {
            testValue += 1;
            resolve();
        });

        expect(testValue).toBe(2);
    });

    test('test resolve 2', () => {
        return new Promise$(resolve => resolve(2)).then(value => {
            expect(value).toBe(2);
        });
    });

    test('test errorCb in then', () => {
        return new Promise$((resolve, reject) => reject(2)).then(null,value => {
            expect(value).toBe(2)
        });
    });

    test('test catch reject 2', () => {
        return new Promise$((resolve, reject) => reject(2)).catch(value => {
            expect(value).toBe(2)
        });
    });

    test('test chain then', () => {
        return new Promise$((resolve) => resolve(2)).then(value => {
            return value + 1
        })
            .then(value => value + 1)
            .then(value => expect(value).toBe(4));
    });

    test('test catch then', () => {
        return new Promise$((resolve, reject) => reject(new Error('test error')))
            .catch(e => 4)
            .then(value => expect(value).toBe(4))
    });

    test('test catch then', () => {
        return new Promise$((resolve, reject) => reject('test error'))
            .catch(e => 4)
            .then(value => expect(value).toBe(4));
    });

    test('test throw error inside promise', () => {
        return new Promise$(() => { throw new Error('test')})
            .catch(e => expect(e.message).toBe('test'));
    });

    test('test throw error inside then', () => {
        return new Promise$(resolve => resolve(4))
            .then(() => { throw new Error('test'); })
            .catch(e => expect(e.message).toBe('test'));
    });


    test('test throw error inside then', () => {
        return new Promise$(resolve => resolve(4))
            .then(() => { throw new Error('test'); })
            .catch(e => expect(e.message).toBe('test'));
    });

    test('test finally without error', () => {
        return new Promise$(resolve => resolve(4))
            .then(value => value)
            .finally(() => expect(true).toBe(true));
    });

    test('test finally with error', () => {
        return new Promise$(resolve => resolve(4))
            .then(() => { throw new Error('test'); })
            .finally(() => expect(false).toBe(false));
    });

    test('test resolve undefined if all callback are noop', () => {
        Promise$.resolve(2).then(() => {}, () => {})
            .then(value => expect(value).toBe(undefined));
    });

    test('test reject undefined if all callback are noop', () => {
        Promise$.reject(2).then(() => {}, () => {})
            .then(value => expect(value).toBe(undefined));
    });

    test('test reject + finally must return 2', () => {
        Promise$.reject(2).finally(() => {})
            .then(value => expect(value).toBe(2));
    });

    test('test resolve + finally must return 2', () => {
        Promise$.resolve(2).finally(() => {})
            .then(value => expect(value).toBe(2));
    });
})




