// kbflash: flashes the MacBook keyboard backlight. No compiling needed.
// Usage: osascript -l JavaScript ~/.claude/kbflash.js [number_of_flashes]
// Uses Apple's private CoreBrightness framework; falls back to a chime if unavailable.

ObjC.import('Foundation');

function chime() {
  const app = Application.currentApplication();
  app.includeStandardAdditions = true;
  app.doShellScript('afplay /System/Library/Sounds/Glass.aiff');
}

function run(argv) {
  const flashes = parseInt(argv[0] || '3', 10) || 3;
  try {
    const bundle = $.NSBundle.bundleWithPath('/System/Library/PrivateFrameworks/CoreBrightness.framework');
    if (!bundle.load) { chime(); return; }

    const client = $.NSClassFromString('KeyboardBrightnessClient').alloc.init;

    let kb = 1;
    try {
      const ids = client.copyKeyboardBacklightIDs;
      if (ids && ids.count > 0) kb = ids.objectAtIndex(0).intValue;
    } catch (e) {}

    const original = client.brightnessForKeyboard(kb);

    for (let i = 0; i < flashes; i++) {
      client.setBrightnessForKeyboard(1.0, kb);
      delay(0.25);
      client.setBrightnessForKeyboard(0.0, kb);
      delay(0.25);
    }

    client.setBrightnessForKeyboard(original, kb);
  } catch (e) {
    chime();
  }
}
