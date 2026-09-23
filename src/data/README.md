# Data publication status

`verified-shares.json` and `freshness.json` are the only datasets used by the current public interface. `scripts/refresh-data.mjs` derives the 23 country nuclear-electricity shares and individual observation years from the [Our World in Data CSV](https://ourworldindata.org/grapher/share-electricity-nuclear.csv). A failed source check retains the prior snapshot and records that state.

`exposure.json`, `reactors.json`, `chokepoints.json`, and `uranium_cycle.json` are **unverified legacy research material**. Some fields were manually entered without dated, record-level primary-source citations. Their numerical values and descriptions must not be treated as current measurements or republished until each record is checked and sourced. The active app does not import these files.
