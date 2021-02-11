import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application, Folder, knownFolders, path } from "@nativescript/core";
import { ImageSource } from "@nativescript/core/image-source";
import { ImagePicker } from "@nativescript/imagepicker";
import { AwsMobile } from "@nspluginadd/nativescript-aws-mobile";

const folder: Folder = <Folder>knownFolders.currentApp();
const folderPath: string = path.join(folder.path, "images/background.png");
const imageFromLocalFile: ImageSource = ImageSource.fromFileOrResourceSync(
    folderPath
);

@Component({
    selector: "Search",
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {


    imageAssets = [];
    imageSrc: any;
    isSingleMode: boolean = true;
    thumbSize: number = 80;
    previewSize: number = 300;

    public message: string;
    public downloadProgress = 0;
    public uploadProgress = 0;
    public uploadCompleted = false;
    public imageDownload = "";
    public key = "images/background.png";
    public src = ``;
    public status = "";
    uploadingFileID;
    downloadingFileID;

    public list = [];


    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }



    public onSelectMultipleTap() {
        this.isSingleMode = false;
        let context = new ImagePicker({
            mode: "multiple", // use "multiple" for multiple selection
        });

        this.startSelection(context);
    }

    public onSelectSingleTap() {
        this.isSingleMode = true;
        let context = new ImagePicker({
            mode: "single", // use "multiple" for multiple selection
        });

        this.startSelection(context);
    }

    private startSelection(context) {
        let that = this;

        context
            .authorize()
            .then(() => {
                that.imageAssets = [];
                that.imageSrc = null;
                return context.present();
            })
            .then((selection) => {
                console.log("Selection done: " + JSON.stringify(selection));
                that.imageSrc =
                    that.isSingleMode && selection.length > 0 ? selection[0] : null;

                // set the images to be loaded from the assets with optimal sizes (optimize memory usage)
                selection.forEach(function (element) {
                    element.options.width = that.isSingleMode
                        ? that.previewSize
                        : that.thumbSize;
                    element.options.height = that.isSingleMode
                        ? that.previewSize
                        : that.thumbSize;
                });

                that.imageAssets = selection;
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    uploadFile() {
        const s = AwsMobile.s3;
        this.uploadCompleted = false;
        this.uploadProgress = 0;

        const tempFile = path.join(knownFolders.currentApp().path, this.key);
        console.log("TempFile", tempFile);
        this.uploadingFileID = s.createUpload({
            file: `~/${this.key}`,
            key: `public/${this.key}`,
            //acl: 'public-read',
            completed: (error, success) => {
                if (error) {
                    console.log(`Upload Failed :-> ${error.message}`);
                }
                if (success) {
                    console.log(`Upload Complete :-> ${success.path}`);
                    this.uploadCompleted = true;
                }
            },
            progress: (progress) => {
                console.log(
                    `Upload Progress : ${progress.value} Status: ${progress.status}`
                );
                this.uploadProgress = progress.value;
                this.status = progress.status;
            },
        });
    }

    async downloadFile() {
        this.downloadProgress = 0;

        const tempFile = path.join(knownFolders.currentApp().path, this.key);
        console.log("TempFile", tempFile);
        const s = AwsMobile.s3;
        this.downloadingFileID = s.createDownload({
            file: tempFile,
            bucketName: "my-temp123456789",
            key: `public/${this.key}`,
            completed: (error, success) => {
                if (error) {
                    console.log(`Download Failed :-> ${error.message}`);
                }
                if (success) {
                    console.log(`Download Complete :-> ${success.path}`, this.src);
                    this.src = `${success.path}`;
                    console.log("src path", this.src);
                }
            },
            progress: (progress) => {
                console.log(
                    `Download Progress : ${progress.value} Status: ${progress.status}`
                );
                this.downloadProgress = progress.value;
                this.status = progress.status;
            },
        });
    }
}
