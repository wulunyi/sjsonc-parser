import { parse } from '../parser';

describe('Test Parser', () => {
    it('Test Object', () => {
        const ast = parse(`{}`);

        expect(ast).toEqual({
            type: 'Program',
            body: [
                {
                    type: 'ObjectPattern',
                    children: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 1,
                        },
                        end: {
                            line: 1,
                            column: 2,
                        },
                    },
                },
            ],
            start: 1,
            end: 2,
            comments: [],
            loc: {
                start: {
                    line: 1,
                    column: 1,
                },
                end: {
                    line: 1,
                    column: 2,
                },
            },
        });
    });
});
