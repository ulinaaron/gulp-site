/**
 *
 * Gulp Site
 * A barebones site generator using Gulp
 *
 * MIT License
 *
 */

'use strict';

/**
 * Setup
 * ========================
 */

var 
    paths = {
        src: {
            base: 'src/',
            assets: 'src/assets/',
            scss: 'src/assets/scss/',
            scssVendor: 'src/assets/scss/vendor/',
            js: 'src/assets/js/',
            img: 'src/assets/img/',
        },
        build: {
            base: 'build',
            css: 'build/assets/css/',
            js: 'build/assets/js/',
            img: 'build/assets/img/',
        },
        bower: 'bower_components/',
        npm: 'node_modules/',
    },
    files = {
        jsFinal: 'main'
    },
    devServer = {
        port: 7280,
        path: paths.build.base
    };

    /**
     * Include Bourbon and Bourbon Neat?
     * Optionally, you may choose to have the Node versions of Bourbon and Bourbon Neat Installed.
     *
     * Note: IF you choose not to use them, make sure to comment them out of the main.scss file in
     * your `src/scss/` folder.
     */
    
    var includeBourbon = true;

/**
 * Initialize
 * ========================
 */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    merge = require('merge-stream'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

/**
 * Task: Styles
 * ========================
 */

gulp.task('styles', function () {
    return gulp.src([paths.src.scss + '*.scss', '!' + paths.src.scss + '_*.scss'])
    .pipe(plugins.sass({
        errLogToConsole: true
    }))
    .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
    .pipe(plugins.bless())
    .pipe(gulp.dest(paths.build.css))
    .pipe(reload({stream:true}))
    .pipe(plugins.csso({
        keepSpecialComments: 1
    }))
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(paths.build.css))
    .pipe(reload({stream:true}));
});

/**
 * Task: JS Scripts
 * ========================
 * Todo: This only concats alphabetically. May make sense to switch to Browserify.
 */

gulp.task('scripts', function () {
    return gulp.src(paths.src.js + '*.js')
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.concat(files.jsFinal + '.js'))
        .pipe(gulp.dest(paths.build.js))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.build.js))
        .pipe(reload({stream:true, once:true}));
});

/**
 * Task: Images
 * ========================
 */

gulp.task('images', function () {
    return gulp.src(paths.src.img + '**/*')
    .pipe(plugins.imagemin({
        optimizationLevel: 7,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest(paths.build.img))
    .pipe(reload({stream:true, once:true}));
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
    gulp.src([paths.bower + 'normalize.css/normalize.css'])
    .pipe(plugins.rename('_base_normalize.scss'))
    .pipe(gulp.dest(paths.src.scssVendor));
        
});

/**
 * Task: NPM Components
 * ================
 * This is a manual process for components that should be included.
 * This function is not included in the default Gulp process.
 * Run 'gulp npm-packages' to use.
 */

gulp.task('npm-packages', function () {

	if ( includeBourbon === true ) {
	    return merge(

	        // Node Bourbon
	        gulp.src(paths.npm + 'node-bourbon/assets/stylesheets/**/*.*', ['clean'])
	            .pipe(gulp.dest(paths.src.scssVendor + 'node-bourbon')),

	        // Node Neat
	        gulp.src(paths.npm + 'node-neat/assets/stylesheets/**/*.*', ['clean'])
	            .pipe(gulp.dest(paths.src.scssVendor + 'node-neat'))
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
    gulp.src([paths.src.base + '**/*.html', '!' + paths.src.base + '**/_*.html'])
    .pipe(plugins.fileInclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest(paths.build.base))
    .pipe(reload({stream:true}));
});

/**
 * Task: Deploy
 * ========================
 * Deployes to Github Pages
 */

gulp.task('deploy', function() {
    gulp.src(paths.build.base + '**/*')
    .pipe(plugins.ghPages());
});

/**
 * Task: Watch
 * ========================
 * Initiates BrowserSync and watches files for any tasks.
 */

gulp.task('watch', function() {

    browserSync.init({
        server: {
            baseDir: devServer.path
        },
        open: false,
        port: devServer.port
    });
    gulp.watch(paths.src.scss + '**/*.scss', ['styles']);
    gulp.watch(paths.src.js + '**/*.js', ['scripts']);
    gulp.watch([paths.src.img + '**/*', paths.build.img + '**/*'], ['images']);
    gulp.watch(paths.src.base + '**/*.html', ['html']);
});

/**
 * Task: Default
 * ========================
 */

gulp.task('default', ['html', 'styles', 'scripts', 'images', 'watch']);