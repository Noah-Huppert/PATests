/* Setup "namespace" */
PATest.core.main = {};

PATest.core.main.inject = {};
PATest.core.main.inject.files = {};

PATest.core.main.inject.files.js = [ "src/core/PATestTest.js" ];
PATest.core.main.inject.files.css = [];

PATest.helpers.inject.require(PATest.core.main.inject.files.js, PATest.core.main.inject.files.css);
console.log("PATest.core.main working");
