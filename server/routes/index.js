module.exports = function (app) {
    app.use('/', require('./content'));
    app.use('/page2', require('./page2'));
};
