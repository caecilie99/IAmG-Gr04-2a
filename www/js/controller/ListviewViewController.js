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
        this.oncreate = function (callback) {
            entities.MediaItem.readAll(function(items){
                this.initialiseListview(items);
            }.bind(this));

            // TODO: do databinding, set listeners, initialise the view
            addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
            addNewMediaItemElement.onclick = function() {
                this.createNewItem();
            }.bind(this);

            resetDatabaseElement = this.root.querySelector("#resetDatabase");
            resetDatabaseElement.onclick = function() {
                if (confirm("Soll die Datenbank wirklich gelöscht werden?")) {
                    indexedDB.deleteDatabase("mwftutdb");
                }
            }.bind(this);

            this.initialiseListview(items);

            // call the superclass once creation is done
            proto.oncreate.call(this,callback);
        }


        /*
         * for views with listviews: react to the selection of a listitem
         * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
         */
        this.onListItemSelected = function(listitem,listview) {
            // TODO: implement how selection of listitem shall be handled
            alert("Element " + listitem.name + listitem._id +  " wurde ausgewählt!");
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
            var newItem = new entities.MediaItem("m", "http://lorempixel.com/50/50");
            newItem.create(function(){
                this.addToListview(newItem);
            }.bind(this));
        }

        /*
         * Loescht ein Element
         */
        this.deleteItem = function(item){
            item.delete(function(){
                this.removeFromListview(item._id);
            }.bind(this));
        }

        /*
         * Aendert den Namen eines Elementes
         */
        this.editItem = function(item){
            item.name=item.name+item.name;
            item.update(function(){
                this.updateInListview(item._id, item);
            }.bind(this));
        }
    }

    // extend the view controller supertype
    mwf.xtends(ListviewViewController,mwf.ViewController);

    // and return the view controller function
    return ListviewViewController;
});
