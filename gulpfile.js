/**
 *
 * Gulp Site
 * A barebones site generator using Gulp
 *
 * MIT License
 *
 */

/**
 * Setup
 * ========================
 */

    // Site Setup
var dir_site_src                = 'src/',
    dir_site_build              = 'build/',
    // Site Source
    dir_site_src_assets         = 'src/assets/',
    dir_site_src_scss           = 'src/assets/scss/',
    dir_site_src_scss_vendor    = 'src/assets/scss/vendor/',
    dir_site_src_js             = 'src/assets/js/',
    dir_site_src_js_standalone  = 'src/assets/js/standalone/',
    dir_site_src_js_plug        = 'src/assets/js/plugins/',
    dir_site_src_img            = 'src/assets/img/',
    // Site Build
    dir_site_build_css          = 'build/assets/css/',
    dir_site_build_js           = 'build/assets/js/',
    dir_site_build_img          = 'build/assets/img/',
    // Misc
    dir_bower                   = 'bower_components/',
    dir_npm                     = 'node_modules/',
    js_final                    = 'main', // JS final name of all the combined JS files
    // Browser Sync Settings
    dev_port                    = '7280',
    dev_dir                     = dir_site_build;

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
    return gulp.src([dir_site_src_scss + '*.scss', '!' + dir_site_src_scss + '_*.scss'])
    .pipe(plugins.sass({
        errLogToConsole: true
    }))
    .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
    .pipe(plugins.bless())
    .pipe(gulp.dest(dir_site_build_css))
    .pipe(reload({stream:true}))
    .pipe(plugins.csso({
        keepSpecialComments: 1
    }))
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(dir_site_build_css))
    .pipe(reload({stream:true}));
});

/**
 * Task: Images
 * ========================
 */

gulp.task('image', function () {
    return gulp.src(dir_site_src_img + '**/*')
    .pipe(plugins.cache(plugins.imagemin({
        optimizationLevel: 7,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(dir_site_build_img))
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

    return merge(

        // Normalize
        gulp.src([dir_bower + 'normalize.css/normalize.css'])
        .pipe(plugins.rename('_base_normalize.scss'))
        .pipe(gulp.dest(dir_site_src_scss_vendor)) // Copies to src/scss

    );

});

/**
 * Task: NPM Components
 * ================
 * This is a manual process for components that should be included.
 * This function is not included in the default Gulp process.
 * Run 'gulp npm-packages' to use.
 */

gulp.task('npm-packages', function () {

    return merge();
});

/**
 * Task: Compiles HTML
 * ========================
 * Compiles HTML files with includes
 */

gulp.task('html', function() {
    gulp.src([dir_site_src + '**/*.html', '!' + dir_site_src + '**/_*.html'])
    .pipe(plugins.fileInclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest(dir_site_build))
    .pipe(reload({stream:true}));
});

/**
 * Task: Deploy
 * ========================
 * Deployes to Github Pages
 */

gulp.task('deploy', function() {
    gulp.src(dir_site_build + '**/*')
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
            baseDir: dev_dir
        },
        open: false,
        port: dev_port
    });
    gulp.watch(dir_site_src_scss + '**/*.scss', ['styles']);
    gulp.watch([dir_site_src_img + '**/*', dir_site_build_img + '**/*'], ['image']);
    gulp.watch(dir_site_src + '**/*.html', ['html']);
});

/**
 * Task: Default
 * ========================
 */

gulp.task('default', ['html', 'styles', 'watch']);