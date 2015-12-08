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
    'appmail8',
    'notes8',
    'notes85',
    'ol2000',
    'ol2002',
    'ol2003',
    'ol2007',
    'ol2010',
    'ol2011',
    'ol2013',
    'ol2015',
    'android4',
    'androidgmailapp',
    'iphone5s',
    'iphone5sios8',
    'iphone6',
    'iphone6plus',
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
  var stagingServer = 'http://<%=clientName%>.lav.net.au/<%=projectName%>/',
    stagingPath = '//192.168.203.248/inetpub/wwwroot/<%=clientName%>.lav.net.au/<%=projectName%>/',
    imagesServer = 'http://images.lav.net.au/<%=clientName%>/<%=projectName%>/',
    imagesPath = '//192.168.203.248/inetpub/wwwroot/images.lav.net.au/<%=clientName%>/<%=projectName%>/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      html: {
        files: ['*.html'],
        tasks: ['htmlmin:dist', 'replace']
      },
      images: {
        files: ['**/*.jpg', '**/*.gif'],        
        tasks: ['htmlmin:dist', 'replace', 'clean:dist', 'deploy']
      },
      jade: {
        files: ['*.jade', '*.json'],
        tasks: ['jade:compile', 'htmlmin:dist', 'replace']
      }
    },
    connect: {
      options: {
        port: 9002,
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
        src: [stagingPath, imagesPath]
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'index.min.html': 'index.html'
        }
      },
      pkg: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          '<%=projectPrefix%>_index.html': 'index.html'
        }
      }
    },
    litmus: {
      account1: {
        src: ['index.min.html'],
        options: {
          username: '<%= litmusUsername1 %>',
          password: '<%= litmusPassword1 %>',
          url: 'https://lavender.litmus.com',
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
        dest: imagesPath
      },
      package: {
        expand:true,
        dot: true,
        cwd: 'img',
        dest: 'images/',
        src: ['*.{gif,jpg}'],
        rename: function (dest, src) {
          return dest + '<%=projectPrefix%>' + src;
        }
      }
    },
    replace: {
      dist: {
        src: ['index.min.html'],
        overwrite: true,
        replacements: [{
          from: 'src="img',
          to: 'src="' + imagesServer + 'img'
        }]
      },
      package: {
        src: ['<%=projectPrefix%>_index.html'],        
        overwrite: true,
        replacements: [{
          from: 'src="img/',
          to: 'src="images/<%=projectPrefix%>_'
        }]
      }
    },
    compress: {
      main: {
        options: {
          archive: '<%=projectPrefix%>.zip'
        },
        files: [
          {src:['<%=projectPrefix%>_index.html', 'images/**'], dest: '/', filter: 'isFile'}
        ]
      }
    },
    jade: {
      compile: {
        options: {
          client: false,
          pretty: true,
          data: function(dest,src) {
            return require('./index.json');
          }
        },
        files: [{
          src: '**/*.jade',
          dest: '',
          expand:true,
          ext: '.html'
        }]
      }
    }
  });
  grunt.registerTask('build',     ['htmlmin:dist', 'replace', 'copy:img', 'copy:html', 'litmus:account1']);
  grunt.registerTask('deploy',    ['htmlmin:dist', 'replace', 'copy:img', 'copy:html', 'open:deploy']);
  grunt.registerTask('package',   ['htmlmin:pkg']);
  grunt.registerTask('serve',     ['htmlmin:dist', 'replace', 'copy:img', 'copy:html', 'connect', 'open:server', 'watch']);
  grunt.registerTask('litmuser',  ['htmlmin:dist', 'replace', 'litmus:account1']);
  grunt.registerTask('default',   ['htmlmin:dist', 'replace', 'copy:img', 'copy:html', 'litmus:account1']);
};
