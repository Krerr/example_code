// Пример модели данных приложений к объекту используемых на клиенте

import { deserialize } from "cerialize";
import Helpers from "../../common/Helpers";
import { imageMimeTypes } from "../../constants/mimeTypes";

export enum StatusAttachment {
    CREATE = "CREATE",
    SAME = "SAME",
    DELETE = "DELETE",
}
export class Attachment {
    @deserialize public guid: string;
    @deserialize public name: string;
    @deserialize public size: number;
    @deserialize public md5: string;
    @deserialize public createDate: string;
    @deserialize public createUser: string;
    @deserialize public status: StatusAttachment;

    constructor(att?: any) {
        if (att) {
            this.guid = att.guid || "";
            this.name = att.name || "";
            this.size = att.size || 0;
            this.md5 = att.md5 || "";
            this.createDate = att.createDate || "";
            this.createUser = att.createUser || "";
            this.status = att.status || StatusAttachment.SAME;
        }
    }

    public get isImage() {
        if (this.name && this.name.length > 0) {
            let ext = Helpers.getFileExtension(this.name);
            if (ext && ext.length > 0) {
                return imageMimeTypes.some(e => e === `.${ext.toLowerCase()}`);
            }
        }
        return false;
    }
}