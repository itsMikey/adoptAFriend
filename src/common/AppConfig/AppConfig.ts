import { IAppConfig } from "./IAppConfig";
import {testAppConfig} from "../../../test/testAppConfig";

export const APP_CONFIG: IAppConfig = (process.env.NODE_ENV === "test") ? testAppConfig : JSON.parse(JSON.stringify(process.env.APP_CONFIG));