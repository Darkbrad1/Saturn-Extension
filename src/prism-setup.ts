// Must be imported before prismjs: no auto-highlighting of the page, no worker hooks.
(window as unknown as { Prism: unknown }).Prism = { manual: true, disableWorkerMessageHandler: true };
export {};
