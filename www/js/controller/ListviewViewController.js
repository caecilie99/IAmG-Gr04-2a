/**
 * @author Jörn Kreutel
 */
define(["mwf", "entities"], function (mwf, entities) {

    function ListviewViewController() {
        console.log("ListviewViewController()");

        // declare a variable for accessing the prototype object (used für super() calls)
        var proto = ListviewViewController.prototype;
        var items = [
            new entities.MediaItem("m1", "http://lorempixel.com/100/100"),
            new entities.MediaItem("m2", "http://lorempixel.com/200/150"),
            new entities.MediaItem("m3", "http://lorempixel.com/150/200")
        ];
        var addNewMediaItemElement;
        var resetDatabaseElement;

        /*
         * for any view: initialise the view
         */
        this.oncreate = function (callback) {
            // TODO: do databinding, set listeners, initialise the view

            this.initialiseListview(items);

            addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
            addNewMediaItemElement.onclick = function () {
                //      crudops.create(new entities.MediaItem("m", "http://lorempixel.com/50/50"), function (created) {
                //          this.addToListview(created);
                //      }.bind(this));
                this.createNewItem();
            }.bind(this);

            resetDatabaseElement = this.root.querySelector("#resetDatabase");
            resetDatabaseElement.onclick = function () {
                if (confirm("Soll die Datenbank wirklich zurückgesetzt werden?")) {
                    indexedDB.deleteDatabase("mwftutdb");
                }
            }.bind(this);

            entities.MediaItem.readAll(function (items) {
                this.initialiseListview(items);
            }.bind(this));

           // this.addListener(new mwf.EventMatcher("crud", "deleted", "MediaItem"), function (event) {
           //     this.removeFromListview(event.data);
           // }.bind(this));


            this.addListener(new mwf.EventMatcher("crud", "created", "MediaItem"), function (event) {
                this.addToListview(event.data);
            }.bind(this));
            this.addListener(new mwf.EventMatcher("crud", "updated", "MediaItem"), function (event) {
                this.updateInListview(event.data._id, event.data);
            }.bind(this));
            this.addListener(new mwf.EventMatcher("crud", "deleted", "MediaItem"), function (event) {
                this.removeFromListview(event.data);
            }.bind(this));

        // call the superclass once creation is done
        proto.oncreate.call(this, callback);
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    // this.onListItemSelected = function (listitem, listview) {
    // TODO: implement how selection of listitem shall be handled
    //alert("Element " + listitem.name + listitem._id + " wurde ausgewählt!");
    //     this.nextView("mediaReadview",{item:listitem});
    // }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    this.onListItemMenuItemSelected = function (option, listitem, listview) {
        // TODO: implement how selection of option for listitem shall be handled
        proto.onListItemMenuItemSelected.call(this, option, listitem, listview);
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    this.bindDialog = function (dialogid, dialog, item) {
        // call the supertype function
        proto.bindDialog.call(this, dialogid, dialog, item);
        // TODO: implement action bindings for dialog, accessing dialog.root
    }


    this.deleteItem = function (item) {
        item.delete(function () {
        //    this.removeFromListview(item._id);
        }.bind(this));
    }


//        this.editItem = function (item) {
//            item.name = (item.name + item.name);
//            item.update(function () {
//                this.updateInListview(item._id, item);
//            }.bind(this));
//        }


    this.editItem = function (item) {
        this.showDialog("mediaItemDialog", {
            item: item, actionBindings: {
                submitForm: function (event) {
                    event.original.preventDefault();
                    item.update(function () {
                    //    this.updateInListview(item._id, item);
                    }.bind(this));
                    this.hideDialog();
                }.bind(this)
                , /*!!!*/
               deleteItem: function (event) {
                    this.deleteItem(item);
                    this.hideDialog();
                }.bind(this)
            }
        });
    }


//        this.createNewItem = function() {
//            var newItem = new entities.MediaItem("m","http://lorempixel.com/50/50");
//            newItem.create(function(){
//                this.addToListview(newItem);
//            }.bind(this));
//        }


    this.createNewItem = function () {
        var newItem = new entities.MediaItem("", "http://lorempixel.com/50/50");
        this.showDialog("mediaItemDialog", {
            item: newItem,
            actionBindings: {
                submitForm: function (event) {
                    event.original.preventDefault();
                    newItem.create(function () {
                      //  this.addToListview(newItem);
                    }.bind(this));
                    this.hideDialog();
                }.bind(this)
            }
        });
    }

    this.onReturnFromSubview = function (subviewid, returnValue, returnStatus, callback) {
        if (subviewid == "mediaReadview" && returnValue && returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id);
        }
        callback();
    }
}

// extend the view controller supertype
mwf.xtends(ListviewViewController, mwf.ViewController);

// and return the view controller function
return ListviewViewController;
})
;
