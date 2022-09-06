import express from 'express';
import apikey from '../../auth/apikey';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
router.use('/', apikey);
/*-------------------------------------------------------------------------*/

export default router;
