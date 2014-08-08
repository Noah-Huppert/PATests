var fs = require("fs");

/* Create "namespace" */
var PATest = {};
PATest.build = {};
PATest.build.json = {};
PATest.build.grunt = {};
PATest.build.version = {};
PATest.build.mod = {};
PATest.build.install = {};

PATest.build.grunt.error = {
  "errorCode": 0,
  "errorDesc": ""
};

PATest.build.install.path = "C:/Users/noahh_000/AppData/Local/Uber Entertainment/Planetary Annihilation/mods/";


/* PATest versioning
{major}.{minor}.{build}
{major} and {minor} are always controlled by the user
{build} is always incremented unless a custom build number is specified

PATest versionMod
Usage: --versionMod={versionMod}
  plusMajor
  plusMinor
  plusBuild(Default)
  minusMajor
  minusMinor
  custom
    --versionMajor=={major}
    --versionMinor=={minor}
    --versionBuild=={build}
    NOTICE THE == NOT AN =
    THIS IS BECAUSE GRUNT WILL NOT SEE JUST AN INT VALUE
*/
PATest.build.version.versionMod = {};
PATest.build.version.versionMod.option = "plusBuild";
PATest.build.version.major = 0;
PATest.build.version.minor = 0;
PATest.build.version.build = 0;


PATest.build.mod.modInfo = {};
PATest.build.mod.modInfoPath = "./com.noahhuppert.pa.paTest/modinfo.json";

/* Actions */
PATest.build.mod.parseModInfo = function(callback){
  var self = this;

  PATest.build.mod.modInfo = PATest.build.mod.modInfo = PATest.build.json.loadJson(PATest.build.mod.modInfoPath);

  var rawVersion = !!PATest.build.mod.modInfo.version ? PATest.build.mod.modInfo.version : "0.0.0";
  var splitVersion = rawVersion.split(".");

  if(splitVersion.length !== 3){
    splitVersion = ["0", "0", "0"];
  }

  var major = splitVersion[0];
  var minor = splitVersion[1];
  var build = splitVersion[2];

  PATest.build.version.major = parseInt(major);
  PATest.build.version.minor = parseInt(minor);
  PATest.build.version.build = parseInt(build);
};

PATest.build.version.applyVersionMod = function(grunt){
  /* Get version option */
  PATest.build.version.versionMod.option = !!grunt.option("versionMod") ? grunt.option("versionMod") : "plusBuild";

  /* Local vars for time saving */
  var major = PATest.build.version.major;
  var minor = PATest.build.version.minor;
  var build = PATest.build.version.build;

  switch(PATest.build.version.versionMod.option){
    case "plusMajor":
      major += 1;
      break;
    case "plusMinor":
      minor += 1;
      break;
    case "minusMajor":
      major += -1;
      break;
    case "minusMinor":
      minor += -1;
      break;
  }

  if(PATest.build.version.versionMod.option === "custom"){
    var cMajor = grunt.option("versionMajor") !== undefined ? grunt.option("versionMajor") : major;
    var cMinor = grunt.option("versionMinor") !== undefined  ? grunt.option("versionMinor"): minor;
    var cBuild = grunt.option("versionBuild") !== undefined  ? grunt.option("versionBuild") : build + 1;

    major = parseInt(cMajor);
    minor = parseInt(cMinor);
    build = parseInt(cBuild);
  } else{
    build += 1;
  }

  if(grunt.option("resetBuild")){
    build = 1;
  }

  /* Set global vars based on local vars */
  PATest.build.version.major = major;
  PATest.build.version.minor = minor;
  PATest.build.version.build = build;

  /* Write new version to file */
  PATest.build.mod.modInfo.version = PATest.build.version.assembleVersion();
  grunt.log.oklns("Changing version to: " + major + "." + minor + "." + build);

  //Update date
  var today = new Date();
  var readableDate = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();//YYYY/MM/DD
  PATest.build.mod.modInfo.date = readableDate;
  grunt.log.oklns("Changing date to: " + readableDate);


  //Update build
  if(!!grunt.option("modBuild")){
    PATest.build.mod.modInfo.build = grunt.option("modBuild");
    grunt.log.oklns("Changing PA build to: " + grunt.option("modBuild"));
  }

  var newModInfo = JSON.stringify(PATest.build.mod.modInfo, null, 4);
  PATest.build.json.putFileContent(PATest.build.mod.modInfoPath, newModInfo);

};

PATest.build.json.getFileContent = function(path){
    return fs.readFileSync(path);
};

PATest.build.json.putFileContent = function(path, content){
  fs.writeFileSync(path, content);
};

PATest.build.json.loadJson = function(path){
  var self = this;

  self.path = path;

  return JSON.parse(PATest.build.json.getFileContent(self.path));
};

PATest.build.grunt.build = function(grunt){
  var self = this;

  PATest.build.mod.parseModInfo();
  PATest.build.version.applyVersionMod(grunt);
};

PATest.build.version.assembleVersion = function(){
  return PATest.build.version.major + "." + PATest.build.version.minor + "." + PATest.build.version.build;
};


/* GRUNT */
PATest.build.grunt.exports = function(grunt){


  self.doneWithPAToolsBuild = function(){
    module.exports = PATest.build.grunt.exports;
  };
};

module.exports = function(grunt){
  var self = this;

  /* Setup Zip */
  var zipConfigObj = {
    main: {
      options: {
        archive: function(){
          return "./Build/com.noahhuppert.pa.paTest_v" + PATest.build.version.assembleVersion() + ".zip";
        }
      },
      files: [
        { expand: true, src: [ "./com.noahhuppert.pa.paTest/**/**" ], dest: ""}
      ]
    }
  };


  /* Setup Copy */
  var copyConfigObj = {
    main: {
      src: "./com.noahhuppert.pa.paTest/*",
      dest: PATest.build.install.path
    }
  };


  /* Apply settings for tasks */
  grunt.initConfig({
    compress: zipConfigObj,
    copy: copyConfigObj
  });


  /* Load installed tasks */
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');


  /* Make Custom tasks */
  //PATest Build
  grunt.registerTask('PATestBuild', 'Does misc tasks for building PA Test', function(){
    PATest.build.grunt.build(grunt);
  });
  //Show Helper Text
  grunt.registerTask('showHelpText', 'Shows help text', function(){
    var helpText = PATest.build.json.getFileContent("./help.txt");

    grunt.log.write(helpText);
  });
  //Show install mod message
  grunt.registerTask('showCopyMessage', 'Show copy mod message', function(){
    grunt.log.oklns("Copying mod to PA Mods dir => " + PATest.build.install.path);
  });


  /* Dynamicly specify tasks based on command line args */
  var gruntTasks = ['PATestBuild', 'compress'];

  //Add copy task if specified
  if(grunt.option("installMod")){
    gruntTasks.push("showCopyMessage");
    gruntTasks.push('copy');
  }

  //Show help if specified to
  if(grunt.option("?")){
    gruntTasks = "showHelpText";
  }

  /* Register task */
  grunt.registerTask('build', gruntTasks);
};
