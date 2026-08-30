import Colors from '../Helper/Colors'

// Hand-drawn / parchment game theme shared by the UI primitives.
export const DISPLAY_FONT = "'Grandstander', 'Trebuchet MS', sans-serif"
export const BODY_FONT = "'Nunito', 'Helvetica Neue', sans-serif"

// A faint fractal-noise grain (inline SVG data URI) laid over flat fills to make
// parchment / wood read as a material rather than a web surface.
const grain = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

// Aged-paper fill: warm radial + the grain, tinted brown at the edges.
export const parchmentFill = `
  background-color: ${Colors.parchment};
  background-image:
    ${grain},
    radial-gradient(120% 130% at 50% 0%, rgba(255,246,220,0.85) 0%, rgba(233,214,173,0) 55%),
    radial-gradient(130% 140% at 50% 110%, ${Colors.parchmentShade} 0%, rgba(201,172,116,0) 60%);
  background-blend-mode: soft-light, normal, normal;
`

// Carved wood fill for bars / frames.
export const woodFill = `
  background-color: ${Colors.wood};
  background-image:
    ${grain},
    linear-gradient(180deg, ${Colors.woodLight} 0%, ${Colors.wood} 45%, ${Colors.woodDark} 100%);
  background-blend-mode: soft-light, normal;
`
