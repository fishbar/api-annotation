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
    var versionOptions = [];
    versions.forEach(function (v) {
      versionOptions.push('<option value="' + v + '">v' + v + '</option>');
    });
    versionOptions.push('<option value="0.1.1">v0.1.1</option>');
    $('#versions').html(versionOptions.join('')).on('change', function () {
      var version = $(this).val();
      $.get('./api_doc_' + version + '.json').then(function (res) {
        render(res);
      }, function () {
        alert('doc not found: v' + version);
      });
    });
    var version = versions[0];
    $.get('./api_doc_' + version + '.json').then(function (res) {
      render(res);
    }, function () {
      alert('doc not found');
    });
  });
}

function render(res) {
  res.sort(function (a, b) {
    if (a.name.value >= b.name.value) {
      return 1;
    } else {
      return -1;
    }
  });
  var menusMap = {};
  var menus = [];
  res.forEach(function (api) {
    var name = api.name.value;
    var level1 = name.substr(0, name.indexOf('.'));
    if (!menusMap[level1]) {
      menusMap[level1] = {
        name: level1,
        href: name,
        sub: []
      };
      menus.push(menusMap[level1]);
    }
    menusMap[level1].sub.push({
      name: name
    });
  });

  $('.sidebar .list').html(ejs.render($('#tpl-menu').html(), {menus: menus}));

  $('.container').html(ejs.render($('#tpl-api').html(), {apis: res}));
}
