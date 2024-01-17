import express from 'express'

import aliments from './aliments';
import authentication from './authentication';
import diets from './diets';
import exercises from './exercises';
import meals from './meals';
import muscle_groups from './muscle_groups';
import muscles from './muscles';
import preferences from './preferences';
import programs from './programs';
import recipes from './recipes';
import trainings from './trainings';
import users_data from './users_data';
import users from './users';

const router = express.Router();

export default (): express.Router => {
    aliments(router);
    authentication(router);
    diets(router);
    exercises(router);
    meals(router);
    muscle_groups(router);
    muscles(router);
    preferences(router);
    programs(router);
    recipes(router);
    trainings(router);
    users_data(router);
    users(router);

    return router;
};