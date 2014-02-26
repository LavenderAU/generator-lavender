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
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      html: {
        files: ['<%=devFolder%>*.html'],
        tasks: []
      },
      scripts: {
        files: ['<%=devFolder%>**/*.js'],
        tasks: []
      },
      less: {
        files: ['<%=devFolder%>**/*.less'],
        tasks: ['less:build'],
        options: {
          interrupt: true
        }
      },
      css: {
        files: ['<%=devFolder%>**/*.css'],
        tasks: []
      },
      images: {
        files: ['<%=devFolder%>**/*.jpg', '<%=devFolder%>**/*.png', '<%=devFolder%>**/*.gif'],
        tasks: []
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        base: '<%=devFolder%>'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [lrSnippet, mountFolder(connect, '<%=devFolder%>')];
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
          paths: ["<%=devFolder%>devassets/less"]
        },
        files: {
          "<%=devFolder%>devassets/css/main.css": "<%=devFolder%>devassets/less/main.less"
        }
      }<%=vendorGruntTasks%>
    },
    useminPrepare: {
      html: '<%=devFolder%><%= devFile%>',
      options: {
        root: <%= useminDevDest %> ,
        dest: <%= useminBuildDest %>
      }
    },
    usemin: {
      html: '<%=devFolder%>tmp.<%=devFile%>'
    },
    clean: {
      build: ['.tmp', '<%=devFolder%>tmp.<%=devFile%>']
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
      tmp: {
        files: {
          '<%=devFolder%>tmp.<%=devFile%>':'<%=devFolder%><%=devFile%>'
        }
      },
      dist: {
        options: {
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          collapseBooleanAttributes: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeComments: true
        },
        files: {
          '<%=buildFolder%><%=buildFile%>': '<%=devFolder%>tmp.<%=devFile%>'
        }
      }
    }
  });
  grunt.registerTask('default', ['less:build']);
  grunt.registerTask('init', ['less:bootstrap']);
  grunt.registerTask('server', ['less:build', 'connect', 'open', 'watch']);
  grunt.registerTask('build', ['less:build', 'htmlmin:tmp', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'htmlmin:dist', 'clean:build']);
};