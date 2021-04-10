
/**
 * @name FullSweep
 * @source https://github.com/jM1pOpJhre-mJaMOFOMt/FullSweep/blob/main/FullSweep.plugin.js
 */

module.exports = (() =>
{
	const config =
	{
		info:
		{
			name: "FullSweep",
			authors:
			[
				{
					name: "nur",
					discord_id: "495638211494805505",
					github_username: "jM1pOpJhre-mJaMOFOMt"
				}
			],
			version: "1.0.0",
			description: "Allows you to full sweep!.",
			github: "https://github.com/jM1pOpJhre-mJaMOFOMt/FullSweep/blob/main/FullSweep.plugin.js",
			github_raw: "https://raw.githubusercontent.com/jM1pOpJhre-mJaMOFOMt/FullSweep/main/FullSweep.plugin.js"
		}
	};

	return !global.ZeresPluginLibrary ? class
	{
		constructor() { this._config = config; }

		getName = () => config.info.name;
		getAuthor = () => config.info.description;
		getVersion = () => config.info.version;

		load()
		{
			BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
				confirmText: "Download Now",
				cancelText: "Cancel",
				onConfirm: () =>
				{
					require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) =>
					{
						if (err) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
						await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
					});
				}
			});
		}

		start() { }
		stop() { }
	} : (([Plugin, Api]) => {

		const plugin = (Plugin, Api) =>
		{
			const { DiscordModules, WebpackModules, Patcher, PluginUtilities } = Api;
			const { React } = DiscordModules;

			const ContextMenu = WebpackModules.getByProps("MenuItem");

			return class FullSweep extends Plugin
			{
				constructor()
				{
					super();
					this.css = "#user-context-full-sweep{color:var(--nord-red) !important;}";
				}

				onLoad() {
				}

				onStart()
				{
					PluginUtilities.addStyle(this.getName(), this.css);
					const modules = WebpackModules.findAll(m => m.default && m.default.displayName && m.default.displayName.endsWith("UserContextMenu"));

					for (const m of modules)
					{
						Patcher.after(m, "default", (_, [props], re) =>
						{
							var context = this.createContext();
								re.props.children.props.children.push(context);
								console.log(context);
						});
					}
				}

				createContext()
				{
					return React.createElement(
						ContextMenu.MenuRadioItem,
						{
							label: "Full Sweep",
							id: "full-sweep",
							action: function(e) {
								var parentNode = e.target.parentNode == null ? null : e.target.parentNode.parentNode;
								if(parentNode == null) return;
								var muteButton = parentNode.querySelector("#user-context-voice-mute");
								var defeanButton = parentNode.querySelector("#user-context-voice-deafen");
								var disconnectButton = parentNode.querySelector("#user-context-voice-disconnect");
								var delay = 100;
								if (muteButton != null) muteButton.click();
								if (defeanButton != null) setTimeout(function(){defeanButton.click();}, delay);
								if (disconnectButton != null) setTimeout(function(){disconnectButton.click();}, delay * 2);
							}
						}
					);
				}

				onStop()
				{
					PluginUtilities.removeStyle(this.getName());
					Patcher.unpatchAll();
				}
			}
		};

		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
