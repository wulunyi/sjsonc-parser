import { Lexer } from '../lexer';

describe('Tokenizer', () => {
    it('Tokenizer.create', () => {
        const tokenizer = Lexer.create('{}');
        expect(tokenizer).toBeInstanceOf(Lexer);
        expect(tokenizer).toHaveProperty('next');
        expect(tokenizer).toHaveProperty('current');
    });

    it('scanner object', () => {
        const tokenizer = Lexer.create('{}');
        expect(tokenizer.next()).toHaveProperty('type', 'LEFT_BRACE');
        expect(tokenizer.next()).toHaveProperty('type', 'RIGHT_BRACE');
    });

    it('scanner array', () => {
        const tokenizer = Lexer.create('[]');
        expect(tokenizer.next()).toHaveProperty('type', 'LEFT_BRACKET');
        expect(tokenizer.next()).toHaveProperty('type', 'RIGHT_BRACKET');
    });

    it('scanner comma', () => {
        const tokenizer = Lexer.create(`,`);
        expect(tokenizer.next()).toHaveProperty('type', 'COMMA');
    });

    it('scanner colon', () => {
        const tokenizer = Lexer.create(`:`);
        expect(tokenizer.next()).toHaveProperty('type', 'COLON');
    });

    it('scanner string', () => {
        const tokenizer = Lexer.create(`"aaaa"`);
        expect(tokenizer.next()).toHaveProperty('type', 'STRING');
        expect(tokenizer.current()).toHaveProperty('value', 'aaaa');
        expect(tokenizer.current()).toHaveProperty('text', '"aaaa"');
        const tokenizer1 = Lexer.create(`'aaaa'`);
        expect(tokenizer1.next()).toHaveProperty('type', 'STRING');
        expect(tokenizer1.current()).toHaveProperty('value', 'aaaa');
        expect(tokenizer1.current()).toHaveProperty('text', "'aaaa'");
    });

    it('scanner NumericLiteral', () => {
        const tokenizer = Lexer.create(`0 1 1.1 -1 -0.1 -1.1`);
        expect(tokenizer.next()).toHaveProperty('type', 'NUMBER');
        expect(tokenizer.current()).toHaveProperty('value', '0');
        tokenizer.next();
        expect(tokenizer.next()).toHaveProperty('type', 'NUMBER');
        expect(tokenizer.current()).toHaveProperty('value', '1');
        tokenizer.next();
        expect(tokenizer.next()).toHaveProperty('type', 'NUMBER');
        expect(tokenizer.current()).toHaveProperty('value', '1.1');
        tokenizer.next();
        expect(tokenizer.next()).toHaveProperty('type', 'NUMBER');
        expect(tokenizer.current()).toHaveProperty('value', '-1');
        tokenizer.next();
        expect(tokenizer.next()).toHaveProperty('type', 'NUMBER');
        expect(tokenizer.current()).toHaveProperty('value', '-0.1');
        tokenizer.next();
        expect(tokenizer.next()).toHaveProperty('type', 'NUMBER');
        expect(tokenizer.current()).toHaveProperty('value', '-1.1');
    });

    it('scanner IDENTIFIER', () => {
        const tokenizer = Lexer.create(`aaa true null false`);
        expect(tokenizer.next()).toHaveProperty('type', 'IDENTIFIER');
        expect(tokenizer.current()).toHaveProperty('value', 'aaa');
        expect(tokenizer.next()).toHaveProperty('type', 'WHITE_SPACE');
        expect(tokenizer.next()).toHaveProperty('type', 'TRUE');
        expect(tokenizer.current()).toHaveProperty('value', 'true');
        expect(tokenizer.next()).toHaveProperty('type', 'WHITE_SPACE');
        expect(tokenizer.next()).toHaveProperty('type', 'NULL');
        expect(tokenizer.current()).toHaveProperty('value', 'null');
        expect(tokenizer.next()).toHaveProperty('type', 'WHITE_SPACE');
        expect(tokenizer.next()).toHaveProperty('type', 'FALSE');
        expect(tokenizer.current()).toHaveProperty('value', 'false');
    });
});
