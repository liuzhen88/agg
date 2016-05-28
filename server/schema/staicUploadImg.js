var mongoose = require("mongoose");

var staicUploadImageUrl = new mongoose.Schema({
	banner:[
		{
			bannerUrl:String,
			name:String,
			operator:String
		}
	]
});

var bannerSchema = mongoose.model("imguploads",staicUploadImageUrl);

module.exports = bannerSchema;