/**
 * @author Jörn Kreutel
 */
define(["mwf","entities"], function(mwf, entities) {

    function ListviewViewController() {
        console.log("ListviewViewController()");

        // declare a variable for accessing the prototype object (used für super() calls)
        var proto = ListviewViewController.prototype;

        var items = [];

        /*
         * for any view: initialise the view
         */
        var addNewMediaItemElement;
        var resetDatabaseElement;
        var switchDatabase;
        this.oncreate = function (callback) {
            // Listener für create
            this.addListener(new mwf.EventMatcher("crud", "created", "MediaItem"), function(event){
                this.addToListview(event.data);
            }.bind(this));

            // Listener für create
            this.addListener(new mwf.EventMatcher("crud", "updated", "MediaItem"), function(event){
                this.updateInListview(event.data._id, event.data);
            }.bind(this));

            // Listener für Löschen eines Elementes
            this.addListener(new mwf.EventMatcher("crud", "deleted", "MediaItem"), function(event){
                this.removeFromListview(event.data);
            }.bind(this));

            switchDatabase = this.root.querySelector("#switchDatabase");
            switchDatabase.onclick = function() {
                if (this.application.currentCRUDScope=="local")
                    this.application.switchCRUD("remote")
                else
                    this.application.switchCRUD("local");
                // Auslagern in Funktion ???
                entities.MediaItem.readAll(function(items){
                    this.initialiseListview(items);
                }.bind(this));
            }.bind(this);

            entities.MediaItem.readAll(function(items){
                this.initialiseListview(items);
            }.bind(this));

            // TODO: do databinding, set listeners, initialise the view
            addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
            addNewMediaItemElement.onclick = function() {
                this.createNewItem();
            }.bind(this);



            /*
                        resetDatabaseElement = this.root.querySelector("#resetDatabase");
                        resetDatabaseElement.onclick = function() {
                            if (confirm("Soll die Datenbank wirklich gelöscht werden?")) {
                                indexedDB.deleteDatabase("mwftutdb");
                            }
                        }.bind(this);
            */

            this.initialiseListview(items);

            // call the superclass once creation is done
            proto.oncreate.call(this,callback);
        }

        /*
         * for views with listviews: react to the selection of a listitem menu option
         * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
         */
        this.onListItemMenuItemSelected = function(option, listitem, listview) {
            // TODO: implement how selection of option for listitem shall be handled
            proto.onListItemMenuItemSelected.call(this, option,
                listitem, listview);
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

        /*
         * Fuegt ein neues Element hinzu
         */
        this.createNewItem = function(){
            var newItem = new entities.MediaItem("", "http://lorempixel.com/200/200", "plain");
            this.nextView("mediaEditview",{item: newItem});
/*
            this.showDialog("mediaEditviewTemplate", {
                item: newItem,
                actionBindings: {
                    submitForm: function(event){
                        event.original.preventDefault();
                        newItem.create();
                        this.hideDialog();
                    }.bind(this)
                }
            });
*/
        }

        /*
         * Loescht ein Element ohne Nachfrage
         */
        this.deleteItem = function(item){
            item.delete();
        }

        /*
         * Loescht ein Element
         */
        this.askAndDeleteItem = function(item){
            this.showDialog("deleteItemDialog", {
                item: item,
                actionBindings: {
                    submitForm: function(event){
                        event.original.preventDefault();
                        item.delete();
                        this.hideDialog();
                    }.bind(this),
                    cancel: function(event){
                        this.hideDialog();
                    }.bind(this)
                }
            });
        }

        /*
         * Aendert den Namen eines Elementes
         */
 /*       this.editItem = function(item){
            this.showDialog("mediaItemDialog", {
                item: item,
                actionBindings: {
                    submitForm: function(event){
                        event.original.preventDefault();
                        item.update();
                        this.hideDialog();
                    }.bind(this),
                    deleteItem: function(event){
                        this.deleteItem(item);
                        this.hideDialog();
                    }.bind(this)
                }
            });
        }*/

        /*
         * Rückkehr von Subview
         */
 /*       this.onReturnFromSubview = function(subviewid, returnValue, returnStatus, callback) {
            if (subviewid=="mediaReadview" && returnValue.deletedItem) {
                this.removeFromListview(returnValue.deletedItem._id);
            }
            callback();
        }*/
    }

    // extend the view controller supertype
    mwf.xtends(ListviewViewController,mwf.ViewController);

    // and return the view controller function
    return ListviewViewController;
});
