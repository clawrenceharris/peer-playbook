import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, expectTypeOf, it } from "vitest";
import type { PlaybookPageCreatorDTO } from "@/features/playbooks/application/dto/PlaybookPageDTO";
import type { PlaybooksPagePlaybookCardDTO } from "@/features/playbooks/application/dto/PlaybooksPageDTO";
import type { SessionListItemDTO } from "@/features/sessions/application/dto";
import type { UserSummaryDTO } from "@/shared/application";

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

  it("keeps application inputs independent of validation schemas", () => {
    const inputFiles = [
      "src/features/playbooks/application/dto/CreatePlaybookDTO.ts",
      "src/features/playbooks/application/dto/GeneratePlaybookDTO.ts",
      "src/features/playbooks/application/dto/UpdatePlaybookDTO.ts",
      "src/features/playbooks/application/dto/UpdatePlaybookStrategyDTO.ts",
      "src/features/sessions/application/dto/CreateSessionDTO.ts",
      "src/features/sessions/application/dto/UpdateSessionDTO.ts",
      "src/features/profile/application/dto/UpdateProfileInput.ts",
    ].map((file) => join(process.cwd(), file));

    const violations = inputFiles
      .filter((file) => /from\s+["'][^"']*lib\/validation/.test(readFileSync(file, "utf8")))
      .map((file) => relative(process.cwd(), file));

    expect(violations).toEqual([]);
  });

  it("uses the shared user summary for creator and instructor projections", () => {
    expectTypeOf<SessionListItemDTO["instructor"]>().toEqualTypeOf<UserSummaryDTO>();
    expectTypeOf<PlaybookPageCreatorDTO>().toEqualTypeOf<UserSummaryDTO>();
    expectTypeOf<PlaybooksPagePlaybookCardDTO["creator"]>().toEqualTypeOf<UserSummaryDTO>();
  });
});
