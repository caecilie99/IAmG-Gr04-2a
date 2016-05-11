/**
 * @author Jörn Kreutel
 *
 * this skript defines the data types used by the application and the model operations for handling instances of the latter
 */

/*
 * a global counter for ids
 */
define(["mwfUtils", "EntityManager"], function (mwfUtils, EntityManager) {


    // MediaItem Entity
    function MediaItem(name, src, contentType) {
        // Name
        this.name = name;
        // Beschreibung
        this.description;
        // Datum
        this.added = Date.now();
        // URL
        this.src = src;
        // Content Typ
        this.contentType = contentType;
        // Bereitstellung des Content
        this.contentProvision;
        this.instantiateManagedAttributes();

    }
    Object.defineProperty(MediaItem.prototype, "addedDateString", {
        get: function () {
            alert("Irgendwas");
            return (new Date(this.added)).toLocaleDateString();
        }
    });

    Object.defineProperty(MediaItem.prototype, "mediaType", {
        get: function () {
            if (this.contentType) {
                var index = this.contentType.indexOf("/");
                if (index > -1) {
                    return this.contentType.substring(0, index);
                }
                else {
                    return "UNKNOWN";
                }
            }
            else {
                return "UNKNOWN";
            }
        }
    });

    // use EntityManager.xtends in order to add entity-specific behaviour
    EntityManager.xtends(MediaItem, EntityManager.Entity);

    // TODO-REPEATED: do not forget to export all type declarations
    return {
        MediaItem: MediaItem
    }

});
