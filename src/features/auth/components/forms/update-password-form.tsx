'use client'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdatePasswordFormInput, updatePasswordSchema } from '@/features/auth/domain'
import { Form, PasswordField } from '@/components/form'

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const {updatePassword, isLoading} = useAuth();
  const [success, setSuccess] = useState(false);  
  const router = useRouter();
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ?
            <>
           
            <p className='text-muted-foreground'>Your password was successfully updated</p>
            <Button variant="link" className="text-primary-400" onClick={() => router.push("/auth/login")}>Log in</Button>
             </>
            :
            <Form<UpdatePasswordFormInput>
            resolver={zodResolver(updatePasswordSchema)}
            onSubmit={({password}) => updatePassword(password)}
            onSuccess={() => setSuccess(true)}
            isLoading={isLoading}
          >
              <PasswordField<UpdatePasswordFormInput>
                label="New password"
                name="password"
                defaultValue=""
              />
             
          
          </Form>}
        </CardContent>
      </Card>
    </div>
  )
}
