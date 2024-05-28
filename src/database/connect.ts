import { Options, Sequelize } from "sequelize";
import logger from "@/utils/logger";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database{
    db: Sequelize;
    name: string;
    
    constructor(name:string, options:Options){
        this.name = name;
        this.db = new Sequelize(options);
    }

    public async init(modelsDir: string = './models'){
        await this.connect();
        await this.loadModels(modelsDir);
        await this.db.sync();
    }

    public async close(){
        try{
            await this.db.close();
            logger.info({
                message: `DB ${this.name}: Connection closed`
            })
        }catch(err){
            logger.error({
                message: `DB ${this.name}: Error closing connection`,
                object: err
            })
        }
    }

    public async getModels(){
        console.log(this.db.models);
    }

    private async loadModels(md:string){
        try{
            const modelsDir = path.join(__dirname, md);
            const files = fs.readdirSync(modelsDir)
                .filter(file => file.endsWith('.ts'));

            for (const file of files) {
                const model = await import(path.join(modelsDir, file));
                model.init(this.db);
                logger.info({
                    message: `DB ${this.name}: Loaded model ${file}`,
                })
            }
        }catch(err){
            console.log(err);
            logger.error({
                message: `DB ${this.name}: Error loading models`,
                object: err
            })
        }
    }

    private async connect(){
        try {
            await this.db.authenticate();
            logger.success({
                message: `DB ${this.name}: Connection established`
            })
        } catch (err) {
            logger.error({
                message: `DB ${this.name}: Error connecting to database`,
                object: err
            })
        }
    }
}

export default Database;