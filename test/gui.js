const gui = require('gui');
const path = require('path');

gui.open({
    file: path.join(__dirname, 'web.html'),
    devtools: true
})