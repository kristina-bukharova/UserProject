import axios from "axios";

export default class ToneAPI {
    constructor(private endpoint: string) {
    }

    public async getTone(): Promise<string> {
        try {
            const result = await axios.get(this.endpoint + "/tone");
            if (!result.data.tone) {
                throw new Error("Tone API response is invalid.");
            }
            return result.data.tone;
        } catch (err) {
            throw new Error(`Could not retrieve tone from Tone API. ${err.message}.`);
        }
    }
}
