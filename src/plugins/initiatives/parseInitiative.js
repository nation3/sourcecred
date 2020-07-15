// @flow
import * as C from "../../util/combo";
import {compatibleParser} from "../../util/compat";
import {COMPAT_INFO, upgradeFrom010} from "./initiativeFile";
import type {
  InitiativeFile,
  InitiativeFileV010,
  InitiativeFileV020,
} from "./initiativeFile";
import type {Compatible} from "../../util/compat";
import {_validateUrl} from "./initiativesDirectory";

const URLParser = C.fmap(C.string, _validateUrl);

export type InitiativesFile = Compatible<InitiativeFile>;

const CommonFields = {
  title: C.string,
  timestampIso: C.string,
  weight: C.object({incomplete: C.number, complete: C.number}),
  completed: C.boolean,
};

const Parse_020: C.Parser<InitiativeFileV020> = (() => {
  const NodeEntryParser = C.object(
    {
      title: C.string,
      timestampIso: C.string,
      contributors: C.array(URLParser),
    },
    {
      key: C.string,
      weight: C.number,
    }
  );

  const EdgeSpecParser = C.object({
    urls: C.array(URLParser),
    entries: C.array(NodeEntryParser),
  });

  return C.object(CommonFields, {
    contributions: EdgeSpecParser,
    dependencies: EdgeSpecParser,
    references: EdgeSpecParser,
    champions: C.array(URLParser),
  });
})();

const Parse_010: C.Parser<InitiativeFileV010> = (() => {
  return C.object(CommonFields, {
    contributions: C.array(URLParser),
    dependencies: C.array(URLParser),
    references: C.array(URLParser),
    champions: C.array(URLParser),
  });
})();

export const parser: C.Parser<InitiativesFile> = compatibleParser(
  COMPAT_INFO.type,
  {
    "0.2.0": Parse_020,
    "0.1.0": C.fmap(Parse_010, upgradeFrom010),
  }
);
