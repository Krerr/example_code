// Пример умного компонента, который получает и отдает данные в store redux, инициализирует запросы к серверу


import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../reducers/Reducer";
import { Attachment, StatusAttachment } from "../../model/objects-info/Attachment";
import { GalleryOptions } from "../../model/Gallery";
import { galleryInit } from "../../actions/gallery.actions";
import ObjectInfo from "../../model/objects-info/ObjectInfo";
import { AttachmentsComponent } from "../../components/widgets/objects-info/Attachments.component";
import { uploadFileAction, deleteFileAction, loadAttachAction, clearAttach } from "../../actions/object.actions";
import BaseComponent from "../../components/BaseComponent";
import ObjectsApi from "../../api/ObjectsApi";
import { ImgConnected } from "../Img.container";

interface ComponentProps {
    editMode: boolean;
    attachments: Attachment[];
    registerId: string;
    object: ObjectInfo;
    urlAttachMap: Map<string, string>;
    galleryInit: (items: any[], options?: GalleryOptions) => void;
    deleteFile: (api: ObjectsApi, attach: Attachment) => void;
    clearAttach: () => void;
}

const mapStateToProps = (state: State) => ({
    editMode: state.object.editMode,
    attachments: state.object.attachments,
    registerId: state.object.registerId,
    object: state.object.item,
    urlAttachMap: state.object.attachBlobs,
});
const mapDispatchToProps = (dispatch: Function) => ({
    galleryInit: (items: any[], options?: GalleryOptions) =>
        dispatch(galleryInit(items, options)),
    deleteFile: (api: ObjectsApi, attach: Attachment) => deleteFileAction(api, attach),
    clearAttach: () => dispatch(clearAttach()),
});

export class AttachmentsContainer extends BaseComponent<ComponentProps, null> {

    componentWillUnmount() {
        this.props.clearAttach();
    }

    private uploadFile = (files: File[]) => {
        files.forEach(file => uploadFileAction(this.context.app.api.objectsApi, file));
    }

    private deleteFile = (attach: Attachment) => {
        this.props.deleteFile(this.context.app.api.objectsApi, attach);
    }

    private getImg = (img: Attachment): JSX.Element => {
        if (img.status === StatusAttachment.CREATE) return <ImgConnected guid={img.guid} url={`/uploads/${img.guid}`} className="catalog-images-list__item-img" />;
        return (
            <ImgConnected guid={img.guid} url={`/api/registers/${this.props.registerId}/model/${this.props.object.entityType}/objects/
                        ${this.props.object.getPropertyValue("id")}/attachments/${img.guid}`} className="catalog-images-list__item-img" />
        );
    }
    private getFile = (file: Attachment, url: string) => {
        if (!this.props.urlAttachMap.get(file.guid)) {
            loadAttachAction(this.context.app.api.objectsApi, file.guid, url);
        }
    }

    render() {
        return (
            <AttachmentsComponent
                editMode={this.props.editMode}
                attachments={this.props.attachments}
                registerId={this.props.registerId}
                object={this.props.object}
                galleryInit={this.props.galleryInit}
                uploadFiles={this.uploadFile}
                deleteFile={this.deleteFile}
                getImg={this.getImg}
                urlAttachMap={this.props.urlAttachMap}
                getFile={this.getFile}
            />
        );
    }
}
export const AttachmentsContainerConnected = connect(mapStateToProps, mapDispatchToProps)(AttachmentsContainer);