const express = require('express');
const router = express.Router();

function extractRequestInfo(req) {
    return {
        method: req.method,
        hostname: req.hostname,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl,
        path: req.path,
        protocol: req.protocol,
        params: req.params,
        query: req.query,
        body: req.body,
        cookies: req.cookies,
        fresh: req.fresh,
        ip: req.ip,
        xhr: req.xhr,
        headers: req.headers,
    }
}

// CORS
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// router.use('/api/json', function (req, res) {
//     res.json({
//         success: !req.query.error,
//         data: extractRequestInfo(req)
//     });
// });

router.use('/api/json/success', function (req, res) {
    res.json({success: true, data: {name: 'wdzxc'}});
});

router.use('/api/jsonp/success', function (req, res) {
    res.jsonp({
        success: true,
        data: {
            callback: req.query.callback,
            headers: req.headers,
        }
    });
});

router.use('/api/jsonp/error', function (req, res) {
    res.send('reject jsonp format!');
});

router.use('/api/json/fail', function (req, res) {
    res.json({success: false, msg: 'server error'});
});

router.use('/api/json/user', function (req, res) {
    res.json({
        success: true,
        data: extractRequestInfo(req),
    });
});

router.use('/api/text', function (req, res) {
    res.send('text');
});

router.post('/api/post', function (req, res) {
    res.json({success: true, data: req.body});
});
router.put('/api/put', function (req, res) {
    res.json({success: true, data: req.body});
});

router.use('/api/multiResponse', function (req, res) {
    res.format({
        'text/plain': function () {
            res.send('hey');
        },
        'text/html': function () {
            res.send('<p>hey</p>');
        },
        'application/json': function () {
            res.send({message: 'hey'});
        },
        'default': function () {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
        }
    });
});

router.use('/api/requestMethod', function (req, res) {
    res.json({success: true});
});

let counter = 0;
router.get('/api/json/index', function (req, res) {
    setTimeout(() => {
        res.json({
            data: {
                counter: counter++,
                index: req.query.index,
                delay: req.query.delay,
            },
            success: !req.query.error,
        });
    }, +req.query.delay || 1);
});

router.use('/api/404', function (req, res) {
    res.status(404).send('Not Found (+_+)?');
});

router.use('/api/pathParams/*', function (req, res) {
    res.json({
        success: true,
        data: {
            baseUrl: req.baseUrl,
        }
    })
});

module.exports = router;