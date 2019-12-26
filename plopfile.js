const viewGenerator = require('./scripts/plop-templates/view/prompt');
const dialogGenerator = require('./scripts/plop-templates/dialog/prompt');

module.exports = function (plop) {
    plop.setGenerator('view', viewGenerator);
    plop.setGenerator('dialog', dialogGenerator);
};