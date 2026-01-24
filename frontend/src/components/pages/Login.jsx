import React, { useState } from 'react';
import { Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight, UserCircle2, Building2, Shield, AlertCircle } from 'lucide-react';

export default function Login() {
  const API=import.meta.env.VITE_API_URL;
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  
  // New state for handling unverified users
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [unverifiedRole, setUnverifiedRole] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage('');
    setErrors({});
    setShowVerificationPrompt(false);

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.role);
        
        setMessage('Login successful! Redirecting...');
        
        // Redirect based on role
        setTimeout(() => {
          if (data.role === 'company') {
            window.location.href = '/employer/dashboard';
          } else {
            window.location.href = '/dashboard';
          }
        }, 1500);
      } else {
        // Check if error is due to unverified email
        if (data.message === 'Email not verified') {
          setUnverifiedEmail(formData.email);
          setUnverifiedRole(formData.role);
          setShowVerificationPrompt(true);
          setErrors({ submit: data.message });
        } else {
          setErrors({ submit: data.message || 'Login failed' });
        }
      }
    } catch (error) {
      console.log(error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage('');
    setErrors({});

    try {
      const response = await fetch(`${API}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: unverifiedEmail,
          role: unverifiedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New OTP sent to your email!');
        setShowOtpInput(true);
      } else {
        setErrors({ submit: data.message || 'Failed to resend OTP' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
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
          email: unverifiedEmail,
          otp: otp,
          role: unverifiedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email verified successfully! Please login again.');
        setShowVerificationPrompt(false);
        setShowOtpInput(false);
        setOtp('');
        setFormData({ ...formData, email: unverifiedEmail });
      } else {
        setErrors({ otp: data.message || 'OTP verification failed' });
      }
    } catch (error) {
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo and Back to Home */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center justify-center space-x-2 mb-4">
            <Briefcase className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JobPortal
            </span>
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {showOtpInput ? 'Verify Your Email' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {showOtpInput ? 'Enter the OTP sent to your email' : 'Sign in to continue your job search'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          {/* Success/Error Messages */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}
          {errors.submit && !showVerificationPrompt && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Verification Prompt for Unverified Users */}
          {showVerificationPrompt && !showOtpInput && (
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-2">Email Not Verified</h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Your account exists but your email is not verified. Please verify your email to continue.
                  </p>
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!showOtpInput ? (
            /* LOGIN FORM */
            <div className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sign in as
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`p-3 border-2 rounded-xl transition flex items-center justify-center space-x-2 ${
                      formData.role === 'user'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserCircle2 className={`h-5 w-5 ${formData.role === 'user' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-semibold text-sm ${formData.role === 'user' ? 'text-blue-600' : 'text-gray-700'}`}>
                      Job Seeker
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'company' })}
                    className={`p-3 border-2 rounded-xl transition flex items-center justify-center space-x-2 ${
                      formData.role === 'company'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={`h-5 w-5 ${formData.role === 'company' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className={`font-semibold text-sm ${formData.role === 'company' ? 'text-purple-600' : 'text-gray-700'}`}>
                      Employer
                    </span>
                  </button>
                </div>
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
                    placeholder="Enter your password"
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

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />}
              </button>
            </div>
          ) : (
            /* OTP VERIFICATION FORM */
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  We've sent a 6-digit code to <strong>{unverifiedEmail}</strong>
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
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>

              <button
                onClick={() => {
                  setShowOtpInput(false);
                  setShowVerificationPrompt(false);
                  setOtp('');
                }}
                className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to login
              </button>
            </div>
          )}

          {!showOtpInput && (
            <>
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
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

              {/* Sign Up Link */}
              <p className="mt-8 text-center text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                  Sign up now
                </a>
              </p>
            </>
          )}
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center text-sm text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}