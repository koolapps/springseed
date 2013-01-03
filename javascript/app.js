// Generated by CoffeeScript 1.4.0
(function() {
  var OSName, fs, gui, home_dir, ncp, node, path, storage_dir;

  try {
    gui = require('nw.gui');
    fs = require('fs');
    path = require('path');
    ncp = require('ncp').ncp;
    OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") !== -1) {
      OSName = "Windows";
    }
    if (navigator.appVersion.indexOf("Mac") !== -1) {
      OSName = "Mac";
    }
    if (navigator.appVersion.indexOf("X11") !== -1) {
      OSName = "UNIX";
    }
    if (navigator.appVersion.indexOf("Linux") !== -1) {
      OSName = "Linux";
    }
    node = true;
    home_dir = process.env.HOME;
    if (OSName === "Mac") {
      storage_dir = path.join(home_dir, "/Library/Application Support/Noted/");
    }
    if (OSName === "Windows") {
      storage_dir = path.join(process.env.LOCALAPPDATA, "/Noted");
    }
    if (OSName === "Linux") {
      storage_dir = path.join(home_dir, "/.local/Noted/");
    }
  } catch (_error) {}

  window.noted = {
    setupPanel: function() {
      var win;
      win = gui.Window.get();
      win.show();
      win.showDevTools();
      $('#close').click(function() {
        return win.close();
      });
      $('#minimize').click(function() {
        return win.minimize();
      });
      $('#maximize').click(function() {
        return win.maximize();
      });
      $('#panel').mouseenter(function() {
        return $('#panel').addClass('drag');
      });
      $('#panel #decor img, #panel #noteControls img, #panel #search').mouseenter(function() {
        return $('#panel').removeClass('drag');
      });
      $('#panel #decor img, #panel #noteControls img, #panel #search').mouseleave(function() {
        return $('#panel').addClass('drag');
      });
      return $('#panel').mouseleave(function() {
        return $('#panel').removeClass('drag');
      });
    },
    setupUI: function() {
      $("#content header .edit").click(function() {
        if ($(this).text() === "save") {
          $(this).text("edit");
          return window.noted.editor.preview();
        } else {
          $(this).text("save");
          return window.noted.editor.edit();
        }
      });
      window.noted.editor = new EpicEditor({
        container: 'contentbody',
        theme: {
          base: '/themes/base/epiceditor.css',
          preview: '/themes/preview/style.css',
          editor: '/themes/editor/style.css'
        }
      });
      return window.noted.editor.load();
    },
    render: function() {
      return fs.readdir(path.join(storage_dir, "/Notebooks/"), function(err, data) {
        return console.log(data);
      });
    }
  };

  $(function() {
    if (node) {
      window.noted.setupPanel();
    }
    window.noted.setupUI();
    if (node) {
      return fs.readdir(path.join(storage_dir, "/Notebooks/"), function(err, data) {
        if (err) {
          if (err.code === "ENOENT") {
            return fs.mkdir(path.join(storage_dir, "/Notebooks/"), function() {
              return ncp(path.join(window.location.pathname, "../default_notebooks"), path.join(storage_dir, "/Notebooks/"), function(err) {
                return window.noted.render();
              });
            });
          }
        } else {
          return window.noted.render();
        }
      });
    }
  });

}).call(this);