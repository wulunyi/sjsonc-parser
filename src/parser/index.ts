import {
    Program,
    ObjectPattern,
    ObjectProperty,
    ValueType,
    ArrayPattern,
} from './types';
import {
    createProgram,
    createObjectPattern,
    createIdentifier,
    createLiteral,
    createProperty,
    createArrayPattern,
    isNotUseToken,
    isCloseBraceToken,
    isColonToken,
    isCloseBracket,
} from './helper';
import { Lexer } from '../lexer';
import { pipe, propEq, not } from 'ramda';

export function parse(code = ''): Program {
    const result = createProgram();
    const lexer = Lexer.create(code);

    const walk = () => {
        while (lexer.walk() !== undefined && isNotUseToken(lexer.current())) {}

        return lexer.current();
    };

    const parseObject = (): ObjectPattern => {
        const object = createObjectPattern();

        while (pipe(isCloseBraceToken, not)(walk())) {
            const token = lexer.current();

            if (token === undefined) {
                throw new Error('语法错误');
            }

            switch (token.type) {
                case 'IDENTIFIER':
                case 'STRING':
                    object.children.push(parseProperty(token));
                    break;
                default:
                    throw new Error('语法错误');
            }

            if (propEq('type', 'COMMA')(walk())) {
                continue;
            } else if (propEq('type', 'RIGHT_BRACE')(lexer.current())) {
                break;
            } else {
                throw new Error('语法错误');
            }
        }

        return object;
    };

    const parseProperty = (pToken: moo.Token): ObjectProperty => {
        const key = createIdentifier(pToken.value, pToken.text);

        if (isColonToken(walk())) {
            const token = walk();

            return createProperty(key, parseValue(token));
        }

        throw new Error('语法错误');
    };

    const parseArray = (): ArrayPattern => {
        const array = createArrayPattern();

        while (pipe(isCloseBracket, not)(walk())) {
            const token = lexer.current();

            if (token === undefined) {
                throw new Error('语法错误');
            }

            array.children.push(parseValue(token));

            if (propEq('type', 'COMMA')(walk())) {
                continue;
            } else if (propEq('type', 'RIGHT_BRACKET')(lexer.current())) {
                break;
            } else {
                throw new Error('语法错误');
            }
        }

        return array;
    };

    const parseValue = (token: moo.Token): ValueType => {
        let value: ValueType;

        switch (token.type) {
            case 'STRING':
                value = createLiteral(token.value, token.text);
                break;
            case 'NUMBER':
                value = createLiteral(Number(token.value), token.text);
                break;
            case 'NULL':
                value = createLiteral(null, token.text);
                break;
            case 'TRUE':
                value = createLiteral(true, token.text);
                break;
            case 'FALSE':
                value = createLiteral(false, token.text);
                break;
            case 'LEFT_BRACE':
                value = parseObject();
                break;
            case 'LEFT_BRACKET':
                value = parseArray();
                break;
            default:
                throw new Error('语法错误');
        }

        return value;
    };

    while (walk() !== undefined) {
        const token = lexer.current()!;

        switch (token.type) {
            case 'LEFT_BRACE':
                result.body.push(parseObject());
                break;
            case 'LEFT_BRACKET':
                result.body.push(parseArray());
                break;
            default:
                throw new Error('语法错误');
        }
    }

    return result;
}
