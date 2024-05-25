import { Model, DataTypes, Sequelize } from 'sequelize';

class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public name!: string;
    public email!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static initialize(sequelize: Sequelize) {
        User.init({
            id: {
                type: DataTypes.INTEGER, // you can define any type you want here: INTEGER, TEXT, BOOLEAN, etc.
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            email: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            }
        }, {
            tableName: 'users',
            sequelize, // this bit is important
        });
    }
}

export default User;