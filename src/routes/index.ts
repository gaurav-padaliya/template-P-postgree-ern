import express from 'express';
import apikey from '../auth/apikey';
import permission from '../helpers/permission';
import { Permission } from '../database/model/ApiKey';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import credential from './access/credential';
import { Database } from '../database';

const database = new Database();
const router = express.Router();

/*---------------------------------------------------------*/
//__________not need for now_________
// router.use(apikey); //encripted key required
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
// router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
console.log('route started');

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/credential', credential);
// router.use('/profile', profile);
// router.use('/blog', blog);
// router.use('/blogs', blogs);

router.use('/example', async (req, res) => {
  console.log('hii');
  const result = await database.query(`
    select * from users`);
  // console.log(result, ' all the users');
  res.send(result);
});

export default router;
