
MeteorSettings = { REQUIRED: 1 };

_.extend( MeteorSettings, {

  setDefaults: function (defaultsMap, options) {

    if (options === MeteorSettings.REQUIRED) {

      if (! Meteor.settings /* undefined on client */ ||
          _.size(Meteor.settings) === 0 /* empty on server */ ) {

        throw new Meteor.Error("settings-required", "--settings or METEOR_SETTINGS required.");
        // Note: it might also be the case that `settings.json` is empty... but it's unlikely.
      }
    }

    if (! Meteor.settings) Meteor.settings = {};

    _deepDefaults(Meteor.settings, defaultsMap);

    if (! Meteor.settings.public) Meteor.settings.public = {};
  }
});

var _nodes;

var _deepDefaults = function (settings, map) {
  _nodes = [];
  return __deepDefaults(settings, map);
}

var __deepDefaults = function (settings, node) {

  _.each(node, function (node, key) {

    // watch for circular reference
    if (_.indexOf(_nodes, node) >= 0) {
      throw new Meteor.Error("circular-defaults", "Circular reference found at: " + node.toString());
    }
    _nodes.push(node);

    // deep defaults
    if (node instanceof Object) {
      if (! settings[key]) settings[key] = {};
      __deepDefaults(settings[key], node);
    }
    else
      if (! settings[key]) settings[key] = node;
  });
}
