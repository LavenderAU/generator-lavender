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
    var mntfld = 'complete/<%=devFolder%>';
    var target = grunt.option('target');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: {
            src: '<%=devFolder%>',
            dist: '<%=buildFolder%>',
            complete: 'complete',
            srcfile: '<%=devFile%>'
        },
        watch: {
            options: {
                nospawn: true,
                livereload: LIVERELOAD_PORT
            },
            bower: {
              files: ['bower.json'],
              tasks:['wiredep', 'clean:dev', 'wiredep:task', 'copy:dev', 'includereplace:dev']
            },
            gruntfile: {
              files: ['Gruntfile.js']
            },
            html: {
                files: ['<%%= app.src %>/*.html', '<%%= app.src %>/partials/*.html'],
                tasks: ['wiredep', 'clean:dev', 'wiredep:task', 'copy:dev', 'includereplace:dev']
            },
            scripts: {
                files: ['<%%= app.src %>/assets/js/**/*.js'],
                tasks: ['clean:dev', 'wiredep:task', 'copy:dev', 'includereplace:dev']
            },
            less: {
                files: ['<%%= app.src %>/assets/less/**/*.less'],
                tasks: ['less:build','clean:dev', 'wiredep:task', 'copy:dev', 'includereplace:dev'],
                options: {}
            },
            css: {
                files: ['<%%= app.src %>/assets/css/**/*.css'],
                tasks: ['clean:dev', 'wiredep:task', 'copy:dev', 'includereplace:dev']
            },
            images: {
                files: ['<%%= app.src %>/assets/img/**/*.jpg', '<%%= app.src %>/assets/img/**/*.png', '<%%= app.src %>/assets/img/**/*.gif'],
                tasks: ['clean:dev', 'wiredep:task', 'copy:dev', 'includereplace:dev']
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                base: 'complete/<%%= app.src %>'
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
                path: 'http://localhost:<%%= connect.options.port %>/index.html'
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
            }
        },
        useminPrepare: {
            options: {
                root: 'src',
                dest: 'dist'
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
            dev: ['<%%= app.complete %>'],
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
                        '{,*/}*.html'
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
                }, {
                    flatten: true,
                    expand: true,
                    cwd: '<%%= app.src %>',
                    dest: '<%%= app.dist %>/assets/fonts',
                    src: ['assets/**/*.eot', 'assets/**/*.svg', 'assets/**/*.ttf', 'assets/**/*.woff']
                }]
            },
            dev: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%%= app.src %>',
                    dest: '<%%= app.complete %>/src',
                    src: [
                        '*.*',
                        '**/*.*',
                        '!**/partials/**'
                    ]
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
        },
        wiredep: {
            task: {
                src: [
                    '<%%= app.src %>/*.html',
                    '<%%= app.src %>/assets/less/*.less'
                ]
            },
            partials: {
                options: {
                    ignorePath: '../'
                },
                src: [
                    '<%%= app.src %>/partials/*.html'
                ]
            }
        },
        includereplace: {
            dev: {
                src: '<%%= app.src %>/*.html',
                dest: '<%%= app.complete %>/'
            }
        }
    });

    grunt.registerTask('dev', ['clean:dev', 'wiredep:task', 'copy:dev', 'includereplace:dev']);

    grunt.registerTask('default', [
        'less:build'
    ]);

    grunt.registerTask('init', [
        'wiredep'
    ]);
    grunt.registerTask('server', function (target) {
      grunt.task.run([
          'less:build',
          'dev',
          'connect',
          'open',
          'watch'
      ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'wiredep',
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
