import * as yup from 'yup';
import schema from './schema';

// Step 1 regex safely pulled
const aadhaarField = schema.steps[0].fields.find(f => f.name === 'aadhaarNumber');
const aadhaarRegex = aadhaarField?.validation?.regex ? new RegExp(aadhaarField.validation.regex) : null;

// Step 2 regex safely pulled
const panField = schema.steps[1].fields.find(f => f.name === 'pan');
const panRegex = panField?.validation?.regex ? new RegExp(panField.validation.regex) : null;

export const aadhaarSchema = yup.object({
  aadhaarNumber: yup
    .string()
    .required('Aadhaar is required')
    .matches(aadhaarRegex, 'Invalid Aadhaar'),
  nameAsPerAadhaar: yup
    .string()
    .required('Name is required'),
  consent: yup
    .boolean()
    .oneOf([true], 'Consent is required')
});

export const panSchema = yup.object({
  pan: yup
    .string()
    .required('PAN is required')
    .matches(panRegex, 'Invalid PAN'),
  itrFiled: yup
    .string()
    .oneOf(['Yes', 'No'], 'Select Yes or No')
    .required('This field is required'),
  gstRegistered: yup
    .string()
    .oneOf(['Yes', 'No'], 'Select Yes or No')
    .required('This field is required')
});
