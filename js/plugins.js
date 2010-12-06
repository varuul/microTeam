/**
 * @author  Toni Wagner
 * @version  1.0
 *
  */


/**
 * the aPluginsInstance Object 
 * simply an Object to store, initialize and handle Plugins
 *
 * @returns a aPluginsInstance object
 */
 
 
aPluginsInstance = function() {
	this.Plugins = new Array();
	return this;
}

/**
 * the aPluginsInstance Object Function
 * that runs the init() function of all registered (those in the array and NOT initialized yet) plugins. 
 *
  * @returns true/false depending on whether the Check was successfully removed.
 */
aPluginsInstance.prototype.initPlugins = function() {
	for (var i=0; i<this.Plugins.length;i++) {
		if (!isEmpty(this.Plugins[i]) && jQuery.isFunction(this.Plugins[i].init) && this.Plugins[i].initialized != true) this.Plugins[i].init();
	}
}

/**
 * the aPluginsInstance Object Function
 * that deletes a Check by its id
 *
 * @param pluginObject: an Object that represents a Plugin
 * the minimal Object looks like this
 * pluginObject {
 *		init = function() { whatever needs to be done to start it up },
 *		initialized = false // the switch that tells the parent object whether the init function was triggered already
 *
 * @returns nothing
 */
aPluginsInstance.prototype.add = function(pluginObject) {
	this.Plugins.push(pluginObject);
}


myPlugins = new aPluginsInstance();