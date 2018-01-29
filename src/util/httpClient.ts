
import axios from "axios";
import { IRequest } from "../common/interfaces/httpClient/IHttpClient";

const responseBody = (res: any) => res.data;
const err = (promiseErr: Error) => promiseErr;

class HttpClient {

    public parameterize(req: IRequest): string {
        let baseUrl = req.url + "?";

        for (const param in req.params) {
            if (req.params[param]) {
                if (baseUrl[baseUrl.length - 1] !== "?") {
                    baseUrl += "&";
                }
                baseUrl += `${param}=${req.params[param]}`;
            }
        }
        return baseUrl;
    }

    public doGet(req: IRequest) {
        if (req.params) {
            req.url = this.parameterize(req);
        }
        
        return axios.get(req.url, { headers: req.headers })
            .then(responseBody).catch(err);

    }

    public doPost(req: IRequest) {
        if (req.params) {
            req.url = this.parameterize(req);
        }
        return axios.post(req.url, req.args, { headers: req.headers })
            .then(responseBody).catch(err);
    }
}

export const httpClient = new HttpClient();
