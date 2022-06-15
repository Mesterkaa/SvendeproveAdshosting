import { ILicense, License } from "../models/license";

export class LicenseService {
    /**
     * Gets all licenses stored in the database.
     * @returns All licenses.
     */
    async getAllLicense(): Promise<ILicense[]> {
        return await License.find({});
    }
}
