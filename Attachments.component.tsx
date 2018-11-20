// Пример глупого компонента, который только отрисовывает себя и не занимается обработкой или получением данных

import * as React from "react";
import i18n from "../../../common/I18n";
import Icon from "../Icon.component";
import ObjectInfo from "../../../model/objects-info/ObjectInfo";
import { GalleryOptions } from "../../../model/Gallery";
import { Attachment, StatusAttachment } from "../../../model/objects-info/Attachment";
import helpers from "../../../common/Helpers";
import * as ReactDropzone from "react-dropzone";
const Dropzone = (ReactDropzone as any).default;
import { imageMimeTypesString } from "../../../constants/mimeTypes";
import { CollapseComponent } from "../../../../../src/common/components/Collapse.component";

export interface ComponentProps {
    editMode: boolean;
    attachments: Attachment[];
    registerId: string;
    object: ObjectInfo;
    urlAttachMap: Map<string, string>;
    galleryInit: (items: any[], options?: GalleryOptions) => void;
    uploadFiles: (files: File[]) => void;
    deleteFile: (a: Attachment) => void;
    getImg: (img: Attachment) => JSX.Element;
    getFile: (attach: Attachment, url: string) => void;
}



export class AttachmentsComponent extends React.PureComponent<ComponentProps, null> {

    private objectWrapperClass = `${helpers.gpPrefix}object-files`;

    private load: boolean = false;

    private getUrl = (a: Attachment): string => {
        if (a.status === StatusAttachment.CREATE) return `/uploads/${a.guid}`;
        return `/api/registers/${this.props.registerId}/model/${this.props.object.entityType}` +
            `/objects/${this.props.object.getPropertyValue("id")}/attachments/${a.guid}`;
    }
    private showGallery = (start: number) => {
        let images = this.props.attachments.filter(a => a.isImage);
        let items = images.map(image => {
            return <div className={`${helpers.gpPrefix}object-gallery-item`}>
                {this.props.getImg(image)}
                <p><a href={this.props.urlAttachMap.get(image.guid)} target="_blank" download={image.name}>
                    <Icon type={`download`} />
                    {image.name}
                </a></p>
            </div>;
        });
        let objectWrapperClass = `${helpers.gpPrefix}object-files`,
            objectThumbClass = `${objectWrapperClass}__thumb`;
        let pages = images.map((image: Attachment, index: number) => {
            return <div key={image.guid} className={objectThumbClass}
                onClick={this.showGallery.bind(this, images, index)}>
                {this.props.getImg(image)}
            </div>;
        });
        this.props.galleryInit(items, { start, pages });
    }
    private getImages = (attachments: Attachment[], editMode: boolean): JSX.Element[] => {
        if (!attachments.length) return null;
        let images: JSX.Element[] = [];
        attachments.forEach((a: Attachment, index: number) => {
            if (!a.isImage) return null;
            let image;
            if (editMode) {
                image = (
                    <div key={a.md5 + index}
                        className={`${this.objectWrapperClass}__thumb`}>
                        <div className={`${this.objectWrapperClass}__wrapper`}>
                            <div className={`${this.objectWrapperClass}__layer ${this.objectWrapperClass}--opaque`}></div>
                            <div className={`${this.objectWrapperClass}__layer`}> <Icon onClick={() => this.props.deleteFile(a)} className={`${this.objectWrapperClass}__layer-icon`} type={`trash`} /></div>
                        </div>
                        {this.props.getImg(a)}
                    </div>
                );
            } else {
                image = (
                    <div key={a.md5 + index}
                        className={`${this.objectWrapperClass}__thumb`}
                        onClick={() => this.showGallery(index)}>
                        {this.props.getImg(a)}
                    </div>
                );
            }
            images.push(image);
        });
        return images;
    }
    private downloadFile = (a: Attachment): void => {
        const file = this.props.urlAttachMap.get(a.guid);
        if (file && this.load) {
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = file;
            link.setAttribute("download", a.name);
            if (typeof link.download === "undefined") {
                link.setAttribute("target", "_blank");
            }
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.load = false;
            return null;
        }
        return null;
    }

    private requestFile = (a: Attachment) => {
        this.load = true;
        const file = this.props.urlAttachMap.get(a.guid);
        if (!file) {
            this.props.getFile(a, this.getUrl(a));
        } else {
            this.downloadFile(a);
        }
    }

    private getFiles = (attachments: Attachment[], editMode: boolean): JSX.Element[] => {
        if (!attachments.length) return null;
        let files: JSX.Element[] = [];
        attachments.forEach((a: Attachment, index: number) => {
            if (a.isImage) return null;
            let file;
            if (editMode) {
                file = (
                    <div key={a.md5 + index} className={`${this.objectWrapperClass}__file ${this.objectWrapperClass}__file--edit`}>
                        {this.downloadFile(a)}
                        <div>
                            <Icon type={`file`} className={`${this.objectWrapperClass}__fileicon`} />
                            <a className={`${this.objectWrapperClass}__link`} onClick={() => this.requestFile(a)} target="_blank"
                                download="true">{a.name}</a>
                        </div>
                        <Icon type={`trash`} className={`${this.objectWrapperClass}__fileicon ${this.objectWrapperClass}__fileicon--remove`} onClick={() => this.props.deleteFile(a)} />

                    </div>
                );
            } else {
                file = (
                    <div key={a.md5 + index} className={`${this.objectWrapperClass}__file`}>
                        {this.downloadFile(a)}
                        <Icon type={`file`} className={`${this.objectWrapperClass}__fileicon`} />
                        <a className={`${this.objectWrapperClass}__link`} onClick={() => this.requestFile(a)} target="_blank"
                            download="true">{a.name}</a>
                    </div>
                );
            }
            files.push(file);
        });
        return files;
    }
    private content = (attachments: Attachment[], editMode: boolean): JSX.Element => {
        let addImages, addFiles, labelPhoto, labelFiles: JSX.Element;
        if ((attachments.length && attachments.some(a => a.isImage) || editMode)) {
            labelPhoto = <label className={`${helpers.gpPrefix}object__section-header`}>{i18n.getValue("objectsInfo.photo")}</label>;
        }
        if ((attachments.length && attachments.some(a => !a.isImage) || editMode)) {
            labelFiles = <label className={`${helpers.gpPrefix}object__section-header`}>{i18n.getValue("objectsInfo.files")}</label>;
        }
        if (editMode) {
            addImages = (
                <div className={`${this.objectWrapperClass}__thumb`}>
                    <Dropzone onDrop={this.props.uploadFiles} className={`${this.objectWrapperClass}__image ${this.objectWrapperClass}__button-add-image`} accept={imageMimeTypesString}>
                        +
                     </Dropzone>
                </div>
            );
            addFiles = (
                <div className={`${this.objectWrapperClass}__files-dropzone`}>
                    <Dropzone onDrop={this.props.uploadFiles} className={`btn btn--round button--hoverable`}>
                        {i18n.getValue("objectsInfo.addFiles")}
                    </Dropzone>
                </div>
            );
        }
        const imageContent = (addImages: JSX.Element) => {
            return (
                <div className={`${this.objectWrapperClass}-images-section`}>
                    {this.getImages(attachments, editMode)}
                    {addImages}
                </div>
            );
        };

        const filesContent = (addFiles: JSX.Element) => {
            return (
                <div >
                    {this.getFiles(attachments, editMode)}
                    {addFiles}
                </div>
            );
        };

        return (<div>
            <div className="form-group--topline">
                <CollapseComponent
                    className={`${helpers.gpPrefix}object-collapse`}
                    control={labelPhoto}
                    content={imageContent(addImages)}
                />
            </div>
            <div className="form-group--topline">
                <CollapseComponent
                    className={`${helpers.gpPrefix}object-collapse`}
                    control={labelFiles}
                    content={filesContent(addFiles)}
                />
            </div>
        </div>);
    }
    render() {
        return (
            this.content(this.props.attachments, this.props.editMode)
        );
    }
}