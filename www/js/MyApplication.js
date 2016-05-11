/**
 * Created by master on 17.02.16.
 */
define(["mwf","mwfUtils","EntityManager","entities","GenericCRUDImplLocal","GenericCRUDImplRemote"],function(mwf,mwfUtils,EntityManager,entities,GenericCRUDImplLocal,GenericCRUDImplRemote){

    function MyApplication() {

        var proto = MyApplication.prototype;

        this.oncreate = function(callback) {
            console.log("MyApplication.oncreate(): calling supertype oncreate")

            // first call the supertype method and pass a callback
            proto.oncreate.call(this,function() {

                // initialise the local database
                // TODO-REPEATED: add new entity types to the array of object store names
                GenericCRUDImplLocal.initialiseDB("mwftutdb", 1, ["MediaItem"], function () {

                    //// TODO-REPEATED: if entity manager is used, register entities and crud operations for the entity types
                    this.registerEntity("MediaItem", entities.MediaItem, true);
                    this.registerCRUD("MediaItem", this.CRUDOPS.LOCAL, GenericCRUDImplLocal.newInstance("MediaItem"));
                    this.registerCRUD("MediaItem", this.CRUDOPS.REMOTE, GenericCRUDImplRemote.newInstance("MediaItem"));

                    // THIS MUST NOT BE FORGOTTEN: initialise the entity manager!
                    EntityManager.initialise();

                    // TODO: do any further application specific initialisations here
                    // activate the local crud operations
                    this.initialiseCRUD(this.CRUDOPS.LOCAL, EntityManager);

                    // do not forget to call the callback
                    callback();
                }.bind(this));


            }.bind(this));

        }

    }

    mwf.xtends(MyApplication,mwf.Application);

    var instance = new MyApplication();

    return instance;

});