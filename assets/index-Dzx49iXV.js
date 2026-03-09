(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();const l=[{name:"pillarbox-playlist",description:"Displays a list of available media items and handles playlist navigation and playback control within the Pillarbox player."},{name:"skip-button",description:"Adds a control to skip predefined video segments based on custom intervals triggered by the srgssr/interval event."},{name:"pillarbox-debug-panel",description:"Renders an overlay with internal debug data, including playback state, timing metrics, and live player information."},{name:"user-preferences",description:"Stores and retrieves user settings like volume, playback rate, text track, and audio track using localStorage."},{name:"big-replay-button",description:"Displays a prominent replay button when playback ends, reusing the standard play button’s appearance and behavior."},{name:"brand-button",description:"Adds a configurable button to the control bar with a custom SVG icon and URL for linking to external destinations."},{name:"thumbnail-preview",description:"Displays timestamp-aligned thumbnails during timeline hover using a sprite sheet and optional scaling configuration."},{name:"card",description:"Displays a card component containing a title, duration, and a preview image."},{name:"chapters-bar",description:"Displays a scrollable list of video chapters, allowing users to easily navigate through the content."},{name:"airplay-button",description:"Adds an AirPlay button when AirPlay is available, and opens the system picker on click."},{name:"svg-button",description:"Base components that simplifies the process of adding custom SVG icons."},{name:"google-cast-sender",description:"A Chromecast plugin that supports supports subtitle and audio track selection, live streams with DVR capabilities and custom source resolution."},{name:"countdown-display",description:"A component for presenting a countdown overlay that leads into a playback transition."}],c=`<svg class="github-icon" width="30" height="30" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
</svg>
`,r=document.createDocumentFragment();l.forEach(({name:n,description:i})=>{const a=document.createElement("li");a.innerHTML=`
    <a class="info-container"
       title="Launch Demo"
       href="packages/${n}/index.html"
       target="_blank">
      <img src="img/${n}.png" width="150">
      <div>
        <h4>${n}</h4>
        <p>${i}</p>
      </div>
    </a>
    <div class="link-container">
      <a href="https://github.com/SRGSSR/pillarbox-web-suite/tree/main/packages/${n}#readme"
         class="github-link"
         title="See in Github"
         target="_blank">
        ${c}
      </a>
    </div>
  `,r.append(a)});document.getElementById("content").append(r);
