import React, { useState } from 'react';
import { Briefcase, Mail, Lock, Eye, EyeOff, User, ArrowRight, Building2, UserCircle2, Shield } from 'lucide-react';
const API=import.meta.env.VITE_API_URL;
import { sendOtpEmail } from "../utils/sendOtpEmail";

export default function Register() {
  const [step, setStep] = useState(1); // 1: Register, 2: Verify OTP
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setMessage('');

      try {
        const response = await fetch(`${API}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          await sendOtpEmail(data.email, data.otp);
          setMessage("OTP sent to your email");
          setStep(2); // Move to OTP verification step
        } else {
          setErrors({ submit: data.message || 'Registration failed' });
        }
      } catch (error) {
        setErrors({ submit: 'Network error. Please try again.' });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setErrors({ otp: data.message || 'OTP verification failed' });
      }
    } catch (error) {
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: formData.email,
  
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
          await sendOtpEmail(data.email, data.otp);
        setMessage('New OTP sent to your email!');
      } else {
        setErrors({ submit: data.message || 'Failed to resend OTP' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 py-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center justify-center space-x-2 mb-4">
            <Briefcase className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JobPortal
            </span>
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 1 ? 'Create Account' : 'Verify Your Email'}
          </h1>
          <p className="text-gray-600">
            {step === 1 ? 'Join thousands finding their dream jobs' : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          {/* Success/Error Messages */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Registration Form */
            <div className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`p-4 border-2 rounded-xl transition flex flex-col items-center space-y-2 ${
                      formData.role === 'user'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserCircle2 className={`h-8 w-8 ${formData.role === 'user' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-semibold ${formData.role === 'user' ? 'text-blue-600' : 'text-gray-700'}`}>
                      Job Seeker
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'company' })}
                    className={`p-4 border-2 rounded-xl transition flex flex-col items-center space-y-2 ${
                      formData.role === 'company'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={`h-8 w-8 ${formData.role === 'company' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className={`font-semibold ${formData.role === 'company' ? 'text-purple-600' : 'text-gray-700'}`}>
                      Employer
                    </span>
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition ${
                      errors.name
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition ${
                      errors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />}
              </button>
            </div>
          ) : (
            /* STEP 2: OTP Verification */
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  We've sent a 6-digit code to <strong>{formData.email}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    if (errors.otp) setErrors({ ...errors, otp: '' });
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition text-center text-2xl tracking-widest ${
                    errors.otp
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
                  placeholder="000000"
                />
                {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to registration
              </button>
            </div>
          )}

          {step === 1 && (
            <>
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Google</span>
                </button>
                <button className="py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Facebook</span>
                </button>
              </div>

              {/* Sign In Link */}
              <p className="mt-8 text-center text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                  Sign in
                </a>
              </p>
            </>
          )}
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center text-sm text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}