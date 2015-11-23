/*!
 * apidoc.js
 */
$(function () {
  main();
});

function main() {
  $.get('./version.json', function (res, status) {
    var versions = Object.keys(res);
    versions.sort(function (a, b) {
      if (a > b) {
        return -1;
      } else {
        return 1;
      }
    });
    var version = versions[0];
    $.get('./api_' + version + '.json', function (res) {
      render(res);
    });
  });
}

function render(res) {
  var apis = Object.keys(res);
  // create menu
  apis.forEach(function () {

  });

  $('.container').html(ejs.render($('#tpl-api').html(), {apis: res}));
}
