import mongoose from "mongoose";
import { isEmailValid, random } from "../helpers";

interface IUser {
    username: string;
    email: string;
    authentication: {
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
}

const userSchema = new mongoose.Schema<IUser>({
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

userSchema.methods.refreshPreferencesUpdateDate = function () {
    this.lastUpdates.preferences = Date.now();
};

userSchema.methods.refreshRecipesUpdateDate = function () {
    const updateTime = Date.now();
    this.lastUpdates.recipes = updateTime;
    return updateTime;
};

userSchema.methods.refreshMealsUpdateDate = function () {
    const updateTime = Date.now();
    this.lastUpdates.meals = updateTime;
    return updateTime;
};

userSchema.methods.refreshDietsUpdateDate = function () {
    const updateTime = Date.now();
    this.lastUpdates.diets = updateTime;
    return updateTime;
};

userSchema.methods.refreshProgramsUpdateDate = function () {
    const updateTime = Date.now();
    this.lastUpdates.programs = updateTime;
    return updateTime;
};

userSchema.methods.refreshTrainingsUpdateDate = function () {
    const updateTime = Date.now();
    this.lastUpdates.trainings = updateTime;
    return updateTime;
};

userSchema.methods.addRecipe = function (recipeId: string) {
    if (!this.ownRecipe(recipeId)) {
        this.recipes.push(new mongoose.Types.ObjectId(recipeId));
        return this.refreshRecipesUpdateDate();
    } else {
        return NaN;
    }
};
userSchema.methods.addMeal = function (mealId: string) {
    if (!this.ownMeal(mealId)) {
        this.meals.push(new mongoose.Types.ObjectId(mealId));
        return this.refreshMealsUpdateDate();
    } else {
        return NaN;
    }
};
userSchema.methods.addDiet = function (dietId: string) {
    if (!this.ownDiet(dietId)) {
        this.diets.push(new mongoose.Types.ObjectId(dietId));
        return this.refreshDietsUpdateDate();
    } else {
        return NaN;
    }
};
userSchema.methods.addProgram = function (programId: string) {
    if (!this.ownProgram(programId)) {
        this.programs.push(new mongoose.Types.ObjectId(programId));
        return this.refreshProgramsUpdateDate();
    } else {
        return NaN;
    }
};
userSchema.methods.addTraining = function (trainingId: string) {
    if (!this.ownTraining(trainingId)) {
        this.trainings.push(new mongoose.Types.ObjectId(trainingId));
        return this.refreshTrainingsUpdateDate();
    } else {
        return NaN;
    }
};

userSchema.methods.removeRecipe = function (recipeId: string) {
    const index = this.recipes.indexOf(recipeId);
    if (index > -1) {
        this.recipes.splice(index, 1);
        return this.refreshRecipesUpdateDate();
    } else {
        return NaN;
    }
};
userSchema.methods.removeMeal = function (mealId: string) {
    const index = this.mels.indexOf(mealId);
    if (index > -1) {
        this.meals.splice(index, 1);
        return this.refreshMealsUpdateDate();
    } else {
        return NaN;
    }
};
userSchema.methods.removeDiet = function (dietId: string) {
    const index = this.diets.indexOf(dietId);
    if (index > -1) {
        this.diets.splice(index, 1);
        return this.refreshDietsUpdateDate();
    } else {
        return NaN;
    }
};
userSchema.methods.removeProgram = function (programId: string) {
    const index = this.programs.indexOf(programId);
    if (index > -1) {
        this.programs.splice(index, 1);
        return this.refreshProgramsUpdateDate();
    } else {
        return NaN;
    }
};
userSchema.methods.removeTraining = function (trainingId: string) {
    const index = this.trainings.indexOf(trainingId);
    if (index > -1) {
        this.trainings.splice(index, 1);
        return this.refreshTrainingsUpdateDate();
    } else {
        return NaN;
    }
};

export const UserModel = mongoose.model<IUser>("User", userSchema);

export const getUsers = () => UserModel.find();
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
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
    new UserModel(values).save();
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);
export const updateUserById = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values);
