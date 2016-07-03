var gulp = require("gulp");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var htmlmin = require("gulp-htmlmin");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var cssmin = require("gulp-minify-css");
var cssver = require("gulp-make-css-url-version");
var usemin = require("gulp-usemin");
var rev = require("gulp-rev");

var options={
		removeComments:false,
		collapseWhitespace:true,
		collapseBooleanAttributes:false,
		removeEmptyAttributes:false,
		removeScriptTypeAttributes:true,
		removeStyleLinkTypeAttributes:true,
		minifyJS:true,
		minifyCSS:true
	};

gulp.task("uglify",function(){
	console.log("开始压缩代码.....");
	gulp.src("./**/*.js")
	.pipe(uglify())
	.pipe(gulp.dest("../wap/js"));
});

gulp.task("concat",function(){
	console.log("开始执行代码合并....");
	gulp.src("./**/*.js")
	.pipe(uglify())
	.pipe(concat("all.js"))
	.pipe(gulp.dest("../wap/js"));
});


gulp.task("htmlmin",function(){
	console.log("开始压缩html代码.....");
	var options={
		removeComments:false,
		collapseWhitespace:true,
		collapseBooleanAttributes:false,
		removeEmptyAttributes:true,
		removeScriptTypeAttributes:true,
		removeStyleLinkTypeAttributes:true,
		minifyJS:true,
		minifyCSS:true
	};
	gulp.src("./**/*.html")
	.pipe(htmlmin(options))
	.pipe(gulp.dest("../wap"));
});

//压缩图片
gulp.task("imagemin",function(){
	console.log("开始压缩图片......");
	gulp.src("./images/**/*.{png,jpg,gif,ico}")
	.pipe(imagemin({
		optimizationLevel:5,
		progressive: true, 
        interlaced: true, 
        multipass: true 
	}))
	.pipe(gulp.dest("../wap/images"));

	gulp.src("./css/images/*.{png,jpg,gif,ico}")
	.pipe(imagemin({
		optimizationLevel:5,
		progressive: true, 
        interlaced: true, 
        multipass: true 
	}))
	.pipe(gulp.dest("../wap/css/images"));
});


gulp.task("imageminCache",function(){
	console.log("开启图片压缩缓存机制....");
	console.log("正在压缩图片.....");
	gulp.src("./images/**/*.{png,jpg,gif,ico}")
	.pipe(cache(imagemin()))
	.pipe(gulp.dest("../wap/images"));
});


gulp.task("cssmin",function(){
	console.log("开始压缩css文件，并添加版本号......");
	gulp.src("./css/*.css")
	.pipe(cssver())
	.pipe(cssmin())

	.pipe(gulp.dest("../wap/css"));
});





gulp.task('usemin', function() {
	console.log("开始引入注解模块.................");
	console.log("开始压缩css,并添加文件指纹.......................");
	console.log("开始压缩,混淆js,并添加文件指纹.....................");
  return gulp.src('./*.html')
  	.pipe(htmlmin(options))
    .pipe(usemin({
      css: [cssmin,rev],
      js: [uglify,rev]
    }))
    .pipe(gulp.dest('../wap'));

    console.log("注解完成,css,js,压缩,合并,混淆完毕.....................");
});

gulp.task("default",["htmlmin","usemin"],function(){
	console.log("执行完成");
});
