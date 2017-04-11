module.exports = function (app) {
    app.use('/', require('./content'));
    app.use('/cms', require('./cms'));
};
