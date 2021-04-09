'use strict';

var obsidian = require('obsidian');

class Settings {
    constructor() {
        this.fileDirections = {};
        this.defaultDirection = 'ltr';
        this.rememberPerFile = true;
    }
    toJson() {
        return JSON.stringify(this);
    }
    fromJson(content) {
        var obj = JSON.parse(content);
        this.fileDirections = obj['fileDirections'];
        this.defaultDirection = obj['defaultDirection'];
        this.rememberPerFile = obj['rememberPerFile'];
    }
}
class RtlPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.settings = new Settings();
        this.SETTINGS_PATH = '.obsidian/rtl.json';
        // This stores the value in CodeMirror's autoCloseBrackets option before overriding it, so it can be restored when
        // we're back to LTR
        this.autoCloseBracketsValue = false;
    }
    onload() {
        console.log('loading RTL plugin');
        this.addCommand({
            id: 'switch-text-direction',
            name: 'Switch Text Direction (LTR<>RTL)',
            callback: () => { this.toggleDocumentDirection(); }
        });
        this.addSettingTab(new RtlSettingsTab(this.app, this));
        this.loadSettings();
        this.registerEvent(this.app.workspace.on('file-open', (file) => {
            if (file && file.path) {
                this.currentFile = file;
                this.adjustDirectionToCurrentFile();
            }
        }));
        this.registerEvent(this.app.vault.on('delete', (file) => {
            console.log("Detected deletion of", file);
            if (file && file.path && file.path in this.settings.fileDirections) {
                delete this.settings.fileDirections[file.path];
                this.saveSettings();
                console.log("Deleted the file from the map");
            }
        }));
        this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
            console.log("Detected rename:", oldPath, "=>", file);
            if (file && file.path && oldPath in this.settings.fileDirections) {
                this.settings.fileDirections[file.path] = this.settings.fileDirections[oldPath];
                delete this.settings.fileDirections[oldPath];
                this.saveSettings();
                console.log("Updated the map");
            }
        }));
        this.registerDomEvent(document, 'keydown', (ev) => {
            // Patch Home/End issue on RTL: https://github.com/esm7/obsidian-rtl/issues/6
            if (ev.key == 'End' || ev.key == 'Home') {
                let cmEditor = this.getEditor();
                if (cmEditor.getOption("direction") == 'rtl') {
                    // In theory we can execute the following regardless of the editor direction, it should always work,
                    // but it's redundant and the principle in this plugin is to not interfere with Obsidian when the 
                    // direction is LTR
                    if (ev.key == 'End') {
                        cmEditor.execCommand('goLineEnd');
                    }
                    else if (ev.key == 'Home') {
                        cmEditor.execCommand('goLineStartSmart');
                    }
                }
            }
        });
    }
    onunload() {
        console.log('unloading RTL plugin');
    }
    adjustDirectionToCurrentFile() {
        if (this.currentFile && this.currentFile.path) {
            if (this.settings.rememberPerFile && this.currentFile.path in this.settings.fileDirections) {
                // If the user wants to remember the direction per file, and we have a direction set for this file -- use it
                var requiredDirection = this.settings.fileDirections[this.currentFile.path];
                console.log('Found a known direction for this file:', requiredDirection);
            }
            else {
                // Use the default direction
                var requiredDirection = this.settings.defaultDirection;
                console.log('No known direction for this file, using the default', this.settings.defaultDirection);
            }
            this.setDocumentDirection(requiredDirection);
        }
    }
    saveSettings() {
        var settings = this.settings.toJson();
        this.app.vault.adapter.write(this.SETTINGS_PATH, settings);
    }
    loadSettings() {
        console.log("Loading RTL settings");
        this.app.vault.adapter.read(this.SETTINGS_PATH).
            then((content) => this.settings.fromJson(content)).
            catch(error => { console.log("RTL settings file not found"); });
    }
    getEditor() {
        var view = this.app.workspace.activeLeaf.view;
        if (view.getViewType() == 'markdown') {
            var markdownView = view;
            var cmEditor = markdownView.sourceMode.cmEditor;
            return cmEditor;
        }
        return null;
    }
    setDocumentDirection(newDirection) {
        var cmEditor = this.getEditor();
        if (cmEditor && cmEditor.getOption("direction") != newDirection) {
            this.patchAutoCloseBrackets(cmEditor, newDirection);
            cmEditor.setOption("direction", newDirection);
            cmEditor.setOption("rtlMoveVisually", true);
        }
        var view = this.app.workspace.activeLeaf.view;
        if (view && view.previewMode && view.previewMode.containerEl)
            view.previewMode.containerEl.dir = newDirection;
        this.setExportDirection(newDirection);
    }
    setExportDirection(newDirection) {
        let styles = document.head.getElementsByTagName('style');
        for (let style of styles) {
            if (style.getText().includes('@media print')) {
                style.setText(`@media print { body { direction: ${newDirection}; } }`);
            }
        }
    }
    patchAutoCloseBrackets(cmEditor, newDirection) {
        // Auto-close brackets doesn't work in RTL: https://github.com/esm7/obsidian-rtl/issues/7
        // Until the actual fix is released (as part of CodeMirror), we store the value of autoCloseBrackets when
        // switching to RTL, overriding it to 'false' and restoring it when back to LTR.
        if (newDirection == 'rtl') {
            this.autoCloseBracketsValue = cmEditor.getOption('autoCloseBrackets');
            cmEditor.setOption('autoCloseBrackets', false);
        }
        else {
            cmEditor.setOption('autoCloseBrackets', this.autoCloseBracketsValue);
        }
    }
    toggleDocumentDirection() {
        var cmEditor = this.getEditor();
        if (cmEditor) {
            var newDirection = cmEditor.getOption("direction") == "ltr" ? "rtl" : "ltr";
            this.setDocumentDirection(newDirection);
            console.log('File', this.currentFile, 'was set to', newDirection);
            if (this.settings.rememberPerFile && this.currentFile && this.currentFile.path) {
                this.settings.fileDirections[this.currentFile.path] = newDirection;
                this.saveSettings();
            }
        }
    }
}
class RtlSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.settings = plugin.settings;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'RTL Settings' });
        new obsidian.Setting(containerEl)
            .setName('Remember text direction per file')
            .setDesc('Store and remember the text direction used for each file individually.')
            .addToggle(toggle => toggle.setValue(this.settings.rememberPerFile)
            .onChange((value) => {
            this.settings.rememberPerFile = value;
            this.plugin.saveSettings();
            this.plugin.adjustDirectionToCurrentFile();
        }));
        new obsidian.Setting(containerEl)
            .setName('Default text direction')
            .setDesc('What should be the default text direction in Obsidian?')
            .addDropdown(dropdown => dropdown.addOption('ltr', 'LTR')
            .addOption('rtl', 'RTL')
            .setValue(this.settings.defaultDirection)
            .onChange((value) => {
            this.settings.defaultDirection = value;
            this.plugin.saveSettings();
            this.plugin.adjustDirectionToCurrentFile();
        }));
    }
}

module.exports = RtlPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIE1vZGFsLCBNYXJrZG93blZpZXcsIFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgVEZpbGUsIFRBYnN0cmFjdEZpbGUsIFNldHRpbmcgfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5jbGFzcyBTZXR0aW5ncyB7XHJcblx0cHVibGljIGZpbGVEaXJlY3Rpb25zOiB7IFtwYXRoOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG5cdHB1YmxpYyBkZWZhdWx0RGlyZWN0aW9uOiBzdHJpbmcgPSAnbHRyJztcclxuXHRwdWJsaWMgcmVtZW1iZXJQZXJGaWxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcblx0dG9Kc29uKCkge1xyXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xyXG5cdH1cclxuXHJcblx0ZnJvbUpzb24oY29udGVudDogc3RyaW5nKSB7XHJcblx0XHR2YXIgb2JqID0gSlNPTi5wYXJzZShjb250ZW50KTtcclxuXHRcdHRoaXMuZmlsZURpcmVjdGlvbnMgPSBvYmpbJ2ZpbGVEaXJlY3Rpb25zJ107XHJcblx0XHR0aGlzLmRlZmF1bHREaXJlY3Rpb24gPSBvYmpbJ2RlZmF1bHREaXJlY3Rpb24nXTtcclxuXHRcdHRoaXMucmVtZW1iZXJQZXJGaWxlID0gb2JqWydyZW1lbWJlclBlckZpbGUnXTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ0bFBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcblxyXG5cdHB1YmxpYyBzZXR0aW5ncyA9IG5ldyBTZXR0aW5ncygpO1xyXG5cdHByaXZhdGUgY3VycmVudEZpbGU6IFRGaWxlO1xyXG5cdHB1YmxpYyBTRVRUSU5HU19QQVRIID0gJy5vYnNpZGlhbi9ydGwuanNvbidcclxuXHQvLyBUaGlzIHN0b3JlcyB0aGUgdmFsdWUgaW4gQ29kZU1pcnJvcidzIGF1dG9DbG9zZUJyYWNrZXRzIG9wdGlvbiBiZWZvcmUgb3ZlcnJpZGluZyBpdCwgc28gaXQgY2FuIGJlIHJlc3RvcmVkIHdoZW5cclxuXHQvLyB3ZSdyZSBiYWNrIHRvIExUUlxyXG5cdHByaXZhdGUgYXV0b0Nsb3NlQnJhY2tldHNWYWx1ZTogYW55ID0gZmFsc2U7XHJcblxyXG5cdG9ubG9hZCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdsb2FkaW5nIFJUTCBwbHVnaW4nKTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogJ3N3aXRjaC10ZXh0LWRpcmVjdGlvbicsXHJcblx0XHRcdG5hbWU6ICdTd2l0Y2ggVGV4dCBEaXJlY3Rpb24gKExUUjw+UlRMKScsXHJcblx0XHRcdGNhbGxiYWNrOiAoKSA9PiB7IHRoaXMudG9nZ2xlRG9jdW1lbnREaXJlY3Rpb24oKTsgfVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBSdGxTZXR0aW5nc1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cclxuXHRcdHRoaXMubG9hZFNldHRpbmdzKCk7XHJcblxyXG5cdFx0dGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbignZmlsZS1vcGVuJywgKGZpbGU6IFRGaWxlKSA9PiB7XHJcblx0XHRcdGlmIChmaWxlICYmIGZpbGUucGF0aCkge1xyXG5cdFx0XHRcdHRoaXMuY3VycmVudEZpbGUgPSBmaWxlO1xyXG5cdFx0XHRcdHRoaXMuYWRqdXN0RGlyZWN0aW9uVG9DdXJyZW50RmlsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KSk7XHJcblxyXG5cdFx0dGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKCdkZWxldGUnLCAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkRldGVjdGVkIGRlbGV0aW9uIG9mXCIsIGZpbGUpO1xyXG5cdFx0XHRpZiAoZmlsZSAmJiBmaWxlLnBhdGggJiYgZmlsZS5wYXRoIGluIHRoaXMuc2V0dGluZ3MuZmlsZURpcmVjdGlvbnMpIHtcclxuXHRcdFx0XHRkZWxldGUgdGhpcy5zZXR0aW5ncy5maWxlRGlyZWN0aW9uc1tmaWxlLnBhdGhdO1xyXG5cdFx0XHRcdHRoaXMuc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJEZWxldGVkIHRoZSBmaWxlIGZyb20gdGhlIG1hcFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSkpO1xyXG5cclxuXHRcdHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbigncmVuYW1lJywgKGZpbGU6IFRBYnN0cmFjdEZpbGUsIG9sZFBhdGg6IHN0cmluZykgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkRldGVjdGVkIHJlbmFtZTpcIiwgb2xkUGF0aCwgXCI9PlwiLCBmaWxlKTtcclxuXHRcdFx0aWYgKGZpbGUgJiYgZmlsZS5wYXRoICYmIG9sZFBhdGggaW4gdGhpcy5zZXR0aW5ncy5maWxlRGlyZWN0aW9ucykge1xyXG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MuZmlsZURpcmVjdGlvbnNbZmlsZS5wYXRoXSA9IHRoaXMuc2V0dGluZ3MuZmlsZURpcmVjdGlvbnNbb2xkUGF0aF07XHJcblx0XHRcdFx0ZGVsZXRlIHRoaXMuc2V0dGluZ3MuZmlsZURpcmVjdGlvbnNbb2xkUGF0aF07XHJcblx0XHRcdFx0dGhpcy5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlVwZGF0ZWQgdGhlIG1hcFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSkpO1xyXG5cclxuXHRcdHRoaXMucmVnaXN0ZXJEb21FdmVudChkb2N1bWVudCwgJ2tleWRvd24nLCAoZXY6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuXHRcdFx0Ly8gUGF0Y2ggSG9tZS9FbmQgaXNzdWUgb24gUlRMOiBodHRwczovL2dpdGh1Yi5jb20vZXNtNy9vYnNpZGlhbi1ydGwvaXNzdWVzLzZcclxuXHRcdFx0aWYgKGV2LmtleSA9PSAnRW5kJyB8fCBldi5rZXkgPT0gJ0hvbWUnKSB7XHJcblx0XHRcdFx0bGV0IGNtRWRpdG9yID0gdGhpcy5nZXRFZGl0b3IoKTtcclxuXHRcdFx0XHRpZiAoY21FZGl0b3IuZ2V0T3B0aW9uKFwiZGlyZWN0aW9uXCIpID09ICdydGwnKSB7XHJcblx0XHRcdFx0XHQvLyBJbiB0aGVvcnkgd2UgY2FuIGV4ZWN1dGUgdGhlIGZvbGxvd2luZyByZWdhcmRsZXNzIG9mIHRoZSBlZGl0b3IgZGlyZWN0aW9uLCBpdCBzaG91bGQgYWx3YXlzIHdvcmssXHJcblx0XHRcdFx0XHQvLyBidXQgaXQncyByZWR1bmRhbnQgYW5kIHRoZSBwcmluY2lwbGUgaW4gdGhpcyBwbHVnaW4gaXMgdG8gbm90IGludGVyZmVyZSB3aXRoIE9ic2lkaWFuIHdoZW4gdGhlIFxyXG5cdFx0XHRcdFx0Ly8gZGlyZWN0aW9uIGlzIExUUlxyXG5cdFx0XHRcdFx0aWYgKGV2LmtleSA9PSAnRW5kJykge1xyXG5cdFx0XHRcdFx0XHRjbUVkaXRvci5leGVjQ29tbWFuZCgnZ29MaW5lRW5kJyk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGV2LmtleSA9PSAnSG9tZScpIHtcclxuXHRcdFx0XHRcdFx0Y21FZGl0b3IuZXhlY0NvbW1hbmQoJ2dvTGluZVN0YXJ0U21hcnQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0b251bmxvYWQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygndW5sb2FkaW5nIFJUTCBwbHVnaW4nKTtcclxuXHR9XHJcblxyXG5cdGFkanVzdERpcmVjdGlvblRvQ3VycmVudEZpbGUoKSB7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50RmlsZSAmJiB0aGlzLmN1cnJlbnRGaWxlLnBhdGgpIHtcclxuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MucmVtZW1iZXJQZXJGaWxlICYmIHRoaXMuY3VycmVudEZpbGUucGF0aCBpbiB0aGlzLnNldHRpbmdzLmZpbGVEaXJlY3Rpb25zKSB7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIHVzZXIgd2FudHMgdG8gcmVtZW1iZXIgdGhlIGRpcmVjdGlvbiBwZXIgZmlsZSwgYW5kIHdlIGhhdmUgYSBkaXJlY3Rpb24gc2V0IGZvciB0aGlzIGZpbGUgLS0gdXNlIGl0XHJcblx0XHRcdFx0dmFyIHJlcXVpcmVkRGlyZWN0aW9uID0gdGhpcy5zZXR0aW5ncy5maWxlRGlyZWN0aW9uc1t0aGlzLmN1cnJlbnRGaWxlLnBhdGhdO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGb3VuZCBhIGtub3duIGRpcmVjdGlvbiBmb3IgdGhpcyBmaWxlOicsIHJlcXVpcmVkRGlyZWN0aW9uKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIFVzZSB0aGUgZGVmYXVsdCBkaXJlY3Rpb25cclxuXHRcdFx0XHR2YXIgcmVxdWlyZWREaXJlY3Rpb24gPSB0aGlzLnNldHRpbmdzLmRlZmF1bHREaXJlY3Rpb247XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ05vIGtub3duIGRpcmVjdGlvbiBmb3IgdGhpcyBmaWxlLCB1c2luZyB0aGUgZGVmYXVsdCcsIHRoaXMuc2V0dGluZ3MuZGVmYXVsdERpcmVjdGlvbik7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5zZXREb2N1bWVudERpcmVjdGlvbihyZXF1aXJlZERpcmVjdGlvbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzYXZlU2V0dGluZ3MoKSB7XHJcblx0XHR2YXIgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzLnRvSnNvbigpO1xyXG5cdFx0dGhpcy5hcHAudmF1bHQuYWRhcHRlci53cml0ZSh0aGlzLlNFVFRJTkdTX1BBVEgsIHNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cdGxvYWRTZXR0aW5ncygpIHtcclxuXHRcdGNvbnNvbGUubG9nKFwiTG9hZGluZyBSVEwgc2V0dGluZ3NcIik7XHJcblx0XHR0aGlzLmFwcC52YXVsdC5hZGFwdGVyLnJlYWQodGhpcy5TRVRUSU5HU19QQVRIKS5cclxuXHRcdFx0dGhlbigoY29udGVudCkgPT4gdGhpcy5zZXR0aW5ncy5mcm9tSnNvbihjb250ZW50KSkuXHJcblx0XHRcdGNhdGNoKGVycm9yID0+IHsgY29uc29sZS5sb2coXCJSVEwgc2V0dGluZ3MgZmlsZSBub3QgZm91bmRcIik7IH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0RWRpdG9yKCkge1xyXG5cdFx0dmFyIHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3O1xyXG5cdFx0aWYgKHZpZXcuZ2V0Vmlld1R5cGUoKSA9PSAnbWFya2Rvd24nKSB7XHJcblx0XHRcdHZhciBtYXJrZG93blZpZXcgPSB2aWV3IGFzIE1hcmtkb3duVmlldztcclxuXHRcdFx0dmFyIGNtRWRpdG9yID0gbWFya2Rvd25WaWV3LnNvdXJjZU1vZGUuY21FZGl0b3I7XHJcblx0XHRcdHJldHVybiBjbUVkaXRvcjtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0c2V0RG9jdW1lbnREaXJlY3Rpb24obmV3RGlyZWN0aW9uOiBzdHJpbmcpIHtcclxuXHRcdHZhciBjbUVkaXRvciA9IHRoaXMuZ2V0RWRpdG9yKCk7XHJcblx0XHRpZiAoY21FZGl0b3IgJiYgY21FZGl0b3IuZ2V0T3B0aW9uKFwiZGlyZWN0aW9uXCIpICE9IG5ld0RpcmVjdGlvbikge1xyXG5cdFx0XHR0aGlzLnBhdGNoQXV0b0Nsb3NlQnJhY2tldHMoY21FZGl0b3IsIG5ld0RpcmVjdGlvbik7XHJcblx0XHRcdGNtRWRpdG9yLnNldE9wdGlvbihcImRpcmVjdGlvblwiLCBuZXdEaXJlY3Rpb24pO1xyXG5cdFx0XHRjbUVkaXRvci5zZXRPcHRpb24oXCJydGxNb3ZlVmlzdWFsbHlcIiwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHR2YXIgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXc7XHJcblx0XHRpZiAodmlldyAmJiB2aWV3LnByZXZpZXdNb2RlICYmIHZpZXcucHJldmlld01vZGUuY29udGFpbmVyRWwpXHJcblx0XHRcdHZpZXcucHJldmlld01vZGUuY29udGFpbmVyRWwuZGlyID0gbmV3RGlyZWN0aW9uO1xyXG5cdFx0dGhpcy5zZXRFeHBvcnREaXJlY3Rpb24obmV3RGlyZWN0aW9uKTtcclxuXHR9XHJcblxyXG5cdHNldEV4cG9ydERpcmVjdGlvbihuZXdEaXJlY3Rpb246IHN0cmluZykge1xyXG5cdFx0bGV0IHN0eWxlcyA9IGRvY3VtZW50LmhlYWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N0eWxlJyk7XHJcblx0XHRmb3IgKGxldCBzdHlsZSBvZiBzdHlsZXMpIHtcclxuXHRcdFx0aWYgKHN0eWxlLmdldFRleHQoKS5pbmNsdWRlcygnQG1lZGlhIHByaW50JykpIHtcclxuXHRcdFx0XHRzdHlsZS5zZXRUZXh0KGBAbWVkaWEgcHJpbnQgeyBib2R5IHsgZGlyZWN0aW9uOiAke25ld0RpcmVjdGlvbn07IH0gfWApXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHBhdGNoQXV0b0Nsb3NlQnJhY2tldHMoY21FZGl0b3IsIG5ld0RpcmVjdGlvbjogc3RyaW5nKSB7XHJcblx0XHQvLyBBdXRvLWNsb3NlIGJyYWNrZXRzIGRvZXNuJ3Qgd29yayBpbiBSVEw6IGh0dHBzOi8vZ2l0aHViLmNvbS9lc203L29ic2lkaWFuLXJ0bC9pc3N1ZXMvN1xyXG5cdFx0Ly8gVW50aWwgdGhlIGFjdHVhbCBmaXggaXMgcmVsZWFzZWQgKGFzIHBhcnQgb2YgQ29kZU1pcnJvciksIHdlIHN0b3JlIHRoZSB2YWx1ZSBvZiBhdXRvQ2xvc2VCcmFja2V0cyB3aGVuXHJcblx0XHQvLyBzd2l0Y2hpbmcgdG8gUlRMLCBvdmVycmlkaW5nIGl0IHRvICdmYWxzZScgYW5kIHJlc3RvcmluZyBpdCB3aGVuIGJhY2sgdG8gTFRSLlxyXG5cdFx0aWYgKG5ld0RpcmVjdGlvbiA9PSAncnRsJykge1xyXG5cdFx0XHR0aGlzLmF1dG9DbG9zZUJyYWNrZXRzVmFsdWUgPSBjbUVkaXRvci5nZXRPcHRpb24oJ2F1dG9DbG9zZUJyYWNrZXRzJyk7XHJcblx0XHRcdGNtRWRpdG9yLnNldE9wdGlvbignYXV0b0Nsb3NlQnJhY2tldHMnLCBmYWxzZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjbUVkaXRvci5zZXRPcHRpb24oJ2F1dG9DbG9zZUJyYWNrZXRzJywgdGhpcy5hdXRvQ2xvc2VCcmFja2V0c1ZhbHVlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRvZ2dsZURvY3VtZW50RGlyZWN0aW9uKCkge1xyXG5cdFx0dmFyIGNtRWRpdG9yID0gdGhpcy5nZXRFZGl0b3IoKTtcclxuXHRcdGlmIChjbUVkaXRvcikge1xyXG5cdFx0XHR2YXIgbmV3RGlyZWN0aW9uID0gY21FZGl0b3IuZ2V0T3B0aW9uKFwiZGlyZWN0aW9uXCIpID09IFwibHRyXCIgPyBcInJ0bFwiIDogXCJsdHJcIlxyXG5cdFx0XHR0aGlzLnNldERvY3VtZW50RGlyZWN0aW9uKG5ld0RpcmVjdGlvbik7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdGaWxlJywgdGhpcy5jdXJyZW50RmlsZSwgJ3dhcyBzZXQgdG8nLCBuZXdEaXJlY3Rpb24pO1xyXG5cdFx0XHRpZiAodGhpcy5zZXR0aW5ncy5yZW1lbWJlclBlckZpbGUgJiYgdGhpcy5jdXJyZW50RmlsZSAmJiB0aGlzLmN1cnJlbnRGaWxlLnBhdGgpIHtcclxuXHRcdFx0XHR0aGlzLnNldHRpbmdzLmZpbGVEaXJlY3Rpb25zW3RoaXMuY3VycmVudEZpbGUucGF0aF0gPSBuZXdEaXJlY3Rpb247XHJcblx0XHRcdFx0dGhpcy5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgUnRsU2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuXHRzZXR0aW5nczogU2V0dGluZ3M7XHJcblx0cGx1Z2luOiBSdGxQbHVnaW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFJ0bFBsdWdpbikge1xyXG5cdFx0c3VwZXIoYXBwLCBwbHVnaW4pO1xyXG5cdFx0dGhpcy5wbHVnaW4gPSBwbHVnaW47XHJcblx0XHR0aGlzLnNldHRpbmdzID0gcGx1Z2luLnNldHRpbmdzO1xyXG5cdH1cclxuXHJcblx0ZGlzcGxheSgpOiB2b2lkIHtcclxuXHRcdGxldCB7Y29udGFpbmVyRWx9ID0gdGhpcztcclxuXHJcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHt0ZXh0OiAnUlRMIFNldHRpbmdzJ30pO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnUmVtZW1iZXIgdGV4dCBkaXJlY3Rpb24gcGVyIGZpbGUnKVxyXG5cdFx0XHQuc2V0RGVzYygnU3RvcmUgYW5kIHJlbWVtYmVyIHRoZSB0ZXh0IGRpcmVjdGlvbiB1c2VkIGZvciBlYWNoIGZpbGUgaW5kaXZpZHVhbGx5LicpXHJcblx0XHRcdC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLnJlbWVtYmVyUGVyRmlsZSlcclxuXHRcdFx0XHRcdCAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdFx0ICAgdGhpcy5zZXR0aW5ncy5yZW1lbWJlclBlckZpbGUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0ICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHRcdCAgIHRoaXMucGx1Z2luLmFkanVzdERpcmVjdGlvblRvQ3VycmVudEZpbGUoKTtcclxuXHRcdFx0XHRcdCAgIH0pKTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ0RlZmF1bHQgdGV4dCBkaXJlY3Rpb24nKVxyXG5cdFx0XHQuc2V0RGVzYygnV2hhdCBzaG91bGQgYmUgdGhlIGRlZmF1bHQgdGV4dCBkaXJlY3Rpb24gaW4gT2JzaWRpYW4/JylcclxuXHRcdFx0LmFkZERyb3Bkb3duKGRyb3Bkb3duID0+IGRyb3Bkb3duLmFkZE9wdGlvbignbHRyJywgJ0xUUicpXHJcblx0XHRcdFx0XHRcdCAuYWRkT3B0aW9uKCdydGwnLCAnUlRMJylcclxuXHRcdFx0XHRcdFx0IC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmRlZmF1bHREaXJlY3Rpb24pXHJcblx0XHRcdFx0XHRcdCAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0IHRoaXMuc2V0dGluZ3MuZGVmYXVsdERpcmVjdGlvbiA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRcdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdFx0XHQgdGhpcy5wbHVnaW4uYWRqdXN0RGlyZWN0aW9uVG9DdXJyZW50RmlsZSgpO1xyXG5cdFx0XHRcdFx0XHQgfSkpO1xyXG5cdH1cclxufVxyXG4iXSwibmFtZXMiOlsiUGx1Z2luIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxNQUFNLFFBQVE7SUFBZDtRQUNRLG1CQUFjLEdBQStCLEVBQUUsQ0FBQztRQUNoRCxxQkFBZ0IsR0FBVyxLQUFLLENBQUM7UUFDakMsb0JBQWUsR0FBWSxJQUFJLENBQUM7S0FZdkM7SUFWQSxNQUFNO1FBQ0wsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzVCO0lBRUQsUUFBUSxDQUFDLE9BQWU7UUFDdkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQzlDO0NBQ0Q7TUFFb0IsU0FBVSxTQUFRQSxl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
