/**
 * @author Jörn Kreutel
 */
define(["mwf","entities", "GenericCRUDImplRemote"], function(mwf, entities, GenericCRUDImplRemote) {

    function EditviewViewController() {
        console.log("EditviewViewController()");

        // declare a variable for accessing the prototype object (used für super() calls)
        var proto = EditviewViewController.prototype;

        /*
         * for any view: initialise the view
         */
        var viewProxy;
        this.oncreate = function (callback) {
            // TODO: do databinding, set listeners, initialise the view
            var mediaItem = this.args.item;
            viewProxy = this.bindElement('mediaEditviewTemplate', {item: mediaItem, scope:this.application.currentCRUDScope}, this.root).viewProxy;

            viewProxy.bindAction("deleteItem", function(){
                mediaItem.delete(function () {
                    this.previousView();
                }.bind(this))
            }.bind(this));

            viewProxy.bindAction("changeFile", function(){
                this.fileSelected();
            }.bind(this));

            viewProxy.bindAction("setRadioEnv", function(){
                if(document.getElementById("imageURL").checked){
                    document.getElementById("previmg1").setAttribute("src","http://lorempixel.com/200/200");
                    document.getElementById("previmg1").classList.remove("mwf-idle");
                    document.getElementById("prevvideo1").classList.add("mwf-idle");
                }else{
                    document.getElementById("previmg1").classList.add("mwf-idle");
                    document.getElementById("prevvideo1").classList.remove("mwf-idle");
                }
            }.bind(this));

            viewProxy.bindAction("submitForm", function(event){
                event.original.preventDefault();

                if(document.getElementById("imageURL").checked){
                    console.log(mediaItem.src);
                    if (mediaItem.created)
                        mediaItem.update();
                    else
                        mediaItem.create();
                }else{
                    console.log("Upload");
                    crudops = GenericCRUDImplRemote.newInstance("MediaItem");
                    filetoupload = document.getElementById("src").files[0];
                    if (mediaItem.created)
                        crudops.persistMediaContent(mediaItem, "src", filetoupload, function(item){
                            item.update();
                        });
                    else
                        crudops.persistMediaContent(mediaItem, "src", filetoupload, function(item){
                            item.create();
                        });

                }

                this.previousView();
            }.bind(this));

            if(document.getElementById("imageURL").checked){
                document.getElementById("imageURL").setAttribute("checked","checked");
            }else{
                document.getElementById("imageUpload").setAttribute("checked","checked");
            }
            // Setze Mediainhalt abhängig von Typ
            this.setMediaElement(mediaItem);

            // call the superclass once creation is done
            proto.oncreate.call(this,callback);
        }

        this.fileSelected = function() {
            console.log("WO BIN ICH ??");

            // get selected file element
            var oFile = document.getElementById("src").files[0];

            console.log("oFile: " + oFile.type);

            if (oFile.type.match(/^video\/.*$/)) {
                // get preview element
                console.log("video entdeckt");

                var videoTag = document.getElementById("prevvideo1");
                var oImage = document.getElementById("prevvideoSRC");
                oImage.type = oFile.type;
                videoTag.classList.remove("mwf-idle");

                document.getElementById("previmg1").classList.add("mwf-idle");
            }
            else {
                // get preview element
                console.log("image entdeckt");
                var oImage = document.getElementById("previmg1");
                oImage.classList.remove("mwf-idle");
                document.getElementById("prevvideo1").classList.add("mwf-idle");
            }

            // prepare HTML5 FileReader
            var oReader = new FileReader();
            oReader.onload = function (e) {
                console.log("HIER ??");
                // e.target.result contains the DataURL which we will use as a source of the image
                oImage.src = e.target.result;
                if(oImage.type.match(/^video\/.*$/)) {
                    document.getElementById('prevvideo1').load();
                }
            };
            // read selected file as DataURL
            oReader.readAsDataURL(oFile);
        }// end of fucntion

        this.setMediaElement = function(mediaItem){
            if (mediaItem.mediaType=='image'){
                this.root.getElementsByTagName("img")[0].src = mediaItem.src;
                document.getElementById("prevvideo1").classList.add("mwf-idle");
            }
            if (mediaItem.mediaType=='video'){
                this.root.getElementsByTagName("video")[0].src = mediaItem.src;
                document.getElementById("previmg1").classList.add("mwf-idle");
            }
        }
        /*
         * for views with listviews: bind a list item to an item view
         * TODO: delete if no listview is used or if databinding uses ractive templates
         */
        this.bindListItemView = function (viewid, itemview, item) {
            // TODO: implement how attributes of item shall be displayed in itemview

        }

        /*
         * for views with listviews: react to the selection of a listitem
         * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
         */
        this.onListItemSelected = function(listitem,listview) {
            // TODO: implement how selection of listitem shall be handled
        }

        /*
         * for views with listviews: react to the selection of a listitem menu option
         * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
         */
        this.onListItemMenuItemSelected = function(option, listitem, listview) {
            // TODO: implement how selection of option for listitem shall be handled
        }

        /*
         * for views with dialogs
         * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
         */
        this.bindDialog = function(dialogid,dialog,item) {
            // call the supertype function
            proto.bindDialog.call(this,dialogid,dialog,item);
            // TODO: implement action bindings for dialog, accessing dialog.root
        }


    }

    // extend the view controller supertype
    mwf.xtends(EditviewViewController,mwf.ViewController);

    // and return the view controller function
    return EditviewViewController;
});
