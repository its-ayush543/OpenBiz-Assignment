'use client';
import React from 'react';

export default function FieldRenderer({ field, register, errors }) {
  const id = `fld_${field.name}`;
  const errorMsg = errors?.[field.name]?.message;

  // Layout tweaks: make checkbox and long fields span full width
  const spanClass =
    field.type === 'checkbox' ? 'col-span-1 sm:col-span-2' : (field.fullWidth ? 'col-span-1 sm:col-span-2' : '');

  if (field.type === 'select') {
    return (
      <div className={`flex flex-col ${spanClass}`}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <select
          id={id}
          className={`w-full border rounded p-2 focus:outline-none focus:border-blue-500 ${
            errorMsg ? 'border-red-500' : 'border-gray-300'
          }`}
          defaultValue=""
          {...register(field.name)}
        >
          <option value="" disabled>
            Select
          </option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {errorMsg && <p className="text-red-600 text-xs mt-1">{errorMsg}</p>}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <div className={`flex items-start gap-2 ${spanClass}`}>
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-4 w-4 border-gray-300 rounded"
          {...register(field.name)}
        />
        <label htmlFor={id} className="text-sm text-gray-700">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        {errorMsg && <p className="text-red-600 text-xs mt-1">{errorMsg}</p>}
      </div>
    );
  }

  // default: text input
  return (
    <div className={`flex flex-col ${spanClass}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={field.inputType || 'text'}
        inputMode={field.inputMode}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        className={`w-full border rounded p-2 focus:outline-none focus:border-blue-500 ${
          errorMsg ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register(field.name)}
      />
      {errorMsg && <p className="text-red-600 text-xs mt-1">{errorMsg}</p>}
    </div>
  );
}
