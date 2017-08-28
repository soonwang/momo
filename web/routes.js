const router = require('express').Router();
const NetworkService = require('../lib/network/index');
const MockRule = require('../lib/mock/index');
const AnyProxy = require('../lib/proxy/index');

router.get('/api/getBody', function(req, res, next) {
    const id = req.query.id;
    if (!id) return res.send("代理服务器：请求参数不合法！");
    const body = NetworkService.returnBody({
        id
    });
    res.send(body);
});
router.get('/api/getRule', function(req, res, net) {
    res.json(MockRule.getRule());
});


module.exports = router;
