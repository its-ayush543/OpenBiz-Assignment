import * as yup from 'yup';

export const aadhaarSchema = yup.object({
  aadhaarNumber: yup
    .string()
    .matches(/^[0-9]{12}$/, 'Invalid Aadhaar number')
    .required('Aadhaar number is required'),
  nameAsPerAadhaar: yup.string().required('Name is required'),
  consent: yup.boolean().oneOf([true], 'Consent is required'),
});

export const panSchema = yup.object({
  pan: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
    .required('PAN is required'),
  itrFiled: yup.string().oneOf(['Yes', 'No']).required(),
  gstRegistered: yup.string().oneOf(['Yes', 'No']).required(),
});
