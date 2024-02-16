# Details

Date : 2024-02-05 19:49:47

Directory /home/kilian/gymprime-project/gymprime-server

Total : 50 files,  5706 codes, 250 comments, 697 blanks, all 6653 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [Dockerfile](/Dockerfile) | Docker | 10 | 0 | 0 | 10 |
| [README.md](/README.md) | Markdown | 1 | 0 | 1 | 2 |
| [distant-tests.rest](/distant-tests.rest) | HTTP | 109 | 78 | 61 | 248 |
| [docker-compose.yml](/docker-compose.yml) | YAML | 20 | 0 | 3 | 23 |
| [local-tests.rest](/local-tests.rest) | HTTP | 113 | 81 | 64 | 258 |
| [nodemon.json](/nodemon.json) | JSON | 5 | 0 | 0 | 5 |
| [package-lock.json](/package-lock.json) | JSON | 2,621 | 0 | 1 | 2,622 |
| [package.json](/package.json) | JSON | 37 | 0 | 1 | 38 |
| [src/controllers/aliments.ts](/src/controllers/aliments.ts) | TypeScript | 141 | 0 | 21 | 162 |
| [src/controllers/authentication.ts](/src/controllers/authentication.ts) | TypeScript | 178 | 0 | 39 | 217 |
| [src/controllers/datas.ts](/src/controllers/datas.ts) | TypeScript | 157 | 1 | 35 | 193 |
| [src/controllers/diets.ts](/src/controllers/diets.ts) | TypeScript | 150 | 0 | 43 | 193 |
| [src/controllers/exercises.ts](/src/controllers/exercises.ts) | TypeScript | 98 | 0 | 21 | 119 |
| [src/controllers/meals.ts](/src/controllers/meals.ts) | TypeScript | 280 | 0 | 81 | 361 |
| [src/controllers/muscle_groups.ts](/src/controllers/muscle_groups.ts) | TypeScript | 96 | 0 | 20 | 116 |
| [src/controllers/muscles.ts](/src/controllers/muscles.ts) | TypeScript | 98 | 0 | 20 | 118 |
| [src/controllers/preferences.ts](/src/controllers/preferences.ts) | TypeScript | 8 | 0 | 3 | 11 |
| [src/controllers/programs.ts](/src/controllers/programs.ts) | TypeScript | 170 | 0 | 43 | 213 |
| [src/controllers/recipes.ts](/src/controllers/recipes.ts) | TypeScript | 156 | 0 | 40 | 196 |
| [src/controllers/trainings.ts](/src/controllers/trainings.ts) | TypeScript | 167 | 0 | 44 | 211 |
| [src/controllers/users.ts](/src/controllers/users.ts) | TypeScript | 11 | 0 | 3 | 14 |
| [src/db/aliments.ts](/src/db/aliments.ts) | TypeScript | 56 | 0 | 6 | 62 |
| [src/db/diets.ts](/src/db/diets.ts) | TypeScript | 26 | 0 | 6 | 32 |
| [src/db/exercises.ts](/src/db/exercises.ts) | TypeScript | 63 | 0 | 6 | 69 |
| [src/db/meals.ts](/src/db/meals.ts) | TypeScript | 68 | 0 | 8 | 76 |
| [src/db/muscle_groups.ts](/src/db/muscle_groups.ts) | TypeScript | 61 | 0 | 6 | 67 |
| [src/db/muscles.ts](/src/db/muscles.ts) | TypeScript | 65 | 0 | 7 | 72 |
| [src/db/programs.ts](/src/db/programs.ts) | TypeScript | 86 | 0 | 7 | 93 |
| [src/db/recipes.ts](/src/db/recipes.ts) | TypeScript | 57 | 0 | 7 | 64 |
| [src/db/trainings.ts](/src/db/trainings.ts) | TypeScript | 51 | 0 | 6 | 57 |
| [src/db/users.ts](/src/db/users.ts) | TypeScript | 265 | 0 | 20 | 285 |
| [src/helpers/error.ts](/src/helpers/error.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/helpers/index.ts](/src/helpers/index.ts) | TypeScript | 36 | 0 | 7 | 43 |
| [src/index.ts](/src/index.ts) | TypeScript | 27 | 0 | 10 | 37 |
| [src/middlewares/index.ts](/src/middlewares/index.ts) | TypeScript | 40 | 0 | 15 | 55 |
| [src/router/aliments.ts](/src/router/aliments.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/router/authentication.ts](/src/router/authentication.ts) | TypeScript | 8 | 0 | 2 | 10 |
| [src/router/datas.ts](/src/router/datas.ts) | TypeScript | 14 | 0 | 3 | 17 |
| [src/router/diets.ts](/src/router/diets.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/router/exercises.ts](/src/router/exercises.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [src/router/index.ts](/src/router/index.ts) | TypeScript | 31 | 0 | 5 | 36 |
| [src/router/meals.ts](/src/router/meals.ts) | TypeScript | 15 | 0 | 2 | 17 |
| [src/router/muscle_groups.ts](/src/router/muscle_groups.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/router/muscles.ts](/src/router/muscles.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/router/preferences.ts](/src/router/preferences.ts) | TypeScript | 6 | 0 | 2 | 8 |
| [src/router/programs.ts](/src/router/programs.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/router/recipes.ts](/src/router/recipes.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/router/trainings.ts](/src/router/trainings.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/router/users.ts](/src/router/users.ts) | TypeScript | 6 | 0 | 2 | 8 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 11 | 90 | 9 | 110 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)