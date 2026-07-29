import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const featureRoot = join(process.cwd(), "src/features");
const forbiddenLayerImport =
  /from\s+["'][^"']*(?:\/(?:application|infrastructure|presentation)(?:\/|["']))/;

function listDomainFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      return listDomainFiles(path);
    }

    return path.endsWith(".ts") || path.endsWith(".tsx") ? [path] : [];
  });
}

describe("feature domain boundaries", () => {
  it("does not import application, infrastructure, or presentation layers", () => {
    const violations = listDomainFiles(featureRoot)
      .filter((file) => file.includes("/domain/"))
      .filter((file) => forbiddenLayerImport.test(readFileSync(file, "utf8")))
      .map((file) => relative(process.cwd(), file));

    expect(violations).toEqual([]);
  });

  it("keeps playbook application inputs independent of validation schemas", () => {
    const inputFiles = [
      "CreatePlaybookDTO.ts",
      "GeneratePlaybookDTO.ts",
      "UpdatePlaybookDTO.ts",
      "UpdatePlaybookStrategyDTO.ts",
    ].map((file) =>
      join(
        process.cwd(),
        "src/features/playbooks/application/dto",
        file,
      ),
    );

    const violations = inputFiles
      .filter((file) => /from\s+["'][^"']*lib\/validation/.test(readFileSync(file, "utf8")))
      .map((file) => relative(process.cwd(), file));

    expect(violations).toEqual([]);
  });
});
