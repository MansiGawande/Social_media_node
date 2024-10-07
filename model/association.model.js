import Likes from "./likes.model.js";
import Post from "./post.model.js";
import Profile from "./profile.model.js";
import User from "./user.model.js";
import Comment from "./comment.model.js";


console.log("Association Executed....................................................................................................................................................................................");

User.hasOne(Profile, { foreignKey: 'user_id' ,allowNull: false});
Profile.belongsTo(User, { foreignKey: 'user_id' ,allowNull: false, unique: true });

Profile.hasMany(Post,{foreignKey: 'profile_id' ,allowNull: false});
Post.belongsTo(Profile,{foreignKey: 'profile_id' ,allowNull: false});

Profile.hasMany(Likes,{foreignKey:'profile_id',allowNull:false});
Likes.belongsTo(Profile,{foreignKey:'profile_id',allowNull:false});

Post.hasMany(Likes, { foreignKey: 'post_id', allowNull: false });
Likes.belongsTo(Post,{foreignKey:'post_id',allowNull:false});

Post.hasMany(Comment,{foreignKey:'post_id', allowNull:false});
Comment.belongsTo(Post,{foreignKey:'post_id', allowNull:false})

Profile.hasMany(Comment,{foreignKey:'profile_id',allowNull:false});
Comment.belongsTo(Profile,{foreignKey:'profile_id',allowNull:false});

export {User,Profile,Post,Likes,Comment};
