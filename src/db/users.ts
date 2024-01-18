import mongoose from "mongoose";

interface IUser {
    email: string,
    authentication: {
        password: string,
        salt: string,
        sessionToken?: string
    },
    admin: boolean,
    createdAt: Date,
    last_update: Date,
    preferences: {
        theme: string
    },
    recipes: mongoose.Types.ObjectId[],
    meals: mongoose.Types.ObjectId[],
    diets: mongoose.Types.ObjectId[],
    programs: mongoose.Types.ObjectId[],
    trainings: mongoose.Types.ObjectId[]
}

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, lowercase: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, select: false },
        sessionToken: { type: String, required: false, select: false }
    },
    admin: { type: Boolean, default: () => false },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    last_update: { type: Date, default: () => Date.now() },
    preferences: {
        theme: { type: String, default : () => "system" }
    },
    recipes: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Recipe", required: true }],
        default: () => []
    },
    meals: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Meal", required: true }],
        default: () => []
    },
    diets: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Diet", required: true }],
        default: () => []
    },
    programs: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Program", required: true }],
        default: () => []
    },
    trainings: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Training", required: true }],
        default: () => []
    }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken
});
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save();
export const deleteUserById = (id: string) => UserModel.findOneAndDelete( {_id: id} );
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id,  { $set: values } );

export const refreshLastUpdate = (id: string) => UserModel.findByIdAndUpdate(id, { last_update: Date.now() } );

export const addUserRecipe = (user_id: string, recipe_id: mongoose.Types.ObjectId) => UserModel.findByIdAndUpdate(
    user_id, { $push: { recipes: recipe_id }
});
export const removeUserRecipe = (user_id: string, recipe_id: string) => UserModel.findByIdAndUpdate(
    user_id, { $pullAll: { recipes: recipe_id }
});
export const addUserMeal = (user_id: string, meal_id: mongoose.Types.ObjectId) => UserModel.findByIdAndUpdate(
    user_id, { $push: { meals: meal_id }
});
export const removeUserMeal = (user_id: string, meal_id: string) => UserModel.findByIdAndUpdate(
    user_id, { $pullAll: { meals: meal_id }
});
export const addUserDiet = (user_id: string, diet_id: mongoose.Types.ObjectId) => UserModel.findByIdAndUpdate(
    user_id, { $push: { diets: diet_id }
});
export const removeUserDiet = (user_id: string, diet_id: string) => UserModel.findByIdAndUpdate(
    user_id, { $pullAll: { diets: diet_id }
});
export const addUserProgram = (user_id: string, program_id: mongoose.Types.ObjectId) => UserModel.findByIdAndUpdate(
    user_id, { $push: { programs: program_id }
});
export const removeUserProgram = (user_id: string, program_id: string) => UserModel.findByIdAndUpdate(
    user_id, { $pullAll: { programs: program_id }
});
export const addUserTraining = (user_id: string, training_id: mongoose.Types.ObjectId) => UserModel.findByIdAndUpdate(
    user_id, { $push: { trainings: training_id }
});
export const removeUserTraining = (user_id: string, training_id: string) => UserModel.findByIdAndUpdate(
    user_id, { $pullAll: { trainings: training_id }
});