# Visitor map

- Provider: Supercounters; widget ID: `1738914`, created for this homepage on 2026-09-25.
- Public map and statistics: https://www.supercounters.com/stats/1738914
- Provider setup: https://www.supercounters.com/visitormap
- Privacy policy: https://www.supercounters.com/privacy

The official widget is loaded asynchronously once the document is ready, at browser idle time. Its map remains clickable and a separate keyboard-accessible statistics link is always visible. The widget uses the provider's map size/color options, with no redrawing or example visitor coordinates. The neutral `333333`/50% background preset is intentional: at installation time the provider's custom-background generator returned a PHP error, while this preset was verified to return a valid map image. Provider branding is preserved.

Only the deployed `kuxit.github.io/TAO-homepage/` site initializes the counter. Local files and previews do not send visits, paths, or development URLs. Do Not Track and Global Privacy Control disable initialization. Theme changes and chapter navigation do not count a second visit.

The provider receives visitor IP addresses and browser/page metadata to estimate approximate regions. The footer links its privacy policy. Counts begin when this integration is enabled; this map cannot reconstruct prior Busuanzi visit locations. Ad blockers and network availability can affect coverage. The existing Busuanzi counter remains independent.

To remove the integration, remove the visitor-map section and `assets/js/visitor-map.js` script reference in `index.html`. No credentials are embedded in the site.
