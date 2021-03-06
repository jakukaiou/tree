//TODO vagrant起動時にすぐDBが起動しているようにする
//TODO vagrant起動時にすぐnode.jsサーバーが起動しているようにする

var express = require('express'),
    path = require('path'),
    consolidate = require('consolidate');

var isDev = process.env.NODE_ENV !== 'production';
var app = express();
var port = 3000;

var router = express.Router();

// DBへの接続
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/treeAPI');

app.engine('html', consolidate.ejs);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './server/views'));

// local variables for all views
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;

//cdnlib add
app.use('/cdnlib',express.static(path.join(__dirname, 'cdnlib')));

if (isDev) {

    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.config.js');

    var compiler = webpack(webpackDevConfig);

    // attach to the compiler & the server
    app.use(webpackDevMiddleware(compiler, {

        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));

    require('./server/routes')(app);
    require('./server/apis')(router);
    app.use('/api', router);

    // add "reload" to express, see: https://www.npmjs.com/package/reload
    var reload = require('reload');
    var http = require('http');

    var server = http.createServer(app);
    reload(server, app);

    server.listen(port, function(){
        console.log('App (dev) is now running on port 3000!');
    });
} else {

    // static assets served by express.static() for production
    app.use(express.static(path.join(__dirname, 'public')));
    require('./server/routes')(app);
    require('./server/apis')(router);
    app.use('/api', router);
    app.listen(port, function () {
        console.log('App (production) is now running on port 3000!');
    });
}
