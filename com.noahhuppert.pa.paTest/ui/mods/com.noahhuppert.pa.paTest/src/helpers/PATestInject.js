/* Create "namespace" */
var PATest = {};
PATest.helpers = {};
PATest.helpers.inject = {};

PATest.helpers.inject.files = {};

/* Setup file locations */
PATest.helpers.inject.files.js = [ "src/helpers/PATestNamespace.js", "src/core/PATestMain.js" ];
PATest.helpers.inject.files.css = [ "src/core/css/PATest.css" ];
PATest.helpers.inject.files.couiModPath = "coui://ui/mods/com.noahhuppert.pa.paTest/";

//Since this is a global function, it is likely that files might be double injected. To prevent this we will keep track of all the already injected files
PATest.helpers.inject.files.injected = [];


/* Actions */
PATest.helpers.inject.injectFile = function(fileLocation, type){
  var realPath = PATest.helpers.inject.files.couiModPath + fileLocation;

  if(PATest.helpers.inject.files.injected.indexOf(realPath) == -1){//Only inject if file hasn't been injected
    switch(type){
      case "js":
        loadScript(realPath);
        PATest.helpers.inject.files.injected.push(realPath);
        break;
      case "css":
        loadCSS(realPath);
        PATest.helpers.inject.files.injected.push(realPath);
        break;
    }
  }
};

PATest.helpers.inject.require = function(js, css){

  //Do inject for JS files
  $(js).each(function(key, value){
    PATest.helpers.inject.injectFile(value, "js");
  });

  //Do inject for CSS files
  $(css).each(function(key, value){
    PATest.helpers.inject.injectFile(value, "css");
  });
};


/* Inject */
//Since this mod is in the "global_mod_scene" it loads before Jquery does, this is the non jquery way of doing $(document).ready(function(){});
if(document.addEventListener){
  document.addEventListener("DOMContentLoaded", function(){
    //Remove DOM ready event listener
    document.removeEventListener("DOMContentLoaded", arguments.callee, false);

    PATest.helpers.inject.require(PATest.helpers.inject.files.js, PATest.helpers.inject.files.css);
  }, false);
}
