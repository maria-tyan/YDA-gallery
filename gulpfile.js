var gulp = require('gulp'), // Сообственно Gulp JS
        jade = require('gulp-jade'), // Плагин для Jade
        sass = require('gulp-sass'), // Плагин для Sass
        livereload = require('gulp-livereload'), // Livereload для Gulp
        csso = require('gulp-csso'), // Минификация CSS
        imagemin = require('gulp-imagemin'), // Минификация изображений
        uglify = require('gulp-uglify'), // Минификация JS
        concat = require('gulp-concat'), // Склейка файл
        connect = require('gulp-connect'), //ЛОкальный сервер
        plumber = require('gulp-plumber'), //Отслеживание ошибок
        browserify = require('browserify'), //Concatinate scripts
        browserifyshim = require('browserify-shim'), //Concatinate scripts
        source = require('vinyl-source-stream'),
        imagemin = require('gulp-imagemin');
autoprefixer = require('gulp-autoprefixer');
svgmin = require('gulp-svgmin');
csso = require('gulp-csso');
uglify = require('gulp-uglify');
obfuscate = require('gulp-obfuscate');
replace = require('gulp-regex-replace');
js_obfuscator = require('gulp-js-obfuscator');
prettify = require('gulp-jsbeautifier');
gulp.task('images', function () {
    gulp.src('./dev/images/**/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./assets/images'));
    gulp.src('./dev/media/**/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./assets/media'))

});



gulp.task('svg', function () {
    gulp.src('./dev/images/svg/*')
            .pipe(svgmin({
                plugins: [{
                        removeDoctype: false
                    }, {
                        removeComments: false
                    }, {
                        cleanupNumericValues: {
                            floatPrecision: 2
                        }
                    }, {
                        convertColors: {
                            names2hex: false,
                            rgb2hex: false
                        }
                    }]
            }))
            .pipe(gulp.dest('./assets/images'));

});
gulp.task('font', function () {
    gulp.src('./dev/fonts/*')
            .pipe(gulp.dest('./assets/fonts'));

});
gulp.task('audio', function () {
    gulp.src('./dev/audio/*')
            .pipe(gulp.dest('./assets/audio'));

});
gulp.task('sass', function () {
    return gulp.src('./dev/stylesheets/style.scss').pipe(sass({
        'include css': true,
        sourcemap: {
            inline: true,
            sourceRoot: '.',
            basePath: '/dev/stylesheets'
        }
    })).pipe(autoprefixer({
        browsers: ['last 5 versions'],
        cascade: false
    })).pipe(csso()).pipe(gulp.dest('./assets/css')).pipe(connect.reload());
});
gulp.task('jade', function () {
    var data;
    data = {};
    data.images = {};
    data.content = require('./dev/json/data.json');
    return gulp.src('./dev/jade/pages/*.jade').pipe(plumber({
        errorHandler: function (error, file) {
            console.log(error.message);
            return this.emit('end');
        }
    })).pipe(jade({
        pretty: true,
        locals: data
    })).pipe(prettify({
        config: './config-jade.json'
    })).pipe(prettify.reporter()).pipe(gulp.dest('./assets')).pipe(connect.reload());
});
gulp.task('browserify', function () {
    return browserify('./dev/js/_index.js')
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./dev/js'));
});
gulp.task('compress', function () {
    return gulp.src('./dev/js/bundle.js')
//            .pipe(uglify())        
//            .pipe(js_obfuscator())                       
            .pipe(gulp.dest('./assets/js'));
});
gulp.task('connect', function () {
    return connect.server({
        root: '',
        livereload: true,
        port: 3000
    });
});
gulp.task('watch', function () {
    gulp.watch('./dev/stylesheets/**/*.scss', ['sass']);
    gulp.watch('./dev/jade/**/*.jade', ['jade']);
    gulp.watch(['./dev/js/**/*.js', '!./dev/js/bundle.js'], ['browserify', 'compress']);
//    gulp.watch('./dev/images/**/*', ['images']);
//    gulp.watch('./dev/media/**/*', ['images']);
    return gulp.watch('./dev/json/**/*.json', ['jade']);
});

gulp.task('default', ['sass', 'jade', 'browserify','compress','font','audio','watch']);
