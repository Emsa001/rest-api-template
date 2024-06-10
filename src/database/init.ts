import { Options, Sequelize } from "sequelize";
import logger from "@/utils/logger";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
    private loadedModels = new Set<string>();
    public db: Sequelize;
    public name: string;

    constructor(name: string, options: Options) {
        this.name = name;
        this.db = new Sequelize(options);
    }

    public async sync() {
        try {
            await this.db.authenticate();
            logger.success({
                message: `DB ${this.name}: Connection established`,
            });
            await this.db.sync();
        } catch (err) {
            logger.error({
                message: `DB ${this.name}: Error connecting to database`,
                object: err,
            });
        }
    }

    public async load(f: string) {
        const file = f.endsWith(".ts") ? f : `${f}.ts`;
        try {
            const modelDir = path.join(__dirname, file);
            const model = await import(path.join(modelDir));
            await model.init(this.db);
            this.loadedModels.add(file.split("/")[file.split("/").length - 1]);

            return logger.info({
                message: `DB ${this.name}: Loaded model ${file}`,
            });
        } catch (err) {
            logger.error({
                message: `DB ${this.name}: Error loading model ${file}`,
                object: err,
            });
            console.log(err);
        }
    }

    public async loadAll(md: string) {
        try {
            const modelsDir = path.join(__dirname, md);
            const files = fs.readdirSync(modelsDir).filter((file) => file.endsWith(".ts"));
    
            for (const file of files) {
                if (!this.loadedModels.has(file)) {
                    const model = await import(path.join(modelsDir, file));
                    await model.init(this.db);
                    this.loadedModels.add(file);
                    logger.info({
                        message: `DB ${this.name}: Loaded model ${file}`,
                    });
                }
            }
        } catch (err) {
            logger.error({
                message: `DB ${this.name}: Error loading models`,
                object: err,
            });
            console.log(err);
        }
    }

    public async close() {
        try {
            await this.db.close();
            logger.info({
                message: `DB ${this.name}: Connection closed`,
            });
        } catch (err) {
            logger.error({
                message: `DB ${this.name}: Error closing connection`,
                object: err,
            });
        }
    }
}

export default Database;
