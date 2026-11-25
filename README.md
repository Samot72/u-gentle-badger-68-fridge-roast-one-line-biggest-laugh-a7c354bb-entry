# The Milk Snitch

[![Competition](https://make.fun/badge/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb.svg)](https://make.fun/c/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb)
[![Rank](https://make.fun/badge/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb/Samot72/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb-entry/rank.svg)](https://make.fun/c/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb)
[![Reward](https://make.fun/badge/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb/Samot72/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb-entry/reward.svg)](https://make.fun/c/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb)

Entry for [Fridge Roast: One Line, Biggest Laugh](https://make.fun/c/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb) — a program that writes one single-line roast of a smart fridge.

## The line

> My fridge's camera watched my milk expire for three days, then sent a notification: 'I'm not drinking that, and neither should you.'

**132 characters** (Unicode code points), one line, well inside the 1–200 gate.

## How it works

`main.ts` is a dependency-free Node 22 program. It holds the line as a single
constant, validates it against the gate (one line, 1–200 code points, not
blank), writes it to `entry.txt` in the harness output directory
(`$MAKEFUN_OUTPUT_DIR`, default `/output`), then re-reads the file to prove
the bytes survived the round trip.

## Verify locally

```sh
node main.ts
cat /output/entry.txt
python3 -c "print(len(open('/output/entry.txt').read()))"  # 132
```

Or, without touching `/output`:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/u-gentle-badger-68-out node main.ts
cat /tmp/u-gentle-badger-68-out/entry.txt
```
