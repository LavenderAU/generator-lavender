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
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var emailClients = [
    'notes7',
    'notes8',
    'notes85',
    'ol2000',
    'ol2002',
    'ol2003',
    'ol2007',
    'ol2010',
    'ol2011',
    'ol2013',
    'android22',
    'android4',
    'androidgmailapp',
    'iphone5s',
    'iphone5',
    'ipadmini',
    'ipad',
    'gmailnew',
    'ffgmailnew',
    'chromegmailnew',
    'outlookcom',
    'ffoutlookcom',
    'chromeoutlookcom',
    'yahoo',
    'ffyahoo',
    'chromeyahoo'
  ];
  var stagingServer = "http://images.lav.net.au/<%=clientName%>/<%=projectName%>/",
    stagingPath = "//192.168.203.248/inetpub/wwwroot/images.lav.net.au/<%=clientName%>/<%=projectName%>/";
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      html: {
        files: ['*.html'],
        tasks: ['htmlmin']
      },
      images: {
        files: ['**/*.jpg', '**/*.gif'],
        tasks: []
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [lrSnippet, mountFolder(connect, '.')];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>/index.min.html'
      },
      deploy: {
        path: stagingServer + 'index.min.html'
      }
    },
    clean: {
      deploy: {
        src: [stagingPath]
      }
    },
    htmlmin: {
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
          'index.min.html': 'index.min.html'
        }
      },
      pkg: {
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
          'index.pkg.html': 'index.pkg.html'
        }
      }
    },
    litmus: {
      account1: {
        src: ['index.min.html'],
        options: {
          username: '',
          password: '',
          url: 'https://lavender.litmus.com',
          clients: emailClients
        }
      },
      account2: {
        src: ['index.min.html'],
        options: {
          username: '',
          password: '',
          url: 'https://lavender2.litmus.com',
          clients: emailClients
        }
      }
    },
    copy: {
      html: {
        src: '*.html',
        dest: stagingPath
      },
      img: {
        src: 'img/*',
        dest: stagingPath
      }
    },
    premailer: {
      dist: {
        options: {},
        files: {
          'index.min.html': ['index.html']
        }
      },
      pkg: {
        options: {},
        files: {
          'index.pkg.html': ['index.html']
        }
      }
    },
    replace: {
      dist: {
        src: ['index.min.html'],
        overwrite: true,
        replacements: [{
          from: "src=img",
          to: "src=" + stagingServer + "img"
        }]
      }
    }
  });
  grunt.registerTask('build', ['premailer:dist', 'htmlmin:dist', 'replace']);
  grunt.registerTask('deploy', ['premailer:dist', 'htmlmin:dist', 'replace', 'copy', 'open:deploy']);
  grunt.registerTask('package', ['premailer', 'htmlmin:pkg']);
  grunt.registerTask('dev', ['connect', 'open:server', 'watch']);
  grunt.registerTask('litmus', ['premailer:dist', 'htmlmin:dist', 'replace', 'litmus:account1', 'litmus:account2']);
  grunt.registerTask('default', ['premailer:dist', 'htmlmin:dist', 'replace', 'copy', 'litmus:account1', 'litmus:account2']);
}