const router = require('express').Router();
const{register,login,setavatar,allusers} = require('../Controllers/userControllers');

router.post('/register',register);
router.post('/login',login);
router.post('/setavatar/:id',setavatar);
router.get('/allusers/:id',allusers)

module.exports = router;
     