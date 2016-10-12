
module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'Dist/styles/style.css': 'Dev/styles/style.scss'
                }
            }
        },
        concat_css: {
            all: {
                src: ['Dev/styles/vendor/*.css', 'Dist/styles/style.css'],
                dest: 'Dist/styles/style.css'
            },
        },
        concat: {
            scripts: {
                files: {
                    'Dist/scripts/fouc.js': ['Dev/scripts/vendor/modernizr.js'],
                    'Dist/scripts/main.js': [
                        'Dev/scripts/vendor/jquery-1.10.2.js',
                        'Dev/scripts/vendor/jquery-ui.js',
                        'Dev/scripts/vendor/multiselect.js',
                        'Dev/scripts/vendor/sly.js',
                        'Dev/scripts/vendor/raphael.js',
                        'Dev/scripts/vendor/raphael.freetransform.js',
                        'Dev/scripts/vendor/html2canvas_27_11.js',
                        'Dev/scripts/main.js'
                    ],
                    'Dist/scripts/main_ext.js': [
                        'Dev/scripts/vendor/jquery-1.10.2.js',
                        'Dev/scripts/vendor/jquery-ui.js',
                        'Dev/scripts/vendor/multiselect.js',
                        'Dev/scripts/vendor/sly.js',
                        'Dev/scripts/vendor/raphael.js',
                        'Dev/scripts/vendor/raphael.freetransform.js',
                        'app/extensionFiles/routing.js',
                        'app/extensionFiles/main.js'
                    ]
                }
            }

        },
        uglify: {
            dist: {
                files: {
                    'Dist/scripts/main.min.js': ['Dist/scripts/main.js'],
                    'Dist/scripts/main_ext.min.js': ['Dist/scripts/main_ext.js']
                }
            }
        },
        cssmin: {
            dist: {
                options: {
                    keepSpecialComments: 0
                },
                files: {
                    'Dist/styles/style.min.css': ['Dist/styles/style.css']
                }
            }
        },
        postcss: {
            options: {
                map: false,
                failOnError: false,
                processors: [
                    require('autoprefixer')({
                        browsers: ['> 1%', 'ie >= 7']
                    }),
                    require('postcss-opacity'),
                    require('postcss-color-rgba-fallback')
                ]
            },
            dist: {
                src: 'Dist/styles/style.css',
                dest: 'Dist/styles/style.css'
            }
        },

        watch: {
            styles: {
                files: ['Dev/styles/**/*.scss'],
                tasks: ['sass', 'concat_css', 'postcss'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['Dev/scripts/**/*.js'],
                tasks: ['concat']
            }
        }
    });


    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-postcss");
    grunt.loadNpmTasks("grunt-newer");

    grunt.registerTask("default", ["newer:sass", "newer:concat_css", "newer:concat", "newer:postcss", "watch"]);
    grunt.registerTask("all", ["sass", "concat_css", "concat", "postcss"]);
    grunt.registerTask("dist", ["uglify", "cssmin"]);


}