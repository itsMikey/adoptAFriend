
import {IAppConfig} from "../src/common/AppConfig/IAppConfig";

export const testAppConfig: IAppConfig = {
    app: {
        alexa: {
            appId: "dummyId"
        },
        petFinder: {
            apiKey: "dummyKey",
            url: "http://localhost:3000/"
        }
    }
}
