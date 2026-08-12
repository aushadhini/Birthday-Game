/**
 * Level 1 bubble placement.
 *
 * The 29 collectibles used to sit on a hard-coded percentage grid, which meant
 * that on a phone — where the quest card is nearly as wide as the screen — half
 * of them landed on top of the card and were unreadable (and the card covered
 * their glow). This computes the positions instead: the card's real measured
 * box is a keep-out zone, and the bubbles fill only the sky *around* it.
 *
 * They should read as small things drifting in the air, not as a grid pinned to
 * the wall, so three things fight the grid look:
 *   · every other row is offset by half a cell
 *   · each bubble gets its own size from a small depth ramp — the little ones
 *     read as further away, which is where the 3D feel comes from
 *   · each one is nudged off its cell centre by a hash of its index, by up to
 *     the slack the cell has left over
 * The cell is deliberately much larger than the bubble it holds. That slack is
 * both the jitter budget and the guarantee that two bubbles can never touch.
 *
 * If the free sky can't hold every bubble at the current viewport size (small
 * phones), the field grows taller than the screen and the page scrolls — the
 * hunt simply extends above and below the card instead of overlapping it.
 *
 * Pure function, viewport in / pixels out, so it can be reasoned about without
 * a browser.
 */

/** How much room each bubble gets to drift in, as a share of its own size. */
const CELL_SLACK = 0.62;
const CARD_GAP = 22; // keep-out margin around the quest card
const EDGE_PAD = 8; // never let a bubble touch a screen edge

/* Fixed UI that floats above the bubbles (z-40 to their z-30). A bubble parked
   under one of these is untappable, and with all 29 required that makes the
   level unfinishable — so these corners stay empty. Only the corners at the
   very top / very bottom of the field matter: everything in between scrolls out
   from under the buttons. */
const TOP_LEFT_BADGE = 64; // the secret ✦ pinned top-left
const BOTTOM_BAR = 104; // music button (left) + storybook button (right)
const BOTTOM_CORNER = 104;

/* Phone layout only: the fixed ✦ (top-left) and Back (top-right) get a strip of
   their own along the very top, and the HUD bar starts below it. They used to
   land on top of the bar, which put the ✦ over the level label. */
const TOP_STRIP = 56;

/* Depth ramp. A bubble's size is its base size times one of these — small ones
   sit "further back". Widest step first so the cell maths can assume the max. */
const DEPTH_STEPS = [1, 0.86, 0.72, 0.93, 0.79];
const MAX_DEPTH = 1;

/** Base bubble size. Deliberately small — these are meant to feel delicate. */
export function collectibleSize(viewportWidth, viewportHeight) {
  if (viewportHeight <= 520) return 26; // landscape phone
  return viewportWidth >= 640 ? 42 : 34;
}

/** Deterministic 0..1 hash — same bubble, same nudge, every render. */
function noise(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** The size of bubble `i`, from the depth ramp. */
export function bubbleSize(index, baseSize) {
  return Math.round(baseSize * DEPTH_STEPS[index % DEPTH_STEPS.length]);
}

/**
 * Two shapes of level, because a phone can't hold the desktop one:
 *   · 'center' — the quest card sits in the middle of the sky and the bubbles
 *     fill the bands around it. Wants a screen wide enough for side bands.
 *   · 'top' — the card is a slim HUD bar pinned to the top and the entire rest
 *     of the screen is open air. This is the phone layout: no scrolling, and
 *     the bubbles get the whole page instead of two cramped strips.
 */
export const ANCHOR = { CENTER: 'center', TOP: 'top' };

/** Phones and landscape phones get the HUD-bar layout. */
export function questAnchor(viewportWidth, viewportHeight) {
  return viewportWidth < 640 || viewportHeight < 560 ? ANCHOR.TOP : ANCHOR.CENTER;
}

/**
 * @returns {{ fieldHeight: number, cardTop: number, itemSize: number,
 *   anchor: string, slots: {x:number,y:number,size:number}[] }}
 *   `slots` are bubble centres in field coordinates; index i belongs to
 *   collectible i, so a bubble never moves once the layout is settled. The
 *   caller must place the card at `cardTop` — the bubbles are laid out around
 *   exactly that box, not around wherever CSS happens to centre it.
 */
export function computeQuestLayout({
  fieldWidth,
  viewportHeight,
  cardWidth,
  cardHeight,
  itemSize,
  count,
  anchor = ANCHOR.CENTER,
}) {
  const maxSize = itemSize * MAX_DEPTH;
  const minCell = Math.round(maxSize * (1 + CELL_SLACK));
  const columns = Math.max(1, Math.floor((fieldWidth - 2 * EDGE_PAD) / minCell));

  let fieldHeight = Math.max(
    viewportHeight,
    anchor === ANCHOR.TOP ? TOP_STRIP + cardHeight : cardHeight + 2 * (CARD_GAP + EDGE_PAD),
  );
  let slots = [];

  // Grow the sky until every bubble has somewhere to be. With a centred card
  // each extra row has to be added twice, since height splits above and below.
  for (let attempt = 0; attempt < 24; attempt += 1) {
    slots = pickSlots({ fieldWidth, fieldHeight, cardWidth, cardHeight, maxSize, count, anchor });
    if (slots.length >= count) break;
    const missing = count - slots.length;
    fieldHeight += Math.ceil(missing / columns) * minCell * (anchor === ANCHOR.TOP ? 1 : 2);
  }

  return {
    fieldHeight: Math.round(fieldHeight),
    cardTop: anchor === ANCHOR.TOP ? TOP_STRIP : Math.round((fieldHeight - cardHeight) / 2),
    itemSize,
    anchor,
    slots: slots.slice(0, count).map((slot, i) => ({ ...slot, size: bubbleSize(i, itemSize) })),
  };
}

function pickSlots({ fieldWidth, fieldHeight, cardWidth, cardHeight, maxSize, count, anchor }) {
  const topAnchored = anchor === ANCHOR.TOP;
  const cardTop = topAnchored ? TOP_STRIP : (fieldHeight - cardHeight) / 2;
  const cardBottom = cardTop + cardHeight;
  const cardLeft = topAnchored ? EDGE_PAD : (fieldWidth - cardWidth) / 2;
  const cardRight = topAnchored ? fieldWidth - EDGE_PAD : cardLeft + cardWidth;

  // Above and below run the full width; the side bands only span the card, so
  // the four regions never overlap and no two bubbles can be placed twice. The
  // HUD bar spans the width, so all that's left below it is one big open band.
  const bands = topAnchored
    ? [{ x0: EDGE_PAD, x1: fieldWidth - EDGE_PAD, y0: cardBottom + CARD_GAP, y1: fieldHeight - EDGE_PAD }]
    : [
        { x0: EDGE_PAD, x1: fieldWidth - EDGE_PAD, y0: EDGE_PAD, y1: cardTop - CARD_GAP },
        { x0: EDGE_PAD, x1: fieldWidth - EDGE_PAD, y0: cardBottom + CARD_GAP, y1: fieldHeight - EDGE_PAD },
        { x0: EDGE_PAD, x1: cardLeft - CARD_GAP, y0: cardTop - CARD_GAP, y1: cardBottom + CARD_GAP },
        { x0: cardRight + CARD_GAP, x1: fieldWidth - EDGE_PAD, y0: cardTop - CARD_GAP, y1: cardBottom + CARD_GAP },
      ];

  // Size the grid to the room actually available rather than to a fixed cell:
  // 29 bubbles in a whole open screen should breathe, the same 29 squeezed into
  // two side strips should tighten up. Start from what the free area suggests
  // and tighten until they all fit — a taller field is the last resort, never
  // the answer to spacing we could have given up instead.
  const freeArea = bands.reduce((sum, b) => sum + Math.max(0, b.x1 - b.x0) * Math.max(0, b.y1 - b.y0), 0);
  const minCell = maxSize * (1 + CELL_SLACK);
  const maxCell = Math.max(minCell, Math.min(Math.sqrt(freeArea / (count * 1.6)), maxSize * 2.8));

  let cell = minCell;
  let grids = [];
  let capacity = 0;
  for (let step = 0; step <= 10; step += 1) {
    const candidate = Math.round(maxCell - ((maxCell - minCell) * step) / 10);
    const candidateGrids = bands.map((band) => bandSlots(band, candidate, maxSize, fieldWidth, fieldHeight));
    const candidateCapacity = candidateGrids.reduce((sum, g) => sum + g.length, 0);
    cell = candidate;
    grids = candidateGrids;
    capacity = candidateCapacity;
    if (capacity >= count) break;
  }
  if (capacity < count) return [];

  // Spread the bubbles across the bands in proportion to how much room each one
  // has, so a roomy top band doesn't swallow all 29 while the sides stay empty.
  // Within a band, take evenly spaced cells for the same reason.
  const quotas = grids.map((g) => Math.floor((count * g.length) / capacity));
  let remainder = count - quotas.reduce((a, b) => a + b, 0);
  for (let i = 0; remainder > 0; i = (i + 1) % grids.length) {
    if (quotas[i] < grids[i].length) {
      quotas[i] += 1;
      remainder -= 1;
    }
  }

  const chosen = [];
  grids.forEach((grid, bandIndex) => {
    const take = quotas[bandIndex];
    for (let k = 0; k < take; k += 1) {
      chosen.push(grid[Math.floor((k * grid.length) / take)]);
    }
  });

  // Nudge each bubble off its cell centre, by up to the slack the cell has
  // spare. Bounded that way, two bubbles still can't reach each other.
  const slack = Math.max(0, (cell - maxSize) / 2);
  return chosen.map((slot, i) => {
    const x = Math.round(slot.x + (noise(i + 1) * 2 - 1) * slack);
    const y = Math.round(slot.y + (noise(i + 41) * 2 - 1) * slack);
    if (isBlocked(x, y, maxSize, fieldWidth, fieldHeight)) {
      return { x: Math.round(slot.x), y: Math.round(slot.y) };
    }
    return { x, y };
  });
}

function bandSlots(band, cell, maxSize, fieldWidth, fieldHeight) {
  const width = band.x1 - band.x0;
  const height = band.y1 - band.y0;
  const rows = Math.floor(height / cell);
  if (rows < 1) return [];
  // Odd rows are offset by half a cell, so the field never reads as columns —
  // which costs those rows one column's worth of width.
  const cols = Math.floor(width / cell);
  const staggeredCols = Math.floor((width - cell / 2) / cell);
  if (cols < 1) return [];

  const originY = band.y0 + (height - rows * cell) / 2;

  const slots = [];
  for (let row = 0; row < rows; row += 1) {
    const stagger = row % 2 === 1;
    const rowCols = stagger ? staggeredCols : cols;
    if (rowCols < 1) continue;
    const rowWidth = rowCols * cell + (stagger ? cell / 2 : 0);
    const originX = band.x0 + (width - rowWidth) / 2 + (stagger ? cell / 2 : 0);
    for (let col = 0; col < rowCols; col += 1) {
      const x = originX + col * cell + cell / 2;
      const y = originY + row * cell + cell / 2;
      if (isBlocked(x, y, maxSize, fieldWidth, fieldHeight)) continue;
      slots.push({ x, y });
    }
  }
  return slots;
}

/** True where a fixed, higher-z button would sit on top of the bubble. */
function isBlocked(x, y, size, fieldWidth, fieldHeight) {
  const half = size / 2;
  const nearTop = y - half < TOP_LEFT_BADGE;
  const nearBottom = y + half > fieldHeight - BOTTOM_BAR;
  if (nearTop && x - half < TOP_LEFT_BADGE) return true;
  if (nearBottom && (x - half < BOTTOM_CORNER || x + half > fieldWidth - BOTTOM_CORNER)) return true;
  return false;
}
