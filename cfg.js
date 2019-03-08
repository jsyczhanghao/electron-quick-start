var path = require('path');

exports.CACHE_DIR = path.join(__dirname, 'cache');
exports.NATIVE_WORKSPACE_INFO_FILE = path.join(exports.CACHE_DIR, 'workspace.json');