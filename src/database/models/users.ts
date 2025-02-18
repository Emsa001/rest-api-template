import { Model, DataTypes, Sequelize } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class Users extends Model {
    declare id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare balance: number;

    static hashPassword(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    comparePassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }

    generateToken() {
        if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET not found in environment variables.");

        const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return token;
    }

    static decodeToken(token: string) {
        if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET not found in environment variables.");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded;
    }
}

const init = (sequelize: Sequelize) => {
    Users.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            balance: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: 0,
            }
        },
        { sequelize }
    );
};

export { Users, init };
