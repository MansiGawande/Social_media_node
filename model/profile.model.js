import { DataTypes } from "sequelize";
import sequelize from "../database/dbConfig.js";
import User from "./user.model.js";

const Profile = sequelize.define('profile',{
    profile_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING(100),
        allowNull:false,
        validate: {
            notEmpty: true,
            is: /^[a-zA-Z\s]+$/i, 
        },
    },
    email:{
        type:DataTypes.STRING(100),
        allowNull:false,    
        unique:true,
        validate: {
            notEmpty: true,
            len: [3, 30], 
        },
    },
    bio:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    is_active: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    profileImg_URL: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    user_id:{
        type : DataTypes.INTEGER,
        allowNull: false,
        unique:true
    },
    customCreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    customUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, 
  {sequelize,
  timestamps: false}
);

sequelize.sync()
    .then(() => {
        console.log("Profile table created....");
    }).catch(err => {
        console.log("Error during create table..", err)
    });
    export default Profile;