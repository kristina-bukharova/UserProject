import { Pool } from 'pg';
import { IDatabaseClient } from './IDatabaseClient';
import { UserDetails } from '../routes/controllers/userController';

export default class PostgresDatabaseClient implements IDatabaseClient {
    private pool: Pool;
    private tableName: string = "user_info";

    constructor(private config: any) {
        this.pool = new Pool(this.config);
    }

    public async getUserInfo(id: string) {
        try {
            const results = await this.pool.query(`SELECT * from ${this.tableName} WHERE id = $1`, [id]);
            if (results.rows.length !== 0) {
                return results.rows[0];
            }
            return null;
        } catch (err) {
            throw new Error(`Failed to retrieve record: ${err.message}`);
        }
    }

    public async createNewUser(userDetails: UserDetails): Promise<number> {
        try {
            const results = await this.pool.query(`INSERT INTO ${this.tableName}(id, first_name, last_name, biography_title) VALUES($1, $2, $3, $4) RETURNING id`,
                [userDetails.id, userDetails.firstName, userDetails.lastName, userDetails.biographyTitle]);
            return results.rows[0].id;
        } catch (err) {
            throw new Error(`Failed to insert new record: ${err.message}`);
        }
    }
}
