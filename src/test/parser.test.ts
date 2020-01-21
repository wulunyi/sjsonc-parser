import { parse } from '../parser';
import {
    createProgram,
    createObjectPattern,
    createArrayPattern,
    createProperty,
} from '../parser/helper';

describe('Test Parser', () => {
    it('Test Object', () => {
        const ast = parse(`{}`);

        expect(ast).toEqual(createProgram([createObjectPattern()]));
    });

    it('Test Array', () => {
        const ast = parse(`[]`);

        expect(ast).toEqual(createProgram([createArrayPattern()]));
    });

    it('Test property', () => {
        const ast = parse(`{"name": "wly", age: 18, 'nick': 'aaa'}`);
    });
});
