import { nodeConfig } from '@parkguard/eslint-config/node.js';

export default [...nodeConfig, { ignores: ['build/**'] }];
