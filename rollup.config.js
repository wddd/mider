import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupJson from 'rollup-plugin-json'

export default {
    input: 'src/index.js',
    output: {
        dir: 'dist',
        format: 'cjs'
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        rollupJson(),
    ]
};
