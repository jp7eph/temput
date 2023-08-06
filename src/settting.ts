import PackageJson from "../package.json"
import { Template } from "./template";

export class Setting {
    version: string;
    templates: Template[];

    constructor() {
        this.version = PackageJson.version;
        this.templates = [];
    }
}
