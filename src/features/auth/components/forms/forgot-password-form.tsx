'use client'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema,ForgotPasswordFormInput } from '../../domain'
import { Form, InputField } from '@/components/form'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [success, setSuccess] = useState(false)

  const handleForgotPassword = async (email: string) => {
    // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you registered using your email and password, you will receive a password reset
              email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Type in your email and we&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form<ForgotPasswordFormInput> 
              resolver={zodResolver(forgotPasswordSchema)}
              onSubmit={({ email }) => handleForgotPassword(email)}
              onSuccess={() => setSuccess(true)}
              showsCancelButton={false}
            >
                
                  
              <InputField<ForgotPasswordFormInput> 
                name="email"
                label="Email"
                defaultValue=""
                placeholder="Email"
              />
            
             
            </Form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium underline text-secondary-400">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
