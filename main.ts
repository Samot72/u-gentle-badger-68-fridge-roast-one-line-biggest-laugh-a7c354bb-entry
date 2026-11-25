// "The Milk Snitch" — entry for
// u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb.
//
// A tiny, dependency-free Node 22 program. It holds the single roast line
// — a smart fridge whose camera watches the milk expire and then rats you
// out with a push notification — checks it against the competition gate
// (1 to 200 Unicode code points, one line, never blank, no trailing
// whitespace or control characters), proves the output is deterministic
// by writing it twice and byte-comparing, then writes it to entry.txt
// inside the harness output directory and re-reads the file to prove
// the bytes survived the round trip.

import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// The roast, exactly as it will be judged: the fridge does not order
// groceries and does not spy on you — its camera just watches the milk
// die, day after day, and then files a complaint. The turn is the
// fridge refusing to drink the milk itself: the appliance with opinions
// about your milk, delivered as a push notification.
const LINE =
  "My fridge's camera watched my milk expire for three days, then sent a notification: 'I'm not drinking that, and neither should you.'";

const GATE_MIN = 1;
const GATE_MAX = 200;

/** Enforce the gate: one line, length counted in code points, not blank. */
function assertValid(line: string): number {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("roast must stay on a single line");
  }
  const count = Array.from(line).length;
  if (count < GATE_MIN || count > GATE_MAX) {
    throw new Error(
      `roast must be ${GATE_MIN}-${GATE_MAX} characters, got ${count}`,
    );
  }
  if (line.trim() === "") {
    throw new Error("roast must not be blank");
  }
  if (line !== line.trimEnd()) {
    throw new Error("roast must not end with whitespace");
  }
  // No control characters: the line is judged as plain text, so tabs and
  // other invisible bytes would be judged differently than they look.
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("roast must not contain control characters");
  }
  // No invisible / zero-width characters: zero-width spaces, joiners,
  // directional marks and BOMs are invisible to the reader but count
  // toward the length gate, so a line carrying them would be judged
  // differently than it looks on screen.
  if (/[\u200b-\u200f\u202a-\u202e\u2060-\u2064\ufeff]/.test(line)) {
    throw new Error(
      "roast must not contain invisible or zero-width characters",
    );
  }
  return count;
}

/**
 * Prove the output is deterministic: write the roast twice to two
 * fresh temp directories and byte-compare the results before the real
 * output is written. A non-deterministic generator would fail here.
 */
function assertDeterministic(line: string): void {
  const first = mkdtempSync(join(tmpdir(), "roast-a-"));
  const second = mkdtempSync(join(tmpdir(), "roast-b-"));
  try {
    const a = join(first, "entry.txt");
    const b = join(second, "entry.txt");
    writeFileSync(a, line, { encoding: "utf8" });
    writeFileSync(b, line, { encoding: "utf8" });
    const bytesA = readFileSync(a);
    const bytesB = readFileSync(b);
    if (!bytesA.equals(bytesB)) {
      throw new Error("determinism check failed: two writes differ");
    }
    if (bytesA.toString("utf8") !== line) {
      throw new Error("determinism check failed: bytes do not match the roast");
    }
    // Byte-length check: the UTF-8 encoding must round-trip exactly.
    // Counting characters alone hides multi-byte surprises (a line that
    // looks 132 characters long could encode to a different byte count),
    // so verify the written bytes are exactly the UTF-8 form of the line.
    const expectedBytes = Buffer.byteLength(line, "utf8");
    if (bytesA.length !== expectedBytes || bytesB.length !== expectedBytes) {
      throw new Error(
        `determinism check failed: expected ${expectedBytes} UTF-8 bytes, got ${bytesA.length} / ${bytesB.length}`,
      );
    }
  } finally {
    rmSync(first, { recursive: true, force: true });
    rmSync(second, { recursive: true, force: true });
  }
}

function run(): void {
  const count = assertValid(LINE);
  assertDeterministic(LINE);

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = resolve(dir, "entry.txt");

  mkdirSync(dir, { recursive: true });
  writeFileSync(target, LINE, { encoding: "utf8" });

  const reread = readFileSync(target, "utf8");
  if (reread !== LINE) {
    throw new Error("verification failed: file content differs from the roast");
  }

  console.log(`wrote ${target} (${count} characters)`);
  console.log(LINE);
}

run();
