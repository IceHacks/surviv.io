// ==UserScript==
// @name         Surviv.io Addon Pack
// @version      1.0.0
// @description  Autoloot v1 + more soon
// @author       IceHacks
// @match        http://surviv.io/
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==

(() => {
    'use strict';

    var settings = {
		manager: {
			name: "Script settings",
			desc: "Change how this addon behaves (requires refresh)",
			params: {
				loopSpeed: {
					name: "Loop speed",
					desc: "The time in-between loops",
					type: "number",
					id: "aaa",
					value: 100
				}
			}
		},
		autoLoot: {
			name: "Autoloot",
			desc: "Automagically pickup loot.",
			params: {
				enabled: {
					name: "Enabled",
					desc: "Autoloot enabled",
					type: "checkbox",
					id: "baa",
					value: true
				}
			}
		},
		openClose: {
			name: "Open & Close",
			desc: "Automagically open and close doors.",
			params: {
			}
		},
		aimBot: {
			name: "Aimbot",
			desc: "Comming soon bois.",
			params: {}
		}
	};
    var fetchSettings = () => {
        return localStorage.getItem("megamod");
    }
    var setSettings = (value) => {
        localStorage.setItem("megamod", JSON.stringify(value));
        return fetchSettings();
    }
    if (typeof fetchSettings() !== undefined) {
        settings = JSON.parse(fetchSettings());
    }

    unsafeWindow.update = (obj, opt) => {
        var value = "";
        if (obj.type == "checkbox") {
            value = obj.checked;
        } else {
            value = obj.value;
        }
        console.log(value);
        console.log(obj);
        settings[opt.addon].params[opt.parameter].value = value;
        setSettings(settings);
    };
    unsafeWindow.change = (obj, opt) => {
        if (obj.type == "checkbox") {
            obj.checked = settings[opt.addon].params[opt.parameter].value;
        }
    }

    var render = () => {
        var obj = settings;
        var keys = Object.keys(settings);
        var html = `
			<div id="news" style="height: 100%;padding: 20px;box-sizing: border-box;overflow-y: auto;">
				<h3>MegaMod - Mega Addons</h3>
				<small>June 22, 2018</small>
        `;
        for (var i in keys) {
            var service = obj[keys[i]];
			var params = service.params;
            var par = Object.keys(params);
            if (par.length > 0) {
				html += `
					<p><strong>${service.name}</strong></p>
					<p>${service.desc}</p>
				`;
				for (var b in par) {
                    var param = params[par[b]];
                    var checked = (param.value && param.type == "checkbox") ? "checked" : "";
                    html += `
						<p>${param.name}: <input id="${param.id}" title="${param.desc}" onchange="window.update(this, {
                            addon: '${keys[i]}',
                            parameter: '${par[b]}'
                        })" type="${param.type}" ${checked} value="${param.value}" /></p>
					`;
				}
			}
        }
        html += `</div>`;
		$("#ad-block-main-med-rect").prepend(html);
    };
    render();
    var addon = function() {
		if (unsafeWindow.game) {
			// Game loop
			var game = unsafeWindow.game;
			unsafeWindow.vars = {
				mouseDown: false
			}
			setInterval(function() {
				if (game.initialized) {
					console.log(game);
					var me = game.activePlayer;
					var guns = me.localData.weapons;
					// Autoloot
					if (settings.autoLoot.params.enabled) {
						var loot = game.lootBarn;
                        var canHaveGun = (guns[0].name == "" || guns[1].name == "");
                        game.input.bOnKeyUp.call(game.input, {
                            keyCode: 70
                        });
						if (loot.closestLoot) {
							var guns = "m9 mp5 g18c mac10 ump9 vector m870 mp220 saiga12 ot38 ak47 m39emr dp28 mosinnagant scarh sv98 famas hk416 mk12spr m249 deagle spas12";
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
					// Door opener
					if (settings.openClose.params.enabled) {
						
					}
				}
			}, settings.manager.params.loopSpeed);
		} else {
			setTimeout(addon, 500);
			return;
		}
	};
	addon();
})();