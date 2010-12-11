BrowserInstance = function(e) {
	this.id = tools_randomid(12);
	this.language = "en";
	this.URL_home = document.location.href+"/nanoteam.html";
	this.URL_backend = "http://"+document.location.host+"/backend/";
	this.URL_html = this.URL_home+"html/";
	this.URL_images = this.URL_home+"img/";
	
	this.loadedhtml = new Array();

	this.myUser = new aUser();
	
	return this;
}



