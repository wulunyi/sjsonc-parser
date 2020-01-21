import {
    Program,
    ObjectPattern,
    ObjectProperty,
    Identifier,
    ValueType,
    ArrayPattern,
    BaseType,
    Literal,
    SourceLocation,
    LineComment,
    BlockComment,
    Pattern,
} from './types';
import {
    or,
    propEq,
    pipe,
    not,
    tail,
    last,
    add,
    subtract,
    __,
    equals,
    ifElse,
    always,
} from 'ramda';
import * as moo from 'moo';
import { equal } from 'assert';

export function createProgram(body: Pattern[] = []): Program {
    return {
        type: 'Program',
        body,
        comments: [],
    };
}

export function createObjectPattern(
    children: ObjectProperty[] = []
): ObjectPattern {
    return {
        type: 'ObjectPattern',
        children,
    };
}

export function createProperty(
    key: Identifier,
    value: ValueType
): ObjectProperty {
    return {
        type: 'ObjectProperty',
        key,
        value,
    };
}

export function createIdentifier(value: string, raw: string): Identifier {
    return {
        type: 'Identifier',
        value,
        raw,
    };
}

export function createArrayPattern(children: ValueType[] = []): ArrayPattern {
    return {
        type: 'ArrayPattern',
        children,
    };
}

export function createLiteral(value: BaseType, raw: string): Literal {
    return {
        type: 'Literal',
        value,
        raw,
    };
}

export function createLineComment(token: moo.Token): LineComment {
    return {
        type: 'LineComment',
        value: token.value,
        raw: token.text,
        loc: createSourceLocation(token),
    };
}

export function createBlockComment(token: moo.Token): BlockComment {
    return {
        type: 'BlockComment',
        value: token.value.split('\n'),
        raw: token.text,
        loc: createSourceLocation(token),
    };
}

const addSubtract1 = pipe(
    add as (a: number, b: number) => number,
    subtract(__, 1)
);

const equalOne = equals(1);

export function createSourceLocation(token: moo.Token): SourceLocation {
    const arr = token.text.split('\n');
    const len = arr.length;
    const lastStrLen = last(arr)!.length;

    return {
        start: {
            column: token.col,
            line: token.line,
        },
        end: {
            line: addSubtract1(token.line, len),
            column: ifElse(
                equalOne,
                always(addSubtract1(lastStrLen, token.col)),
                always(lastStrLen)
            )(len),
        },
    };
}

export function isNotUseToken(token: moo.Token) {
    return or(
        propEq('type', 'LINE_BREAK')(token),
        propEq('type', 'WHITE_SPACE')(token)
    );
}

export function isRightBraceToken(token?: moo.Token) {
    return token && propEq('type', 'RIGHT_BRACE')(token);
}

export function isRightBracketToken(token?: moo.Token) {
    return token && propEq('type', 'RIGHT_BRACKET')(token);
}

export function isColonToken(token?: moo.Token) {
    return token && propEq('type', 'COLON')(token);
}

export const isNotCloseBracket = pipe(isRightBraceToken, not);

export function isCommaToken(token?: moo.Token) {
    return token && propEq('type', 'COMMA')(token);
}

export function isLineCommentToken(token?: moo.Token) {
    return token && propEq('type', 'LINE_COMMENT', token);
}

export function isBlockCommentToken(token?: moo.Token) {
    return token && propEq('type', 'BLOCK_COMMENT', token);
}

export function isCommentToken(token?: moo.Token) {
    return token && or(isLineCommentToken(token), isBlockCommentToken(token));
}
