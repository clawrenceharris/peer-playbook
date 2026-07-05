import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { fail, ok, Result } from "@/shared/application";

export type SignOutUseCaseResult = Result<void, ApplicationError>;
export class SignOutUserUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(): Promise<SignOutUseCaseResult> {
    try {
      await this.authProvider.signOut();
      return ok(undefined);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
