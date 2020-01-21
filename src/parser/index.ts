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
    isColonToken,
    isRightBracketToken,
    isNotCloseBracket,
    isCommaToken,
    isRightBraceToken,
    isCommentToken,
    createLineComment,
    createBlockComment,
    isLineCommentToken,
    isBlockCommentToken,
} from './helper';
import { Lexer } from '../lexer';
import { pipe, not } from 'ramda';

export function parse(code = ''): Program {
    const result = createProgram();
    const lexer = Lexer.create(code);

    const walk = () => {
        while (lexer.walk() !== undefined && isNotUseToken(lexer.current)) {}

        return lexer.current;
    };

    const collectComments = (token: moo.Token) => {
        if (isLineCommentToken(token)) {
            result.comments.push(createLineComment(token));
        } else if (isBlockCommentToken(token)) {
            result.comments.push(createBlockComment(token));
        }
    };

    const parseObject = (): ObjectPattern => {
        const object = createObjectPattern();

        while (isNotCloseBracket(walk())) {
            const token = lexer.current;

            if (token === undefined) {
                throw new Error('语法错误');
            }

            if (isCommentToken(token)) {
                collectComments(token);

                continue;
            }

            switch (token.type) {
                case 'IDENTIFIER':
                case 'STRING':
                    object.children.push(parseProperty(token));
                    break;
                default:
                    throw new Error('语法错误');
            }

            if (isCommaToken(walk())) {
                continue;
            } else if (isRightBraceToken(lexer.current)) {
                break;
            } else {
                throw new Error('语法错误');
            }
        }

        return object;
    };

    const parseProperty = (pToken: moo.Token): ObjectProperty => {
        const key = createIdentifier(pToken.value, pToken.text);

        const a = lexer;
        if (isColonToken(walk())) {
            const token = walk();

            return createProperty(key, parseValue(token));
        }

        throw new Error('语法错误');
    };

    const parseArray = (): ArrayPattern => {
        const array = createArrayPattern();

        while (pipe(isRightBracketToken, not)(walk())) {
            const token = lexer.current;

            if (token === undefined) {
                throw new Error('语法错误');
            }

            array.children.push(parseValue(token));

            if (isCommaToken(walk())) {
                continue;
            } else if (isRightBracketToken(lexer.current)) {
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
        const token = lexer.current;

        if (isCommentToken(token)) {
            collectComments(token);

            continue;
        }

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

const a = parse(`{"name": "wly", age: 18, 'nick': 'aaa'}`);
