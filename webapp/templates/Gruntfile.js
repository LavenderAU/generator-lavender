// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var expressport = 9000;
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: {
      src: '<%=devFolder%>',
      dist: '<%=buildFolder%>',
      srcfile: '<%=devFile%>',
      distfile: '<%=buildFile%>'
    },
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      html: {
        files: ['<%%= app.src %>*.html'],
        tasks: []
      },
      scripts: {
        files: ['<%%= app.src %>**/*.js'],
        tasks: []
      },
      less: {
        files: ['<%%= app.src %>**/*.less'],
        tasks: ['less:build'],
        options: {
          interrupt: true
        }
      },
      css: {
        files: ['<%%= app.src %>**/*.css'],
        tasks: []
      },
      images: {
        files: ['<%%= app.src %>**/*.jpg', '<%%= app.src %>**/*.png', '<%%= app.src %>**/*.gif'],
        tasks: []
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        base: '<%%= app.src %>'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [lrSnippet, mountFolder(connect, '<%%= app.src %>')];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>/<%= devFile%>'
      }
    },
    less: {
      build: {
        options: {
          paths: ["<%%= app.src %>devassets/less"]
        },
        files: {
          "<%%= app.src %>devassets/css/main.css": "<%%= app.src %>devassets/less/main.less"
        }
      } <%= vendorGruntTasks %>
    },

    useminPrepare: {
      options: {
        root: <%= useminDevDest %> ,
        dest: <%= useminBuildDest %>
      },
      html: '<%%= app.src %>/dev.index.html'
    },
    usemin: {
      options: {
        assetsDirs: ['<%%= app.dist %>']
      },
      html: ['<%%= app.dist %>/{,*/}*.html'],
      css: ['<%%= app.dist %>/assets/css/{,*/}*.css']
    },
    clean: {
      build: ['.tmp', '<%= app.src %>tmp.<%= app.srcfile %>'],
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= app.dist %>/*'
          ]
        }]
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0,
        report: 'min'
      }
    },
    uglify: {
      options: {
        report: 'min'
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%%= app.dist %>',
          src: '{,*/}*.html',
          dest: '<%%= app.dist %>'
        }]
      }
    },
    'bower-install': {
      app: {
        html: '<%%= app.src %>/<%%= app.srcfile %>',
        ignorePath: '<%%= app.src %>'
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= app.src %>',
          dest: '<%%= app.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%%= app.dist %>/assets/js/{,*/}*.js',
            '<%%= app.dist %>/assets/css/{,*/}*.css',
            '<%%= app.dist %>/assets/img/{,*/}*.{gif,jpeg,jpg,png,webp}'
          ]
        }
      }
    }
  });
  grunt.registerTask('default', ['less:build']);
  grunt.registerTask('init', ['bower-install', 'less:bootstrap']);
  grunt.registerTask('server', ['less:build', 'connect', 'open', 'watch']);
  grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',                
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',        
        'rev',
        'usemin',
        'htmlmin',
        'clean:build'
    ]);
};