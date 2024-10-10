import { DataTypes } from "sequelize";
import sequelize from "../database/dbConfig.js";

const Follow = sequelize.define("follow", {
    follow_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
         primaryKey: true,
        autoIncrement: true,
    },
    follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    followed_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1  // follow
    }
}, {
    sequelize,
    timestamps: true
});
sequelize.sync()
    .then(() => {
        console.log("Follow table created...")
    }).catch((err) => {
        console.log("Error in Follow table...", err);
    })

export default Follow;