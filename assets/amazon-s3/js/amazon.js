qq(window).attach("load", function() {
    "use strict";

    var errorHandler = function(event, id, fileName, reason) {
            return qq.log("id: " + id + ", fileName: " + fileName + ", reason: " + reason);
        },
    s3Uploader = new qq.s3.FineUploader({
        element: document.getElementById("s3-uploader"),
        debug: true,
        autoUpload: false,
        request: {
            endpoint: "https://s3uppy.s3.amazonaws.com",
            accessKey: "AKIA5RYH4VGWD6GRLV5B"
        },
        signature: {
            endpoint: "assets/amazon-s3/handlers/s3/endpoint.php"
        },
        objectProperties: {
            key: function (fileId) {
                var filename = s3Uploader.getName(fileId);
                var timestamp = new Date().valueOf();
                var ext = filename.substr(filename.lastIndexOf('.') + 1);
                var file_name_without_extension = filename.replace(/\.[^/.]+$/, "");
                return file_name_without_extension +'-'+ timestamp + '.' + ext;
            }
        },
        retry: {
            enableAuto: false,
            showButton: false
        },
        thumbnails: {
            placeholders: {
                waitingPath: "assets/amazon-s3/placeholders/waiting-generic.png",
                notAvailablePath: "assets/amazon-s3/placeholders/not_available-generic.png"
            }
        },
        callbacks: {
            onError: errorHandler,
            onUpload: function(id, filename) {
            },
            onStatusChange: function(id, oldS, newS) {
                qq.log("id: " + id + " " + newS);
            },
            onComplete: function(id, name, response) {
                qq.log(response);
            },
            onAllComplete: function(succeeded, failed) {
            	$.ajax({
	    		type: "POST",
	    		url: "assets/amazon-s3/handlers/mail.php",
	    		dataType:"json",
	    		data: $("#qq-form").append(s3Uploader.getUploads().map(function(obj) {
                    return `<input name="files[]" value="${obj.name}" type="hidden">`;
                })).serialize(), 
	    		success: function(response) {
	    			    if(response.status==200) {
                            alert('The upload was a success!');
	    			    } else {
	    					alert('The upload was not successful.');
	    			    }
	    			}
	    		});   
            }
        }
    });
});
