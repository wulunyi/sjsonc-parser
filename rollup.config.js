import rollupTypescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import { uglify } from 'rollup-plugin-uglify';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'lib/index.js',
            format: 'cjs',
        },
        plugins: [
            rollupTypescript({
                tsconfigDefaults: {
                    compilerOptions: {
                        module: 'ESNext',
                        target: 'es5',
                        declaration: false,
                    },
                },
            }),
            cleanup({ comments: 'none', extensions: ['ts'] }),
            resolve(),
            commonjs({
                namedExports: {
                    moo: ['compile', 'keywords'],
                },
            }),
            uglify({
                compress: {
                    drop_debugger: false,
                },
            }),
        ],
    },
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'lib/index.d.ts',
                format: 'es',
            },
        ],
        plugins: [dts()],
    },
];
