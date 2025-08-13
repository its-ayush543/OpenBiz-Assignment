'use client';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FieldRenderer from './FieldRenderer';
import schema from '../../lib/schema';
import { aadhaarSchema, panSchema } from '../../lib/validation';

export default function DynamicForm() {
  const [step, setStep] = useState(1);

  const resolver = useMemo(() => (step === 1 ? aadhaarSchema : panSchema), [step]);
  const stepDef = schema.steps[step - 1];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues
  } = useForm({
    resolver: yupResolver(resolver),
    mode: 'onTouched',
  });

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const onSubmit = async (data) => {
    try {
      // For step 2, send step 1 data as well
      let payload = data;
      if (step === 2) {
        payload = { ...getValues(), ...data };
      }

            const res = await fetch(`${apiBase}/api/step${step}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Something went wrong');

      if (step === 1) {
        alert('✅ Aadhaar Verified. Proceeding to Step 2.');
        setStep(2);
        reset({}, { keepValues: true });
      } else {
        alert('✅ PAN Verified and saved to DB.');
        reset();
        setStep(1);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const onBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`h-2 flex-1 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
        <div className={`h-2 flex-1 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
      </div>

      <h1 className="text-xl font-semibold text-gray-800">{stepDef.title}</h1>
      <p className="text-sm text-gray-500 mt-1">Step {step} of 2</p>

      <form
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {stepDef.fields.map((f) => (
          <FieldRenderer key={f.name} field={f} register={register} errors={errors} />
        ))}

        <div className="col-span-1 sm:col-span-2 flex items-center justify-between gap-3 mt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={step === 1 || isSubmitting}
            className={`px-4 py-2 rounded border text-sm ${
              step === 1 ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Back
          </button>

          <button
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            type="submit"
          >
            {step === 1 ? 'Validate & Generate OTP' : 'Verify PAN'}
          </button>
        </div>
      </form>
    </div>
  );
}
