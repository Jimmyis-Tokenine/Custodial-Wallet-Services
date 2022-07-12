import * as fs from "fs";

export function writeFile(path: string, data: string): Promise<[boolean, string | null | undefined]> {
  return new Promise((resolve, reject) => {
      const _dir = path.split("/").slice(0, -1).join("/");
      makeDir(_dir)
      .then((r: boolean) => {
          fs.writeFile(path, data, (err: NodeJS.ErrnoException | null) => {
              if (err) reject([ false, err ]);
              resolve( [ true, null ]);
          });
      })
      .catch((e: NodeJS.ErrnoException) => reject([false, e]));
  });
};

export function readFile(path: string): Promise<[boolean, string, string | undefined]> {
  return new Promise((resolve, reject) => {
      fs.readFile(path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
          if (err) reject([ false, "", err ]);
          resolve( [ true, data.toString(), undefined ]);
      });
  });
};

export function makeDir(path: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
      fs.mkdir(path, { recursive: true }, (err: NodeJS.ErrnoException | null) => {
          if (err) reject(err);
          resolve(true);
      });
  });
};
