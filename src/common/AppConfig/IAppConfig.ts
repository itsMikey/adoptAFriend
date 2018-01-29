export interface IAppConfig {
    app: {
        alexa: {
            appId: string;
        }
        petFinder: {
            apiKey: string;
            url: string;
        };
    }
}