import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateBranchBody, UpdateBranchBody } from '@parkguard/schemas';
import { CircleQuestionMark } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/Input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { CreateBranchBodySchema, UpdateBranchBodySchema } from '../schemas';

export type BranchFormProps = {
  mode: 'add' | 'edit';
  defaultValues?: Partial<CreateBranchBody | UpdateBranchBody>;
  onSubmit: (values: Partial<CreateBranchBody | UpdateBranchBody>) => Promise<unknown>;
  submitLabel: string;
};

export function BranchForm({ mode, defaultValues, onSubmit, submitLabel }: BranchFormProps) {
  const form = useForm<CreateBranchBody | UpdateBranchBody>({
    resolver: zodResolver(mode === 'add' ? CreateBranchBodySchema : UpdateBranchBodySchema),
    defaultValues: {
      name: '',
      state: '',
      address: '',
      totalCapacity: undefined,
      rate: {
        durationMinutes: undefined,
        pricePerDuration: undefined,
        gracePeriodMinutes: undefined,
        dailyMaxAmount: undefined,
      },
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>

              <FormControl>
                <Input placeholder="e.g Westside mall" type="text" autoComplete="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="e.g Lagos" autoComplete="state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g no. 2 peter street" autoComplete="address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="totalCapacity"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-1">
                <FormLabel>Total Capacity (slots)</FormLabel>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMark size={16} />
                  </TooltipTrigger>
                  <TooltipContent>
                    This is the total number of parking slots available
                  </TooltipContent>
                </Tooltip>
              </div>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="number"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={field.value ?? ''}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, '');
                    field.onChange(value === '' ? null : Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-col-1 lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="rate.pricePerDuration"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel>Rate per Interval</FormLabel>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      This is the amount to be charged for each billing interval. For example, if
                      the billing interval is 30 minutes and the rate per interval is 500, then the
                      user will be charged 500 for every 30 minutes of parking.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="number"
                    placeholder="e.g 500"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={field.value ?? ''}
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, '');
                      field.onChange(value === '' ? null : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rate.durationMinutes"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel>Billing Interval (minutes)</FormLabel>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      This is the duration of time for which the rate per interval will be charged.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="number"
                    placeholder="e.g 30, 60, 120"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={field.value ?? ''}
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, '');
                      field.onChange(value === '' ? null : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rate.dailyMaxAmount"
            render={({ field }) => (
              <FormItem className="col-span-2 mt-3">
                <div className="flex items-center gap-1">
                  <FormLabel>Daily Maximum Charge (Optional)</FormLabel>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      This is the maximum amount that can be charged per day. For example, if the
                      daily maximum charge is 5000, then the user will not be charged more than 5000
                      in a single day, regardless of how long they park.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="number"
                    placeholder="e.g 10000"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={field.value ?? ''}
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, '');
                      if (value === '') {
                        field.onChange(mode === 'edit' ? null : undefined);
                        return;
                      }
                      field.onChange(Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rate.gracePeriodMinutes"
            render={({ field }) => (
              <FormItem className="col-span-2 mt-3">
                <div className="flex items-center gap-1">
                  <FormLabel>Grace Period in minutes (Optional)</FormLabel>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      This is the grace period in minutes during which the user will not be charged.
                      For example, if the grace period is 15 minutes, then the user will not be
                      charged if they park for 15 minutes or less.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="number"
                    placeholder="e.g 10, 20"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={field.value ?? ''}
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, '');
                      if (value === '') {
                        field.onChange(mode === 'edit' ? 0 : undefined);
                        return;
                      }
                      field.onChange(Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
