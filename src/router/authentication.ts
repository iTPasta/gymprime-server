import express from 'express';

import { login, register, validate, askValidation } from '../controllers/authentication';

export default (router: express.Router) => {
    router.post('/register', register);
    router.post('/login', login);
    router.get('/validate/:secret', validate);
    router.put('/validate', askValidation);
}