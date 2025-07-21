import {
  createForm,
  createFormHookContexts,
  createFormHook,
} from '@tanstack/solid-form';
import { Index } from 'solid-js';

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
  },
  formComponents: {},
});

function TextField(props: { label: string; placeholder: string }) {
  const field = useFieldContext<string>();
  return (
    <label
      for={field().name}
      class="block text-sm font-medium mb-2 dark:text-white"
    >
      <span>{props.label}</span>
      <input
        id={field().name}
        name={field().name}
        type="text"
        class="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        placeholder={props.placeholder}
        value={field().state.value}
        onInput={(e) => field().handleChange(e.target.value)}
        onBlur={field().handleBlur}
      />
    </label>
  );
}

function TextareaField(props: { label: string; placeholder: string }) {
  const field = useFieldContext<string>();
  return (
    <>
      <label
        for={field().name}
        class="block text-sm font-medium mb-2 dark:text-white"
      >
        {props.label}
      </label>
      <textarea
        id={field().name}
        name={field().name}
        class="py-2 px-3 sm:py-3 sm:px-4 block w-full min-h-48 placeholder:italic border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        placeholder={props.placeholder}
        value={field().state.value}
        onInput={(e) => field().handleChange(e.target.value)}
        onBlur={field().handleBlur}
      ></textarea>
    </>
  );
}

function SelectField(props: {
  options: string[];
  label: string;
  placeholder: string;
}) {
  const field = useFieldContext<string>();
  return (
    <>
      <label
        for={field().name}
        class="block text-sm font-medium mb-2 dark:text-white"
      >
        {props.label}
      </label>
      <select class="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
        <Index each={props.options}>
          {(option) => <option value={option()}>{option()}</option>}
        </Index>
      </select>
    </>
  );
}

export function EstimateForm() {
  const form = useAppForm(() => ({
    defaultValues: {
      brandName: '',
      brandPrimaryColor: '#6F4E37',
      description: '',
      numberOfPages: '1',
      numberOfRevisions: '2',
      deliveryTime: '2d-3d',
    },
  }));

  return (
    <form
      class="grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* Brand name */}
      <form.AppField
        name="brandName"
        children={(field) => (
          <field.TextField label="Brand name" placeholder="My company name" />
        )}
      />

      {/* Brand primary color */}
      <form.AppField
        name="brandPrimaryColor"
        children={(field) => (
          <field.TextField label="Brand primary color" placeholder="#6F4E37" />
        )}
      />

      {/* Description */}
      <form.AppField
        name="description"
        children={(field) => (
          <field.TextareaField
            label="Description"
            placeholder="e.g: I need a modern, responsive website for my coffee shop called 'Morning Brew'. The website should include:
- Homepage with hero section and featured products
- Menu page with categories and items
- About Us page with our story and team
- Contact page with a contact form and location map

Key features needed:
- Online ordering system
- Mobile-responsive design
- Photo gallery
- Social media integration
- Blog section for coffee tips

Brand colors: Brown (#6F4E37) and cream (#F5F5DC)"
          />
        )}
      />

      {/* Number of pages */}
      <form.AppField
        name="numberOfPages"
        children={(field) => (
          <field.SelectField
            options={['1', '2', '3', '4']}
            label="Number of pages"
            placeholder="Number of pages"
          />
        )}
      />

      {/* Number of revisions */}
      <form.AppField
        name="numberOfRevisions"
        children={(field) => (
          <field.SelectField
            options={['2', '3', '4']}
            label="Number of revisions"
            placeholder="Number of revisions"
          />
        )}
      />

      {/* Delivery time */}
      <form.AppField
        name="deliveryTime"
        children={(field) => (
          <field.SelectField
            options={['2d-3d', '3d-5d']}
            label="Delivery time"
            placeholder="Delivery time"
          />
        )}
      />

      {/* Submit button */}
      <button
        type="submit"
        class="py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        Submit
      </button>
    </form>
  );
}
