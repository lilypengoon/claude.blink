# Blink When Done

My MacBook keyboard lights flash three times whenever Claude Code finishes running.

I built this while learning to code. I'd start a long task with Claude late at night, step away, and miss when it finished. Now I just glance at my keyboard.

## How it works

- **The trigger:** Claude Code has *hooks*, moments in its workflow (like "finished responding") where you can run your own command. This project attaches a script to the `Stop` hook.
- **The script:** macOS has no public way to control the keyboard backlight, so `kbflash.js` loads Apple's private CoreBrightness framework through the JavaScript–Objective-C bridge, saves your current brightness, blinks the keys on and off, then restores your original setting. If the framework isn't available, it plays a chime instead.

## Setup (macOS)

1. Download `kbflash.js` and move it into place:
   ```
   mkdir -p ~/.claude
   cp ~/Downloads/kbflash.js ~/.claude/kbflash.js
   ```
2. Test it (works best in a dim room):
   ```
   osascript -l JavaScript ~/.claude/kbflash.js 3
   ```
3. Add the hook to `~/.claude/settings.json`:
   ```json
   {
     "hooks": {
       "Stop": [
         { "hooks": [ { "type": "command", "command": "osascript -l JavaScript $HOME/.claude/kbflash.js 3" } ] }
       ]
     }
   }
   ```
4. Restart Claude Code. The keyboard flashes every time Claude finishes.

Change the `3` to flash more or fewer times.

## Built with

JavaScript for Automation (JXA), Claude Code hooks, macOS CoreBrightness
