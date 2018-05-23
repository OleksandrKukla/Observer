import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/Observer.js',
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    // sourceMap: true,
    output: [
        {
            format: 'umd',
            name: 'EventsObserver',
            file: 'build/index.js',
            indent: '\t'
        }
    ]
};