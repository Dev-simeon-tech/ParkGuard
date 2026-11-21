import { zodResolver } from '@hookform/resolvers/zod';
import type { InviteMemberBody } from '@parkguard/schemas';
import type { RoleSummary, BranchSummary } from '@parkguard/types';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { InviteMemberBodySchema, UpdateEmployeeBodySchema } from '../schemas';
import { formatRoleName } from '../utils';

export type EmployeeFormProps = {
  mode: 'add' | 'edit';
  defaultValues?: Partial<InviteMemberBody>;
  roles: RoleSummary[];
  branches: BranchSummary[];
  onSubmit: (values: Partial<InviteMemberBody>) => Promise<unknown>;
  submitLabel: string;
};

export function EmployeeForm({
  mode,
  defaultValues,
  roles,
  onSubmit,
  submitLabel,
  branches,
}: EmployeeFormProps) {
  const form = useForm<Partial<InviteMemberBody>>({
    resolver: zodResolver(mode === 'add' ? InviteMemberBodySchema : UpdateEmployeeBodySchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      ...defaultValues,
    },
  });

  const selectedRoleId = useWatch({
    control: form.control,
    name: 'roleId',
  });
  const showBranches = roles.some(
    (role) => role.id === selectedRoleId && role.name === 'attendant',
  );
  const requiresBranch = showBranches && branches.length === 0;

  useEffect(() => {
    if (!showBranches) {
      form.setValue('branchIds', undefined);
    }
  }, [form, showBranches]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode === 'add' ? (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input autoComplete="given-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input autoComplete="family-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" autoComplete="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {formatRoleName(role.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {showBranches && branches.length > 0 && (
          <FormField
            control={form.control}
            name="branchIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select
                  value={Array.isArray(field.value) ? field.value[0] : field.value}
                  onValueChange={(value) => field.onChange(value ? [value] : undefined)}
                  required
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {formatRoleName(branch.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {requiresBranch && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            Create a branch before assigning an attendant.
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || requiresBranch}
        >
          {form.formState.isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
