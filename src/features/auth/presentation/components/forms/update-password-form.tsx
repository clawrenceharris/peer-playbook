"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useRouter } from "next/navigation";
import { Form, InputField } from "@/components/form";
import {
  updatePasswordSchema,
  type UpdatePasswordFormValues,
} from "@/lib/validation";
import { useResetPasswordForm } from "../../hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { form, resetPassword, isLoading, success } = useResetPasswordForm();

  return (
    <>
      {success ? (
        <>
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">All Done!</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-sm">
                Your password was successfully updated.
              </CardDescription>
            </CardContent>

            <CardFooter className="justify-start">
              <CardAction>
                <Button
                  className="w-full"
                  variant="primary"
                  onClick={() => router.push("/login")}
                >
                  Log in
                </Button>
              </CardAction>
            </CardFooter>
          </Card>
        </>
      ) : (
        <Form<UpdatePasswordFormValues>
          form={form}
          enableBeforeUnloadProtection={false}
          title="Reset Your Password"
          description="Please enter your new password below."
          showsCancelButton={false}
          handleSubmit={resetPassword}
          isLoading={isLoading}
        >
          <div className="space-y-2">
            <InputField<UpdatePasswordFormValues, "password">
              label="New password"
              name="password"
              required
              type="password"
              placeholder="Enter your new password"
            />
            <div className="flex justify-end">
              <Link
                href="/login"
                className="text-primary ml-auto inline-block text-sm font-medium underline-offset-4 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </div>
        </Form>
      )}
    </>
  );
}
