// Direct server startup without requiring NestJS CLI binary
const { register } = require('ts-node');

register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
  },
});

require('./src/main');
