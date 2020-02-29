import * as moo from 'moo';
import {
    slice,
    trim,
    pipe,
    split,
    map,
    replace,
    filter,
    not,
    join,
    isEmpty,
} from 'ramda';

/**
 * 从 'aa' 或者 "aa" 字符串中提取 aa 字符
 */
const pickStrValue = slice(1, -1);

/**
 * 获取行级注释文本
 */
const pickLineCommentValue = pipe((str: string) => str.slice(2), trim);

/**
 * 获取块级注释的文本数组
 */
const pickBlockCommentValue = pipe(
    slice(2, -2) as (s: string) => string,
    split(/\n/),
    map(pipe(trim, replace(/\*+/, ''), trim)),
    filter(pipe(isEmpty, not)),
    join('\n')
);

const lexer = moo.compile({
    LEFT_BRACE: '{', // {
    RIGHT_BRACE: '}', // }
    LEFT_BRACKET: '[', // [
    RIGHT_BRACKET: ']', // ]
    COLON: ':', // :
    COMMA: ',', // ,
    STRING: [
        {
            match: /"(?:\\["\\]|[^\n"\\])*"/,
            value: pickStrValue,
        },
        {
            match: /'(?:\\['\\]|[^\n'\\])*?'/,
            value: pickStrValue,
        },
    ],
    NUMBER: [
        { match: /0{1}/ },
        { match: /[1-9]\d*\.?\d*/ },
        { match: /\-[0-9]\d*\.?\d*/ },
        { match: /0\.\d*/ },
    ],
    IDENTIFIER: {
        match: /[a-zA-Z_][a-zA-Z0-9_]*/,
        type: moo.keywords({
            NULL: 'null',
            TRUE: 'true',
            FALSE: 'false',
        }),
    },
    BLOCK_COMMENT: {
        match: /\/\*[\s\S]*?\*\//,
        value: pickBlockCommentValue,
        lineBreaks: true,
    },
    LINE_COMMENT: {
        match: /\/\/[^\n]*/,
        value: pickLineCommentValue,
    },
    LINE_BREAK: { match: /\n/, lineBreaks: true },
    WHITE_SPACE: { match: /\s+/, lineBreaks: true },
});

export class Lexer {
    static create(code: string) {
        return new this(code);
    }

    tokens: moo.Token[] = [];
    pos = -1;

    get current() {
        return this.tokens[this.pos];
    }

    constructor(readonly code: string) {
        lexer.reset(code);

        this.tokens = Array.from(lexer);
    }

    walk() {
        if (this.pos === -1 || this.tokens[this.pos]) {
            return this.tokens[++this.pos];
        }

        return this.tokens[this.pos];
    }
}
