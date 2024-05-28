import { Model, DataTypes, Sequelize } from "sequelize";

class Users extends Model {
    declare id: number;
    declare name: string;
    declare email: string;
}

const init = (sequelize: Sequelize) => {
    Users.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { sequelize }
    );
};

export { Users, init };
