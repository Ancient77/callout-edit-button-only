import { Plugin } from 'obsidian';

const INTERACTIVE_CLASS = 'interactive-child';
const MARKER_CLASS = 'callout-edit-button-only';
const CALLOUT_SELECTOR = '.cm-editor .cm-callout';

export default class CalloutEditButtonOnly extends Plugin {
	onload() {
		this.watchWindow(window);
		this.registerEvent(
			this.app.workspace.on('window-open', (_workspaceWindow, win) => {
				this.watchWindow(win);
			}),
		);
	}

	onunload() {
		const docs = new Set<Document>([document]);
		this.app.workspace.iterateAllLeaves((leaf) => {
			docs.add(leaf.view.containerEl.doc);
		});
		for (const doc of docs) {
			doc.querySelectorAll(`.${MARKER_CLASS}`).forEach((el) => {
				el.removeClasses([INTERACTIVE_CLASS, MARKER_CLASS]);
			});
		}
	}

	private watchWindow(win: Window) {
		const tag = (evt: MouseEvent) => {
			const target = evt.targetNode;
			// `instanceOf` (not `instanceof`) also works for popout windows.
			if (!target?.instanceOf(Element)) return;
			const callout = target.closest(CALLOUT_SELECTOR);
			if (callout && !callout.hasClass(INTERACTIVE_CLASS)) {
				callout.addClasses([INTERACTIVE_CLASS, MARKER_CLASS]);
			}
		};
		this.registerDomEvent(win, 'mousedown', tag, { capture: true });
		this.registerDomEvent(win, 'click', tag, { capture: true });
	}
}
