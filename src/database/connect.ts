import { Sequelize } from "sequelize";
import logger from "@/utils/logger";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database{
    db: Sequelize;
    
    constructor()
    {
        this.db = new Sequelize({
            dialect: 'sqlite',
            storage: './database.sqlite'
        });
    }

    public async init(){
        await this.connect();
        await this.loadModels();
        await this.db.sync();
    }

    public async getModels(){
        return this.db.models;
    }

    public async close(){
        try{
            await this.db.close();
            logger.info({
                message: "DB: Connection closed"
            })
        }catch(err){
            logger.error({
                message: "DB: Error closing connection",
                object: err
            })
        }
    }

    private async loadModels(){
        try{
            const modelsDir = path.resolve(__dirname, './models');
            fs.readdirSync(modelsDir)
                .filter(file => file.endsWith('.ts'))
                .forEach(async (file) => {
                    const model = (await import(path.join(modelsDir, file))).default;
                    await model.initialize(this.db);
                    logger.info({
                        message: `DB: Loaded model ${file}`,
                    })
                });
        }catch(err){
            console.log(err);
            logger.error({
                message: "DB: Error loading models",
                object: err
            })
        }
    }

    private async connect(){
        try {
            await this.db.authenticate();
            console.log('Connection has been established successfully.');
        } catch (err) {
            logger.error({
                message: "DB: Error connecting to database",
                object: err
            })
        }
    }
}

export default Database;