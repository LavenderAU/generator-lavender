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
  var mntfld = '<%=devFolder%>';
  var target = grunt.option ('target');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: {
      src: '<%=devFolder%>',
      dist: '<%=buildFolder%>',
      srcfile: '<%=devFile%>'
    },
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      html: {
        files: ['<%%= app.src %>/*.html'],
        tasks: []
      },
      scripts: {
        files: ['<%%= app.src %>/assets/js/**/*.js'],
        tasks: []
      },
      less: {
        files: ['<%%= app.src %>/assets/less/**/*.less'],
        tasks: ['less:build'],
        options: {}
      },
      css: {
        files: ['<%%= app.src %>/assets/css/**/*.css'],
        tasks: []
      },
      images: {
        files: ['<%%= app.src %>/assets/img/**/*.jpg', '<%%= app.src %>/assets/img/**/*.png', '<%%= app.src %>/assets/img/**/*.gif'],
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
            return [lrSnippet, mountFolder(connect, mntfld)];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>/<%= devFile %>'
      }
    },
    less: {
      build: {
        options: {
          compress: true,
          strictImports: true,
          syncImports: true,
          report: 'min'
        },
        files: {
          "<%%= app.src %>/assets/css/main.css": "<%%= app.src %>/assets/less/main.less"
        }
      } <%= vendorGruntTasks %>
    },

    useminPrepare: {
      options: {
        root: <%= useminDevDest %> ,
        dest: <%= useminBuildDest %>
      },
      html: '<%%= app.src %>/**/*.html'
    },
    usemin: {
      options: {
        assetsDirs: ['<%%= app.dist %>']
      },
      html: ['<%%= app.dist %>/{,*/}*.html'],
      css: ['<%%= app.dist %>/assets/css/{,*/}*.css']
    },
    clean: {
      build: ['.tmp'],
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
    'bower-install': {
      app: {
        html: '<%%= app.src %>/<%%= app.srcfile %>',
        ignorePath: '<%%= app.src %>/'
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
        }, {
          expand: true,
          dot: true,
          cwd: '<%%= app.src %>',
          dest: '<%%= app.dist %>/',
          src: 'assets/img/{,*/}*.*'
        }, {
          expand: true,
          dot: true,
          cwd: '<%%= app.src %>',
          dest: '<%%= app.dist %>/',
          src: ['assets/css/{,*/}*.*', '!assets/css/*.css']
        }]
      }
    },
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 6
      },
      files: {
        src: [
          '<%%= app.dist %>/assets/js/{,*/}*.js',
          '<%%= app.dist %>/assets/css/{,*/}*.css'
        ]
      }
    }
  });
  grunt.registerTask('default', [
    'less:build']);
  grunt.registerTask('init', [
    <%= gruntInit %>
  ]);
  grunt.registerTask('server', [
    'less:build',
    'connect',
    'open',
    'watch'
  ]);
  grunt.registerTask('build', [
    'clean:dist',
    'less:build',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'filerev',
    'usemin',    
    'clean:build'
  ]);
};