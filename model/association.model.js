import Likes from "./likes.model.js";
import Post from "./post.model.js";
import Profile from "./profile.model.js";
import User from "./user.model.js";
import Comment from "./comment.model.js";
import Follow from "./follow.model.js";
import Message from "./message.model.js";


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

Profile.hasMany(Follow, { foreignKey: 'follower_id', allowNull: false });
Follow.belongsTo(Profile, { foreignKey: 'follower_id', allowNull: false }); //as: 'Follower' 
// A profile can follow many other profile.
// A profile can also be followed by many profiles.

Profile.hasMany(Follow, { foreignKey: 'followed_id', allowNull: false });
Follow.belongsTo(Profile, { foreignKey: 'followed_id', allowNull: false}); //as: 'Followed' 

Profile.hasMany(Message, { foreignKey: 'sender_id', allowNull: false });
Message.belongsTo(Profile, { foreignKey: 'sender_id', allowNull: false, as: 'Sender' });

Profile.hasMany(Message, { foreignKey: 'receiver_id', allowNull: false });
Message.belongsTo(Profile, { foreignKey: 'receiver_id', allowNull: false, as: 'Receiver' });

export {User,Profile,Post,Likes,Comment,Follow,Message};
