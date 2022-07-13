import * as fs from "fs";

export function writeFile(path: string, data: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
      const _dir = path.split("/").slice(0, -1).join("/");
      makeDir(_dir)
      .then((r: boolean) => {
          fs.writeFile(path, data, (err: NodeJS.ErrnoException | null) => {
              if (err) reject(err);
              resolve(true);
          });
      })
      .catch((e: NodeJS.ErrnoException) => reject(e));
  });
};

export function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
      fs.readFile(path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
          if (err) reject(err);
          resolve(data?.toString());
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
