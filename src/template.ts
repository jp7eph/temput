import { v4 as uuidv4 } from "uuid";

export class Template {
    readonly id: string;
    name: string;
    value: string;

    constructor() {
        this.id = uuidv4();
        this.name = '';
        this.value = '';
    }
}
