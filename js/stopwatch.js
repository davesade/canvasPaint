function StopWatch() {
	var watches = {};
	this.start = function(name) {
		if(!name) {
			throw Error("watch name shoud be defined");
		}
		var watch = {};
		watch.start = new Date().getTime();
		watches[name] = watch;
	}

	this.stop = function(name) {
		if(!name) {
			throw Error("watch name shoud be defined");
		}
		if(!watches[name]) {
			throw Error("unknown watch name");
		}
		var watch = watches[name];
		watch.stop = new Date().getTime();
		watch.delta = function() {
			return this.stop - this.start;
		}
		return watch;
	}
}