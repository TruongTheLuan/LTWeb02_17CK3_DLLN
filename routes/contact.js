const { Router } = require('express');

var router = new Router();
router.get('/', (req, res)=>{
    res.render('contact');
});

module.exports = router;