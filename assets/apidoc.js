/*!
 * apidoc.js
 */
$(function () {
  main();
  resize();
  $(window).on('resize', resize);
});

function resize() {
  var h = $(window).height();
  $('.sidebar').height(h > 0 ? h : 0);
}

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
  var urlHeader = location.protocol + '//' + location.host;
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
    api.api.url = urlHeader + api.api.url;
  });

  $('.sidebar .list').html(ejs.render($('#tpl-menu').html(), {menus: menus}));

  $('.container').html(ejs.render($('#tpl-api').html(), {apis: res}));
}

$('.container').on('click', 'div.row .icon-help', function (evt) {
  var node = $(this);
  var pos = node.position();
  var width = node.width();
  var parent = node.parent();
  var method = parent.find('span.method:eq(0)').text().toUpperCase();
  var url = parent.find('span.url').text();
  var helper = $('.helper');
  helper.find('.example').each(function () {
    var n = $(this);
    var txt = n.text();
    txt = txt.replace(/\$\{(\w+)\}/g, function (m0, m1) {
      var str;
      switch (m1) {
        case 'url':
          str = url;
          break;
        case 'method':
          str = method;
          break;
      }
      return str;
    });
    n.text(txt);
  })
  helper.css({top: pos.top + 'px', left: (pos.left + width + 20) + 'px'}).show();
  evt.stopPropagation();
});

$('.helper').on('click', function (evt) {
  evt.stopPropagation();
});

$(document).on('click', function () {
  $('.helper').hide();
});
