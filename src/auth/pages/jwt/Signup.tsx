import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { useAuthContext } from '../../useAuthContext';
import { toAbsoluteUrl } from '@/utils';
import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false
};

const signupSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First Name is required'),
  last_name: Yup.string().optional().min(3, 'Minimum 3 symbols').max(50, 'Maximum 50 symbols'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions')
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = '/auth/login';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!register) {
          throw new Error('JWTProvider is required for this form.');
        }
        await register(values.first_name, values.last_name, values.email, values.password);
        navigate(from, { replace: true });
      } catch (error) {
        console.error(error);
        setStatus('The sign up details are incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  const togglePassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="card max-w-[370px] w-full lg:h-[34rem] lg:overflow-y-scroll no-scrollbar">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center mb-2 flex flex-col items-center justify-center gap-2">
          <img
            src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
            className="h-[32px] max-w-none  "
            alt=""
          />
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2">Sign up</h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Link to={'/auth/login'} className="btn btn-light btn-sm justify-center">
            Sign In
          </Link>

          <Link to={'/auth/signup'} className="btn btn-sm btn-input disabled justify-center">
            Sign Up
          </Link>
        </div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}
        <div className="flex flex-col gap-1">
          <label className="input">
            <input
              placeholder="First Name"
              type="text"
              autoComplete="off"
              {...formik.getFieldProps('first_name')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.first_name && formik.errors.first_name },
                {
                  'is-valid': formik.touched.first_name && !formik.errors.first_name
                }
              )}
            />
          </label>
          {formik.touched.first_name && formik.errors.first_name && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.first_name}
            </span>
          )}
        </div>

        {/* <div className="flex flex-col gap-1">
          <label className="input">
            <input
              placeholder="Last Name"
              type="text"
              autoComplete="off"
              {...formik.getFieldProps('last_name')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.last_name && formik.errors.last_name },
                {
                  'is-valid': formik.touched.last_name && !formik.errors.last_name
                }
              )}
            />
          </label>
          {formik.touched.last_name && formik.errors.last_name && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.last_name}
            </span>
          )}
        </div> */}

        <div className="flex flex-col gap-1">
          <label className="input">
            <input
              placeholder="Email"
              type="email"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email
                }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              autoComplete="off"
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password
                }
              )}
            />
            <button className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showPassword })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              autoComplete="off"
              {...formik.getFieldProps('changepassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword
                }
              )}
            />
            <button className="btn btn-icon" onClick={toggleConfirmPassword}>
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', { hidden: showConfirmPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showConfirmPassword })}
              />
            </button>
          </label>
          {formik.touched.changepassword && formik.errors.changepassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.changepassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary flex justify-center "
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Please wait...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export { Signup };
