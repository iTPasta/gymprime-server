import mongoose from "mongoose";
import { indexOfObjectId, isEmailValid, random } from "../helpers";

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    authentication?: {
        password: string;
        salt: string;
        sessionToken?: string;
    };
    admin: boolean;
    createdAt: number;
    accountValidation?: { secret: string; expiration: number };
    lastUpdates: {
        preferences: number;
        recipes: number;
        meals: number;
        diets: number;
        programs: number;
        trainings: number;
    };
    preferences: {
        theme: string;
    };
    recipes: mongoose.Types.ObjectId[];
    meals: mongoose.Types.ObjectId[];
    diets: mongoose.Types.ObjectId[];
    programs: mongoose.Types.ObjectId[];
    trainings: mongoose.Types.ObjectId[];

    ownRecipe(recipeId: string): boolean;
    ownMeal(recipeId: string): boolean;
    ownDiet(recipeId: string): boolean;
    ownProgram(recipeId: string): boolean;
    ownTraining(recipeId: string): boolean;

    refreshPreferencesLastUpdate(): number;
    refreshRecipesLastUpdate(): number;
    refreshMealsLastUpdate(): number;
    refreshDietsLastUpdate(): number;
    refreshProgramsLastUpdate(): number;
    refreshTrainingsLastUpdate(): number;

    addRecipe(recipeId: string): number;
    addMeal(mealId: string): number;
    addDiet(dietId: string): number;
    addProgram(programId: string): number;
    addTraining(trainingId: string): number;

    removeRecipe(recipeId: string): number;
    removeMeal(mealId: string): number;
    removeDiet(dietId: string): number;
    removeProgram(programId: string): number;
    removeTraining(trainingId: string): number;
}

interface IUserModel extends mongoose.Model<IUser> {}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: isEmailValid,
            message: "{VALUE} is not a correct email.",
        },
    },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, select: false },
        sessionToken: { type: String, required: false, select: false },
        required: false,
        select: false,
    },
    admin: { type: Boolean, default: () => false },

    createdAt: { type: Number, immutable: true, default: () => Date.now() },
    accountValidation: {
        expiration: {
            type: Number,
            default: () => Date.now() + 600000,
            required: true,
        },
        secret: { type: String, default: () => random(), required: true },
        required: false,
        select: false,
    },

    lastUpdates: {
        preferences: {
            type: Number,
            default: () => new Date(1),
            required: true,
        },
        recipes: { type: Number, default: () => new Date(1), required: true },
        meals: { type: Number, default: () => new Date(1), required: true },
        diets: { type: Number, default: () => new Date(1), required: true },
        programs: { type: Number, default: () => new Date(1), required: true },
        trainings: { type: Number, default: () => new Date(1), required: true },
        required: true,
    },
    preferences: {
        theme: { type: String, default: () => "system" },
    },
    recipes: {
        type: [
            { type: mongoose.Types.ObjectId, ref: "Recipe", required: true },
        ],
        default: () => [],
    },
    meals: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Meal", required: true }],
        default: () => [],
    },
    diets: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Diet", required: true }],
        default: () => [],
    },
    programs: {
        type: [
            { type: mongoose.Types.ObjectId, ref: "Program", required: true },
        ],
        default: () => [],
    },
    trainings: {
        type: [
            { type: mongoose.Types.ObjectId, ref: "Training", required: true },
        ],
        default: () => [],
    },
});

userSchema.methods.ownRecipe = function (recipeId: string) {
    return this.recipes.some(
        (userRecipeId: mongoose.Types.ObjectId) =>
            userRecipeId.toString() === recipeId
    ) as boolean;
};

userSchema.methods.ownMeal = function (mealId: string) {
    return this.meals.some(
        (userMealId: mongoose.Types.ObjectId) =>
            userMealId.toString() === mealId
    ) as boolean;
};

userSchema.methods.ownDiet = function (dietId: string) {
    return this.diets.some(
        (userDietId: mongoose.Types.ObjectId) =>
            userDietId.toString() === dietId
    ) as boolean;
};

userSchema.methods.ownProgram = function (programId: string) {
    return this.programs.some(
        (userProgramId: mongoose.Types.ObjectId) =>
            userProgramId.toString() === programId
    ) as boolean;
};

userSchema.methods.ownTraining = function (trainingId: string) {
    return this.meals.some(
        (userTrainingId: mongoose.Types.ObjectId) =>
            userTrainingId.toString() === trainingId
    ) as boolean;
};

userSchema.methods.refreshPreferencesLastUpdate = function () {
    const updateTime = Date.now();
    this.lastUpdates.preferences = updateTime;
    return updateTime;
};

userSchema.methods.refreshRecipesLastUpdate = function () {
    const updateTime = Date.now();
    this.lastUpdates.recipes = updateTime;
    return updateTime;
};

userSchema.methods.refreshMealsLastUpdate = function () {
    const updateTime = Date.now();
    this.lastUpdates.meals = updateTime;
    return updateTime;
};

userSchema.methods.refreshDietsLastUpdate = function () {
    const updateTime = Date.now();
    this.lastUpdates.diets = updateTime;
    return updateTime;
};

userSchema.methods.refreshProgramsLastUpdate = function () {
    const updateTime = Date.now();
    this.lastUpdates.programs = updateTime;
    return updateTime;
};

userSchema.methods.refreshTrainingsLastUpdate = function () {
    const updateTime = Date.now();
    this.lastUpdates.trainings = updateTime;
    return updateTime;
};

userSchema.methods.addRecipe = function (recipeId: string) {
    if (indexOfObjectId(this.recipes, recipeId) !== -1)
        throw Error(
            `Recipe '${recipeId}' already possessed by '${this.email}'.`
        );
    this.recipes.push(new mongoose.Types.ObjectId(recipeId));
    return this.refreshRecipesLastUpdate();
};
userSchema.methods.addMeal = function (mealId: string) {
    if (indexOfObjectId(this.meals, mealId) !== -1)
        throw Error(`Meal '${mealId}' already possessed by '${this.email}'.`);
    this.meals.push(new mongoose.Types.ObjectId(mealId));
    return this.refreshMealsLastUpdate();
};
userSchema.methods.addDiet = function (dietId: string) {
    if (indexOfObjectId(this.diets, dietId) !== -1)
        throw Error(`Diet '${dietId}' already possessed by '${this.email}'.`);
    this.diets.push(new mongoose.Types.ObjectId(dietId));
    return this.refreshDietsLastUpdate();
};
userSchema.methods.addProgram = function (programId: string) {
    if (indexOfObjectId(this.programs, programId) !== -1)
        throw Error(
            `Program '${programId}' already possessed by '${this.email}'.`
        );
    this.programs.push(new mongoose.Types.ObjectId(programId));
    return this.refreshProgramsLastUpdate();
};
userSchema.methods.addTraining = function (trainingId: string) {
    if (indexOfObjectId(this.trainings, trainingId) !== -1)
        throw Error(
            `Training '${trainingId}' already possessed by '${this.email}'.`
        );
    this.trainings.push(new mongoose.Types.ObjectId(trainingId));
    return this.refreshTrainingsLastUpdate();
};

userSchema.methods.removeRecipe = function (recipeId: string) {
    const index = indexOfObjectId(this.recipes, recipeId);
    if (index === -1)
        throw Error(`Recipe '${recipeId}' not possessed by '${this.email}'.`);
    this.recipes.splice(index, 1);
    return this.refreshRecipesLastUpdate();
};
userSchema.methods.removeMeal = function (mealId: string) {
    const index = indexOfObjectId(this.meals, mealId);
    if (index === -1)
        throw Error(`Meal '${mealId}' not possessed by '${this.email}'.`);
    this.meals.splice(index, 1);
    return this.refreshMealsLastUpdate();
};
userSchema.methods.removeDiet = function (dietId: string) {
    const index = indexOfObjectId(this.diets, dietId);
    if (index === -1)
        throw Error(`Diet '${dietId}' not possessed by '${this.email}'.`);
    this.diets.splice(index, 1);
    return this.refreshDietsLastUpdate();
};
userSchema.methods.removeProgram = function (programId: string) {
    const index = indexOfObjectId(this.programs, programId);
    if (index === -1)
        throw Error(`Program '${programId}' not possessed by '${this.email}'.`);
    this.programs.splice(index, 1);
    return this.refreshProgramsLastUpdate();
};
userSchema.methods.removeTraining = function (trainingId: string) {
    const index = indexOfObjectId(this.trainings, trainingId);
    if (index === -1)
        throw Error(
            `Training '${trainingId}' not possessed by '${this.email}'.`
        );
    this.trainings.splice(index, 1);
    return this.refreshTrainingsLastUpdate();
};

export const UserModel = mongoose.model<IUser, IUserModel>("User", userSchema);

export const getUsers = () => UserModel.find();

export const checkUserExistenceById = (id: string | mongoose.Types.ObjectId) =>
    UserModel.exists({ _id: id });

export const checkUserExistenceByEmail = (email: string) =>
    UserModel.exists({ email: email });

export const checkUserExistenceByUsername = (username: string) =>
    UserModel.exists({ username: username });

export const checkUserExistenceBySessionToken = (sessionToken: string) =>
    UserModel.exists({
        "authentication.sessionToken": sessionToken,
    });

export const checkUserExistenceByValidationSecret = (secret: string) =>
    UserModel.exists({ "accountValidation.secret": secret });

export const getUserById = (id: string | mongoose.Types.ObjectId) =>
    UserModel.findById(id);

export const getUserByEmail = (email: string) =>
    UserModel.findOne({ email: email });

export const getUserByUsername = (username: string) =>
    UserModel.findOne({ username: username });

export const getUserBySessionToken = (sessionToken: string) =>
    UserModel.findOne({
        "authentication.sessionToken": sessionToken,
    });

export const getUserByValidationSecret = (secret: string) =>
    UserModel.findOne({ "accountValidation.secret": secret });

export const createUser = (values: Record<string, any>) =>
    new UserModel(values).save();

export const deleteUserById = (id: string | mongoose.Types.ObjectId) =>
    UserModel.findByIdAndDelete(id);

export const updateUserById = (
    id: string | mongoose.Types.ObjectId,
    values: Record<string, any>
) => UserModel.findByIdAndUpdate(id, values);
