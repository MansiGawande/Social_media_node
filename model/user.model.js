import { DataTypes } from "sequelize";
import sequelize from "../database/dbConfig.js";
import bcrypt from "bcryptjs"

const User = sequelize.define("user",{
    user_id:{
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
            is: /^[a-zA-Z\s]+$/i, // only letters and spaces
        },
        
    },
    username:{
        type:DataTypes.STRING(100),
        allowNull:false,    
        unique:true,
        validate: {
            notEmpty: true,
            len: [3, 30], 
        },
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        set(value){
            let saltkey = bcrypt.genSaltSync(10);
           let encryptedPassword = bcrypt.hashSync(value,saltkey);
           console.log("encryptedPassword: ",encryptedPassword);
           this.setDataValue("password",encryptedPassword);    
        },
         validate: {
            notEmpty: true,
            len: [8, 100], // minimum 8 characters
        },
    }
})
    User.checkPassword = (originalPassword,encryptedPassword)=>{     // password decrypt
    console.log("CheckPassword called");
    return bcrypt.compareSync(originalPassword,encryptedPassword);
    }
    

sequelize.sync()
.then(()=>{
    console.log("User table created successfully: ");
}).catch((err)=>{
    console.log("Error during create table..",err)
})
export default User;