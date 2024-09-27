import Post from "./post.model.js";
import Profile from "./profile.model.js";
import User from "./user.model.js";

console.log("Association Executed....................................................................................................................................................................................");

User.hasOne(Profile, { foreignKey: 'user_id' ,allowNull: false});
Profile.belongsTo(User, { foreignKey: 'user_id' ,allowNull: false, unique: true });

Profile.hasMany(Post,{foreignKey: 'profile_id' ,allowNull: false});
Post.belongsTo(Profile,{foreignKey: 'profile_id' ,allowNull: false});


export {User,Profile,Post};