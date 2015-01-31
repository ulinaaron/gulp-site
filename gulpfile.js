/**
 *
 * Gulp Site
 * A barebones site generator using Gulp
 *
 * MIT License
 *
 * + Table of Contents
 *     - Initialize
 *     - Funcitons
 *     + Tasks
 *         - Styles
 *         - Scripts
 *         - Images
 *         - Reload
 *         - Bower Packages
 *         - NPM Packages
 *         - Compile HTML
 *         - Deploy
 *         - Watch
 *         - Default
 *         - Test
 */

'use strict';

/**
 * ========================
 *     INITIALIZE
 * ========================
 */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    config = require('./config.json'),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    merge = require('merge-stream'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

/**
 * ========================
 *     FUNCTIONS
 * ========================
 */

    /**
     * Default Error Handling
     * ========================
     */

    var onError = function(err) {
        plugins.notify.onError({
            title:    "Gulp Site Generator",
            subtitle: "Error",
            message:  "<%= error.message %>",
            sound:    "Beep"
        })(err);

        this.emit('end');
    };

/**
 * ========================
 *     TASKS
 * ========================
 */

    /**
     * Task: Styles
     * ========================
     */

    gulp.task('styles', function () {
        return gulp.src([config.paths.src.scss + '*.scss', '!' + config.paths.src.scss + '_*.scss'])
        .pipe(plugins.plumber({errorHandler: onError}))
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer(config.autoprefixer))
        .pipe(plugins.bless())
        .pipe(gulp.dest(config.paths.build.css))
        .pipe(reload({stream:true}))
        .pipe(plugins.csso({
            keepSpecialComments: 1
        }))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.paths.build.css))
        .pipe(reload({stream:true}))
        .pipe(plugins.notify({ message: config.notifications.sass }));
    });

    /**
     * Task: JS Scripts
     * ========================
     * Todo: This only concats alphabetically. May make sense to switch to Browserify.
     */

    gulp.task('scripts', function () {
        return gulp.src(config.paths.src.js + '*.js')
        .pipe(plugins.plumber({errorHandler: onError}))
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.concat(config.files.jsFinal + '.js'))
        .pipe(gulp.dest(config.paths.build.js))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(config.paths.build.js))
        .pipe(reload({stream:true, once:true}))
        .pipe(plugins.notify({ message: config.notifications.scripts }));
    });

    /**
     * Task: Images
     * ========================
     */

    gulp.task('images', function () {
        return gulp.src(config.paths.src.img + '**/*')
        .pipe(plugins.imagemin(config.imagemin))
        .pipe(gulp.dest(config.paths.build.img))
        .pipe(reload({stream:true, once:true}))
        .pipe(plugins.notify({ message: config.notifications.images }));
    });

    /**
     * Task: Reload
     * ========================
     */

    gulp.task('reload', function () {
        browserSync.reload();
    });

    /**
     * Task: Bower Packages
     * ================
     * This is a manual process for components that should be included.
     * However the advantage is Gulp will fetch the latest version on bower update.
     * This function is not included in the default Gulp process.
     * Run 'gulp bower' to use.
     */

    gulp.task('bower-packages', function () {

        // Normalize
        gulp.src([config.paths.bower + 'normalize.css/normalize.css'])
        .pipe(plugins.rename('_base_normalize.scss'))
        .pipe(gulp.dest(config.paths.src.scssVendor));
            
    });

    /**
     * Task: NPM Components
     * ================
     * This is a manual process for components that should be included.
     * This function is not included in the default Gulp process.
     * Run 'gulp npm-packages' to use.
     */

    gulp.task('npm-packages', function () {

    	if ( config.includeBourbon === true ) {
    	    return merge(

    	        // Node Bourbon
    	        gulp.src(config.paths.npm + 'node-bourbon/assets/stylesheets/**/*.*', ['clean'])
    	            .pipe(gulp.dest(config.paths.src.scssVendor + 'node-bourbon')),

    	        // Node Neat
    	        gulp.src(config.paths.npm + 'node-neat/assets/stylesheets/**/*.*', ['clean'])
    	            .pipe(gulp.dest(config.paths.src.scssVendor + 'node-neat'))
    	    );
    	} else {
    		// TODO: If not included, clean the directories using plugins.del()
    	}

    });

    /**
     * Task: Compiles HTML
     * ========================
     * Compiles HTML files with includes
     */

    gulp.task('html', function() {
        gulp.src([config.paths.src.base + '**/*.html', '!' + config.paths.src.base + '**/_*.html'])
        .pipe(plugins.fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.paths.build.base))
        .pipe(reload({stream:true}))
        .pipe(plugins.notify({ message: config.notifications.markup }));
    });

    /**
     * Task: Deploy
     * ========================
     * Deployes to Github Pages
     */

    gulp.task('deploy', function() {
        gulp.src(config.paths.build.base + '**/*')
        .pipe(plugins.ghPages())
        .pipe(plugins.notify({ message: config.notifications.deployed }));
    });

    /**
     * Task: Watch
     * ========================
     * Initiates BrowserSync and watches files for any tasks.
     */

    gulp.task('watch', function() {

        browserSync.init({
            server: {
                baseDir: config.devServer.path
            },
            open: false,
            port: config.devServer.port
        });
        gulp.watch(config.paths.src.scss + '**/*.scss', ['styles']);
        gulp.watch(config.paths.src.js + '**/*.js', ['scripts']);
        gulp.watch([config.paths.src.img + '**/*', config.paths.build.img + '**/*'], ['images']);
        gulp.watch(config.paths.src.base + '**/*.html', ['html']);
    });

    /**
     * Task: Default
     * ========================
     */

    gulp.task('default', ['html', 'styles', 'scripts', 'images', 'watch']);

    /**
     * Task: Test
     * ========================
     * Used for testing builds without watch.
     */

    gulp.task('test', ['html', 'styles', 'scripts', 'images']);