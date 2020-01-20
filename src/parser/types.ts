export type Node = Program | ObjectPattern | ObjectProperty | ArrayPattern;

export interface BaseNode {
    type: Node['type'];
}

export interface Program extends BaseNode {
    type: 'Program';
    body: Array<ArrayPattern | ObjectPattern>;
    // start: number;
    // end: number;
    // source: string;
}

export interface ObjectPattern extends BaseNode {
    type: 'ObjectPattern';
    children: ObjectProperty[];
    // loc: Loc;
}

export type ValueType = ObjectPattern | ArrayPattern | Literal;

export interface ObjectProperty extends BaseNode {
    type: 'ObjectProperty';
    key: Identifier;
    value: ValueType;
}

export interface Identifier {
    type: 'Identifier';
    value: string;
    raw: string;
    // loc: Loc;
}

// export interface Loc {
//     start: {
//         line: number;
//         column: number;
//         offset: number;
//     };
//     end: {
//         line: number;
//         column: number;
//         offset: number;
//     };
//     source: null;
// }

export interface ArrayPattern extends BaseNode {
    type: 'ArrayPattern';
    children: ValueType[];
    // loc: Loc;
}

export type BaseType = boolean | string | null | number;

export interface Literal {
    type: 'Literal';
    value: BaseType;
    raw: string;
}
