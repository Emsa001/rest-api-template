import { Sequelize } from "sequelize";

class Database{
    db: Sequelize;
    
    constructor()
    {
        this.db = new Sequelize({
            dialect: 'sqlite',
            storage: './database.sqlite'
        });
    }

    public async connect(){
        try {
            await this.db.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

}

export default Database;