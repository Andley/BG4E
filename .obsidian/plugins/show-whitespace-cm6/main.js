/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var g=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var p=Object.prototype.hasOwnProperty;var m=(n,e)=>{for(var i in e)g(n,i,{get:e[i],enumerable:!0})},u=(n,e,i,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of w(e))!p.call(n,s)&&s!==i&&g(n,s,{get:()=>e[s],enumerable:!(t=d(e,s))||t.enumerable});return n};var S=n=>u(g({},"__esModule",{value:!0}),n);var k={};m(k,{default:()=>W});module.exports=S(k);var r=require("obsidian"),c=require("@codemirror/view");var o=require("obsidian"),h=class extends o.PluginSettingTab{constructor(e,i){super(e,i),this.plugin=i}async save(){await this.plugin.updateSettings(this.newSettings)}async display(){await this.plugin.loadSettings(),this.reset()}async reset(){this.newSettings=JSON.parse(JSON.stringify(this.plugin.settings)),this.drawElements()}drawElements(){let e=this.plugin.manifest.id,i=this.plugin.manifest.name;this.containerEl.empty(),this.containerEl.addClass(e),new o.Setting(this.containerEl).setHeading().setName(i),new o.Setting(this.containerEl).setName("Save settings").setClass(e+"-save-reset").addButton(t=>t.setIcon("reset").setTooltip("Reset to previously saved (or generated) values").onClick(()=>{this.reset(),console.log("(SW-CM6) Configuration reset")})).addButton(t=>{t.setIcon("save").setTooltip("Save current values").onClick(async()=>{await this.save()}),this.saveButton=t.buttonEl}),new o.Setting(this.containerEl).setName("Suppress plugin styles").setDesc("Enable to remove plugin styles. You will need to define your own snippet to customize the appearance of whitespace").addToggle(t=>t.setValue(this.newSettings.disablePluginStyles).onChange(async s=>{let a=s!=this.newSettings.disablePluginStyles;this.newSettings.disablePluginStyles=s,a&&this.drawElements()})),new o.Setting(this.containerEl).setName("Always show blockquote markers").setDesc("Show the leading > for blockquotes in Live Preview").addToggle(t=>t.setValue(this.newSettings.showBlockquoteMarkers).onChange(async s=>{let a=s!=this.newSettings.showBlockquoteMarkers;this.newSettings.showBlockquoteMarkers=s,a&&this.drawElements()})),new o.Setting(this.containerEl).setName("Show all whitespace characters in code blocks").setDesc("Add a marker for all whitespace characters in code blocks (included in Show all whitespace)").addToggle(t=>t.setValue(this.newSettings.showCodeblockWhitespace).onChange(async s=>{s=s||this.newSettings.showAllWhitespace;let a=s!=this.newSettings.showCodeblockWhitespace;this.newSettings.showCodeblockWhitespace=s,a&&this.drawElements()})),new o.Setting(this.containerEl).setName("Show consecutive whitespace").setDesc("Add markers for multiple whitespace characters between words").addToggle(t=>t.setValue(this.newSettings.showExtraWhitespace).onChange(async s=>{s=s||this.newSettings.showAllWhitespace;let a=s!=this.newSettings.showExtraWhitespace;this.newSettings.showExtraWhitespace=s,a&&this.drawElements()})),new o.Setting(this.containerEl).setName("Show all whitespace characters").setDesc("Add a marker for all whitespace characters, even those between words").addToggle(t=>t.setValue(this.newSettings.showAllWhitespace).onChange(async s=>{let a=s!=this.newSettings.showAllWhitespace;this.newSettings.showAllWhitespace=s,a&&this.drawElements()})),new o.Setting(this.containerEl).setName("Outline list markers").setDesc("Add a style to the space reserved by list markers (e.g. ' -' or ' 1.')").addToggle(t=>t.setValue(this.newSettings.outlineListMarkers).onChange(async s=>{let a=s!=this.newSettings.outlineListMarkers;this.newSettings.outlineListMarkers=s,a&&this.drawElements()}))}hide(){this.save()}};var f={version:{major:0,minor:0,patch:0},disablePluginStyles:!1,showBlockquoteMarkers:!1,showCodeblockWhitespace:!1,showAllWhitespace:!1,outlineListMarkers:!1,enabled:!0},l=class extends r.Plugin{constructor(){super(...arguments);this.cmExtension=[];this.classList=[];this.onExternalSettingsChange=(0,r.debounce)(async()=>{this.settings=Object.assign({},this.settings,await this.loadData()),this.updateSettings(this.settings),console.debug("(SW-CM6) external settings changed")},2e3,!0)}async onload(){console.info("loading Show Whitespace (SW-CM6) v"+this.manifest.version),await this.loadSettings(),this.addSettingTab(new h(this.app,this)),document.body.classList.add(this.manifest.id),this.initClasses(),this.registerEditorExtension(this.cmExtension),this.handleExtension(!0);let i={id:"whitespace-toggle",name:"Toggle Show Whitespace",icon:"pilcrow",callback:async()=>this.toggleExtension(this)};this.addCommand(i)}handleExtension(i){console.log("(SW-CM6) enabled",this.settings.enabled),this.removeClasses(),this.initClasses(),this.cmExtension.length=0,this.settings.enabled&&(this.cmExtension.push((0,c.highlightWhitespace)()),this.cmExtension.push((0,c.highlightTrailingWhitespace)())),i||this.app.workspace.updateOptions()}initClasses(){this.classList=[],(!this.settings.enabled||this.settings.disablePluginStyles)&&this.classList.push("swcm6-nix-plugin-styles"),this.settings.enabled&&(this.settings.showBlockquoteMarkers&&this.classList.push("swcm6-show-blockquote-markers"),this.settings.showCodeblockWhitespace&&this.classList.push("swcm6-show-codeblock-whitespace"),this.settings.showExtraWhitespace&&this.classList.push("swcm6-show-extra-whitespace"),this.settings.showAllWhitespace&&this.classList.push("swcm6-show-all-whitespace"),this.settings.outlineListMarkers&&this.classList.push("swcm6-outline-list-markers")),document.body.addClasses(this.classList)}removeClasses(){document.body.removeClasses(this.classList)}onunload(){console.log("(SW-CM6) unloading Show Whitespace"),document.body.classList.add(this.manifest.id),this.removeClasses()}async handleConfigFileChange(){await super.handleConfigFileChange(),this.onExternalSettingsChange()}async toggleExtension(i){i.settings.enabled=!i.settings.enabled,i.updateSettings(this.settings)}async loadSettings(){if(!this.settings){let i=await this.loadData();this.settings=Object.assign({},f,i);let t=E(this.manifest.version);b(t,this.settings.version)!=0&&(this.settings.version=t,await this.saveSettings())}}async updateSettings(i){this.settings=Object.assign({},this.settings,i),await this.saveSettings(),this.handleExtension(!1),console.log("(SW-CM6) settings and classes updated")}async saveSettings(){await this.saveData(this.settings)}};function b(n,e){return n.major===e.major?n.minor===e.minor?n.patch-e.patch:n.minor-e.minor:n.major-e.major}function E(n){let e=n.split(".");return{major:Number(e[0]),minor:Number(e[1]),patch:Number(e[2])}}var W=l;
