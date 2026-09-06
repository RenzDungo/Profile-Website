// Responsive image sets. Every photo ships in several widths so the browser
// picks the smallest one that still looks sharp for the slot it is drawn in
// (a 6240px-wide camera original decoded on the main thread was the single
// biggest cost on the page). Aspect ratios match the originals exactly, so
// the layout the CSS produces is unchanged.
import profile640 from "./profile-640.webp";
import profile960 from "./profile-960.webp";
import profile1280 from "./profile-1280.webp";
import profile1920 from "./profile-1920.webp";

import lpcb640 from "./lpcb-640.webp";
import lpcb960 from "./lpcb-960.webp";
import lpcb1280 from "./lpcb-1280.webp";
import lpcb1600 from "./lpcb-1600.webp";

import spcb640 from "./spcb-640.webp";
import spcb960 from "./spcb-960.webp";
import spcb1280 from "./spcb-1280.webp";
import spcb1600 from "./spcb-1600.webp";

import spcb2_640 from "./spcb2-640.webp";
import spcb2_960 from "./spcb2-960.webp";
import spcb2_1280 from "./spcb2-1280.webp";
import spcb2_1600 from "./spcb2-1600.webp";

export interface ImageSet {
  src: string;
  srcSet: string;
  // Pixel dimensions of the ORIGINAL file. The resized copies cannot always
  // hit this ratio exactly, so the <img> pins it with CSS aspect-ratio; that
  // keeps every window the same height it had with the full-size image.
  width: number;
  height: number;
  aspectRatio: string;
}

function set(entries: [string, number][], width: number, height: number, fallbackIndex = 1): ImageSet {
  return {
    src: entries[fallbackIndex][0],
    srcSet: entries.map(([url, w]) => `${url} ${w}w`).join(", "),
    width,
    height,
    aspectRatio: `${width} / ${height}`,
  };
}

export const profileImage = set(
  [
    [profile640, 640],
    [profile960, 960],
    [profile1280, 1280],
    [profile1920, 1920],
  ],
  6240,
  3512
);

export const lightPcbImage = set(
  [
    [lpcb640, 640],
    [lpcb960, 960],
    [lpcb1280, 1280],
    [lpcb1600, 1600],
  ],
  2361,
  1279
);

export const spotifyPcbTopImage = set(
  [
    [spcb640, 640],
    [spcb960, 960],
    [spcb1280, 1280],
    [spcb1600, 1600],
  ],
  2363,
  1295
);

export const spotifyPcbBottomImage = set(
  [
    [spcb2_640, 640],
    [spcb2_960, 960],
    [spcb2_1280, 1280],
    [spcb2_1600, 1600],
  ],
  2362,
  1294
);

// How wide the photo windows render relative to the viewport, mirroring the
// Bootstrap column widths used on each page. Slightly generous on purpose so
// the browser never picks a candidate that is too small.
export const PORTRAIT_SIZES = "(min-width: 992px) 33vw, (min-width: 768px) 42vw, 100vw";
export const PCB_PHOTO_SIZES = "(min-width: 992px) 42vw, (min-width: 768px) 50vw, 100vw";
