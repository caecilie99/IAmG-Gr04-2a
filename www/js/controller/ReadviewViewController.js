/**
 * @author Jörn Kreutel
 */
define(["mwf","entities"], function(mwf, entities) {

    function ReadviewViewController() {
        console.log("ReadviewViewController()");

        // declare a variable for accessing the prototype object (used für super() calls)
        var proto = ReadviewViewController.prototype;

        /*
         * for any view: initialise the view
         */
        var viewProxy;
        this.oncreate = function (callback) {
            // TODO: do databinding, set listeners, initialise the view
            var mediaItem = this.args.item;
            viewProxy = this.bindElement('mediaReadviewTemplate', {item: mediaItem}, this.root).viewProxy;
            viewProxy.bindAction("deleteItem", function(){
                mediaItem.delete(function () {
                    //this.notifyListeners(new mwf.Event("crud", "deleted", "MediaItem", mediaItem._id));
                    this.previousView();
                }.bind(this))
            }.bind(this));

            // Wechsel in Editieransicht
            viewProxy.bindAction("editMediaItem", function(){
                this.nextView("mediaEditview",{item: mediaItem});
            }.bind(this));

            // we add an event listener that listens to updates of Note items
            this.addListener(new mwf.EventMatcher("crud","updated","MediaItem"),function(event){
                viewProxy.update(this.args);
            });
            // we add another listener that will be executed also onpause and that marks the current controller as obsolete if an item has been deleted
            // (this is for skipping this view in case we run delete from the editview)
            this.addListener(new mwf.EventMatcher("crud","deleted","MediaItem"),function(event){
                // check whether the event that is updated is identical to our one (if for whatever reason this was possible...)
                this.markAsObsolete();
                /* this is the runOnPause parameter */
            },true);

            // call the superclass once creation is done
            proto.oncreate.call(this,callback);
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
    mwf.xtends(ReadviewViewController,mwf.ViewController);

    // and return the view controller function
    return ReadviewViewController;
});
