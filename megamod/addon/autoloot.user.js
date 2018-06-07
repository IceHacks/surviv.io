// ==UserScript==
// @name         Surviv.io Addon Pack
// @version      1.0.0
// @description  Autoloot v1 + more soon
// @author       IceHacks
// @match        http://surviv.io/
// @grant        unsafeWindow
// ==/UserScript==
(function() {
	'use strict';
	var censor = function(censor) {
		var i = 0;
		return function(key, value) {
			if (i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
				return '[Circular]';
			if (i >= 29) // seems to be a harded maximum of 30 serialized objects?
				return '[Unknown]';
			++i; // so we know we aren't using the original object anymore
			return value;
		}
	}
	unsafeWindow.settings = {
		manager: {
			loopSpeed: 100
		},
		autoLoot: {
			enabled: true,
			params: {}
		},
		oneClick: {
			enabled: true,
			params: {}
		},
		aimBot: {
			enabled: false,
			params: {}
		}
	}
	var get = function(name, param) {
		if (param) {
			return eval("unsafeWindow.settings." + name + "." + param);
		} else {
			return unsafeWindow.settings[name];
		}
	}
	var set = function(name, value) {
		if (typeof value !== "string") {
			if (value.param) {
				return eval("unsafeWindow.settings" + name + "." + value.param + " = " + value.value);
			} else {
				return eval("unsafeWindow.settings" + name + " = " + value.value);
			}
		} else {
			return eval("unsafeWindow.settings" + name + " = " + value);
		}
	}
	var addon = function() {
		if (unsafeWindow.game) {
			// Game loop
			var game = unsafeWindow.game;
			unsafeWindow.vars = {
				mouseDown: false
			}
			setInterval(function() {
				if (game.initialized) {
					var me = game.activePlayer;
					var guns = me.localData.weapons;
					// Autoloot
					if (get("autoLoot", "enabled")) {
						var loot = game.lootBarn;
						var canHaveGun = (guns[0].name == "" || guns[1].name == "");
						game.input.bOnKeyUp.call(game.input, {
							keyCode: 70
						});
						if (loot.closestLoot) {
							console.log(loot.closestLoot);
							// The type of loot, all I know is that a gun is 3
							var guns = "m9 mp5 glock18c mac10 ump9 vector m870 mp220 saiga12 ot38 ak47 m39emr dp28 mosinnagant scarh sv98 famas hk416 mk12spr m249 deagle";
							var isGun = guns.includes(loot.closestLoot.name.replace(/-|\s/g,""));
							if (isGun && canHaveGun) {
								// Room for a gun and that is a gun, pick it up
								game.input.bOnKeyDown.call(game.input, {
									keyCode: 70
								});
							} else if (!isGun) {
								// No room for a gun and not a gun, pick it up.
								game.input.bOnKeyDown.call(game.input, {
									keyCode: 70
								});
							}
						}
					}
				}
			}, unsafeWindow.settings.manager.loopSpeed);
		} else {
			setTimeout(addon, 500);
			return;
		}
	};
	addon();
})();
