import {
    Program,
    ObjectPattern,
    ObjectProperty,
    Identifier,
    ValueType,
    ArrayPattern,
    BaseType,
    Literal,
} from './types';
import { or, propEq } from 'ramda';
import * as moo from 'moo';

export function createProgram(body: ObjectPattern[] = []): Program {
    return {
        type: 'Program',
        body,
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

export function isNotUseToken(token: moo.Token) {
    return or(
        propEq('type', 'LINE_BREAK')(token),
        propEq('type', 'WHITE_SPACE')(token)
    );
}

export function isCloseBraceToken(token?: moo.Token) {
    return token && propEq('type', 'RIGHT_BRACE')(token);
}

export function isCloseBracket(token?: moo.Token) {
    return token && propEq('type', 'RIGHT_BRACKET')(token);
}

export function isColonToken(token?: moo.Token) {
    return token && propEq('type', 'COLON')(token);
}
