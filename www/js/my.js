/**
 * Created by marty on 24.06.16.
 */
function fileSelected() {
console.log("WO BIN ICH ??");
    // get selected file element
    var oFile = document.getElementById("src").files[0];

    console.log("oFile: " + oFile.type);

    /*
     // filter for image files

     var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
     if (! rFilter.test(oFile.type)) {
     document.getElementById('error').style.display = 'block';
     return;
     }
     */

    if(oFile.type.match(/^video\/.*$/)) {
        // get preview element
        console.log("video entdeckt");
        var videoTag = document.getElementById("prevvideo");
        var oImage = document.getElementById("prevvideoSRC");
        oImage.type = oFile.type;
        videoTag.setAttribute("class","mwf-left-align");
        document.getElementById("previmg1").setAttribute("class","mwf-idle");
    }
    else{
        // get preview element
        console.log("image entdeckt");
        var oImage = document.getElementById("previmg1");
        oImage.setAttribute("class","mwf-left-align");
        document.getElementById("prevvideo").setAttribute("class","mwf-idle");
    }

    // prepare HTML5 FileReader
    var oReader = new FileReader();
    oReader.onload = function(e){
        console.log("HIER ??");
        // e.target.result contains the DataURL which we will use as a source of the image
        oImage.src = e.target.result;
        oImage.onload = function () { // binding onload event
            // we are going to display some custom image information here
        };
    };

    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
}
